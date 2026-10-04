/**
 * useCuepoints — framework-level cuepoint API for a `<video>` element.
 *
 * Video.js 10 (`@videojs/html` 10.0.x) has no cuepoint support yet (only
 * `kind="chapters"` tracks; see https://github.com/videojs/v10/issues/1442),
 * so this composable implements cuepoints on top of the native, hidden
 * `TextTrack` (`kind: 'metadata'`) API. Per-cue `enter` / `exit` events are
 * used (rather than the track-level `cuechange`) because they also fire for
 * cues that were skipped over between two time updates.
 *
 * It can be used standalone with any `<video>` ref, or via the `cuepoints`
 * prop / `cuepoint-enter` / `cuepoint-exit` events of `<VideoPlayer>`.
 */

import { computed, onScopeDispose, shallowRef, toValue, watch } from 'vue'
import type { ComputedRef, MaybeRefOrGetter, ShallowRef } from 'vue'

/**
 * What you provide: only `time` and `title` are required. Ids are internal to
 * the API and generated for you.
 *
 * @example { time: 10, title: 'Chase begins' }
 */
export interface CuepointInput<T = unknown> {
  /** Start time in seconds. */
  time: number
  /** Human readable title. */
  title: string
  /** Optional end time in seconds. Defaults to `time + defaultDuration`. */
  endTime?: number
  /** Arbitrary payload handed back in enter / exit callbacks. */
  data?: T
}

/**
 * A generated cuepoint: a {@link CuepointInput} plus an internal `id`.
 * The `id` is read-only information — you never need to supply it.
 */
export interface Cuepoint<T = unknown> extends CuepointInput<T> {
  readonly id: string
}

/** Deterministic internal id derived from time + title (e.g. `cuepoint-10-chase-begins`). */
function generateCuepointId(input: Pick<CuepointInput, 'time' | 'title'>): string {
  const slug = String(input.title ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return `cuepoint-${input.time}${slug ? `-${slug}` : ''}`
}

/**
 * Turns user-provided cuepoint objects into full cuepoints: generates internal
 * ids (stable for the same input), de-duplicates them and drops invalid times.
 */
export function normalizeCuepoints<T = unknown>(
  list: readonly CuepointInput<T>[] | undefined,
): Cuepoint<T>[] {
  const seen = new Set<string>()
  const result: Cuepoint<T>[] = []
  for (const input of list ?? []) {
    if (!Number.isFinite(input.time) || input.time < 0) {
      console.warn('[useCuepoints] Ignoring cuepoint with invalid time:', input)
      continue
    }
    const base = generateCuepointId(input)
    let id = base
    for (let n = 2; seen.has(id); n++) id = `${base}-${n}`
    seen.add(id)
    const { time, title, endTime, data } = input
    result.push({ time, title, endTime, data, id })
  }
  return result
}

export interface UseCuepointsOptions<T = unknown> {
  /** Cuepoints to register. May be a ref / getter; changes are synced. */
  cuepoints?: MaybeRefOrGetter<readonly CuepointInput<T>[] | undefined>
  /** Length (seconds) of a cue without `endTime`. @default 0.5 */
  defaultDuration?: number
  /** Label of the underlying TextTrack. @default 'Cuepoints' */
  trackLabel?: string
  /** Called when playback enters a cuepoint (including via seeking). */
  onEnter?: (cuepoint: Cuepoint<T>) => void
  /** Called when playback leaves a cuepoint. */
  onExit?: (cuepoint: Cuepoint<T>) => void
}

export interface UseCuepointsReturn<T = unknown> {
  /** All registered cuepoints, sorted by time. */
  cuepoints: ComputedRef<Cuepoint<T>[]>
  /** Ids of the cuepoints the playhead is currently inside. */
  activeIds: Readonly<ShallowRef<readonly string[]>>
  /** Cuepoints the playhead is currently inside. */
  activeCuepoints: ComputedRef<Cuepoint<T>[]>
  /** Add a cuepoint (adding the same time + title again replaces it). */
  addCuepoint: (cuepoint: CuepointInput<T>) => Cuepoint<T> | undefined
  /** Remove a cuepoint (pass the cuepoint, or its `{ time, title }`). Returns whether it existed. */
  removeCuepoint: (cuepoint: CuepointInput<T>) => boolean
  /** Remove every cuepoint. */
  clearCuepoints: () => void
  /** Seek the media to a cuepoint. */
  seekToCuepoint: (cuepoint: CuepointInput<T>) => void
}

const DEFAULT_CUE_DURATION = 0.5

interface Entry<T> {
  cuepoint: Cuepoint<T>
  dispose: () => void
}

export function useCuepoints<T = unknown>(
  videoRef: MaybeRefOrGetter<HTMLVideoElement | null | undefined>,
  options: UseCuepointsOptions<T> = {},
): UseCuepointsReturn<T> {
  const defaultDuration = options.defaultDuration ?? DEFAULT_CUE_DURATION

  // Source of truth. Cuepoints can be registered before the <video> exists.
  const registry = shallowRef(new Map<string, Cuepoint<T>>())
  const activeIds = shallowRef<readonly string[]>([])

  const cuepoints = computed(() =>
    [...registry.value.values()].sort((a, b) => a.time - b.time),
  )
  const activeCuepoints = computed(() =>
    activeIds.value
      .map((id) => registry.value.get(id))
      .filter((cp): cp is Cuepoint<T> => !!cp),
  )

  // ── Native track plumbing ──────────────────────────────────────────────
  let track: TextTrack | null = null
  let attachedEl: HTMLVideoElement | null = null
  const entries = new Map<string, Entry<T>>()

  function setActive(id: string, active: boolean) {
    const has = activeIds.value.includes(id)
    if (active === has) return
    activeIds.value = active
      ? [...activeIds.value, id]
      : activeIds.value.filter((x) => x !== id)
  }

  function mountCue(cuepoint: Cuepoint<T>, target: TextTrack): Entry<T> {
    const end = Math.max(cuepoint.endTime ?? cuepoint.time + defaultDuration, cuepoint.time)
    const cue = new VTTCue(cuepoint.time, end, cuepoint.title)
    cue.id = cuepoint.id

    const onEnter = () => {
      setActive(cuepoint.id, true)
      options.onEnter?.(cuepoint)
    }
    const onExit = () => {
      setActive(cuepoint.id, false)
      options.onExit?.(cuepoint)
    }
    cue.addEventListener('enter', onEnter)
    cue.addEventListener('exit', onExit)
    target.addCue(cue)

    return {
      cuepoint,
      dispose: () => {
        cue.removeEventListener('enter', onEnter)
        cue.removeEventListener('exit', onExit)
        try { target.removeCue(cue) } catch { /* cue already gone */ }
      },
    }
  }

  function unmountCue(id: string, notify = true) {
    const entry = entries.get(id)
    if (!entry) return
    entry.dispose()
    entries.delete(id)
    if (activeIds.value.includes(id)) {
      setActive(id, false)
      if (notify) options.onExit?.(entry.cuepoint)
    }
  }

  function sameCuepoint(a: Cuepoint<T>, b: Cuepoint<T>) {
    return a.time === b.time && a.endTime === b.endTime && a.title === b.title && a.data === b.data
  }

  /** Reconcile native cues with the registry. No-op until a track exists. */
  function sync() {
    if (!track) return
    for (const id of [...entries.keys()]) {
      const next = registry.value.get(id)
      if (!next || !sameCuepoint(next, entries.get(id)!.cuepoint)) unmountCue(id)
    }
    for (const [id, cuepoint] of registry.value) {
      if (!entries.has(id)) entries.set(id, mountCue(cuepoint, track))
    }
  }

  function detach() {
    for (const id of [...entries.keys()]) unmountCue(id, false)
    if (track) track.mode = 'disabled'
    track = null
    attachedEl = null
    activeIds.value = []
  }


  function attach(el: HTMLVideoElement) {
    track = el.addTextTrack('metadata', options.trackLabel ?? 'Cuepoints', 'en')
    // 'hidden' keeps cue events firing without rendering anything.
    track.mode = 'hidden'
    attachedEl = el
    sync()
  }

  watch(
    () => toValue(videoRef) ?? null,
    (el) => {
      if (el === attachedEl) return
      detach()
      if (el) attach(el)
    },
    { immediate: true, flush: 'post' },
  )

  // Declarative cuepoints option.
  if (options.cuepoints !== undefined) {
    watch(
      () => toValue(options.cuepoints),
      (list) => {
        registry.value = new Map(normalizeCuepoints(list).map((cp) => [cp.id, cp]))
        sync()
      },
      { immediate: true, deep: true },
    )
  }

  onScopeDispose(detach)

  // ── Imperative API ─────────────────────────────────────────────────────
  function addCuepoint(input: CuepointInput<T>): Cuepoint<T> | undefined {
    if (!Number.isFinite(input.time) || input.time < 0) {
      console.warn('[useCuepoints] Ignoring cuepoint with invalid time:', input)
      return undefined
    }
    const { time, title, endTime, data } = input
    const cuepoint: Cuepoint<T> = { time, title, endTime, data, id: generateCuepointId(input) }
    const next = new Map(registry.value)
    next.set(cuepoint.id, cuepoint)
    registry.value = next
    sync()
    return cuepoint
  }

  function removeCuepoint(target: CuepointInput<T>): boolean {
    const id = generateCuepointId(target)
    if (!registry.value.has(id)) return false
    const next = new Map(registry.value)
    next.delete(id)
    registry.value = next
    sync()
    return true
  }

  function clearCuepoints() {
    registry.value = new Map()
    sync()
  }

  function seekToCuepoint(target: CuepointInput<T>) {
    const el = toValue(videoRef)
    if (el && Number.isFinite(target.time)) el.currentTime = target.time
  }

  return {
    cuepoints,
    activeIds,
    activeCuepoints,
    addCuepoint,
    removeCuepoint,
    clearCuepoints,
    seekToCuepoint,
  }
}
