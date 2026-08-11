/**
 * useVideoPlayer — Vue 3 composable wrapping Video.js 10 (@videojs/html)
 *
 * Architecture:
 * - Uses the `create()` store factory from createPlayer() for imperative access
 * - Attaches store to a <video> element via store.attach(videoEl)
 * - Bridges the v10 Media Store into Vue refs via store.subscribe() / DOM events
 *
 * @see https://videojs.org/docs/framework/html
 */

import { ref, shallowRef, readonly, onMounted, onBeforeUnmount, watch, toValue } from 'vue'
import type { Ref } from 'vue'
import { createPlayer, selectPlayback, selectTime, selectVolume, selectFullscreen } from '@videojs/html'
import { videoFeatures } from '@videojs/html/video'

// Shared player factory — one factory per feature set, N instances via create()
const { create } = createPlayer({ features: videoFeatures })

export interface VideoPlayerOptions {
  src?: string | Ref<string>;
  poster?: string;
  autoplay?: boolean;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
}

/**
 * Creates a Video.js 10 player bound to a <video> element ref.
 *
 * @param videoRef - Ref pointing to the <video> element
 * @param options - Player configuration options
 */
export function useVideoPlayer(videoRef: Ref<HTMLVideoElement | null>, options: VideoPlayerOptions = {}) {
  // ── Internal store instance (non-reactive, mutable) ────────────────────────
  let _store: any = null
  let _detach: (() => void) | null = null
  let _abortCtrl: (AbortController & { _storeUnsub?: () => void }) | null = null

  // ── Ready state ────────────────────────────────────────────────────────────
  const isReady = ref(false)

  // ── Reactive state refs ────────────────────────────────────────────────────
  const isPlaying    = ref(false)
  const isPaused     = ref(true)
  const isEnded      = ref(false)
  const isWaiting    = ref(false)
  const isSeeking    = ref(false)
  const currentTime  = ref(0)
  const duration     = ref(0)
  const volume       = ref(1)
  const isMuted      = ref(false)
  const isFullscreen = ref(false)

  // ── Sync from v10 store state ──────────────────────────────────────────────
  function syncFromStoreState(state: any) {
    if (!state) return

    const playback   = selectPlayback(state)
    const time       = selectTime(state)
    const vol        = selectVolume(state)
    const fullscreen = selectFullscreen(state)

    if (playback) {
      isPaused.value   = !!playback.paused
      isPlaying.value  = !playback.paused && !playback.ended
      isEnded.value    = !!playback.ended
      isWaiting.value  = !!playback.waiting
    }
    if (time) {
      currentTime.value = time.currentTime ?? 0
      duration.value    = time.duration    ?? 0
      isSeeking.value   = !!time.seeking
    }
    if (vol) {
      volume.value  = vol.volume ?? 1
      isMuted.value = !!vol.muted
    }
    if (fullscreen) {
      isFullscreen.value = !!fullscreen.fullscreen
    }
  }

  // ── Mount ──────────────────────────────────────────────────────────────────
  onMounted(() => {
    const videoEl = toValue(videoRef)
    if (!videoEl) return

    // Create store instance
    _store = create()

    // Attach store to native <video> element — this is the v10 media bridge
    _detach = _store.attach(videoEl)

    // Configure video element from options
    const srcVal = toValue(options.src)
    if (srcVal)              videoEl.src       = srcVal
    if (options.poster)      videoEl.poster    = options.poster
    if (options.autoplay)    videoEl.autoplay  = true
    if (options.muted)       videoEl.muted     = true
    if (options.loop)        videoEl.loop      = true
    if (options.controls !== false) videoEl.controls = true

    // Subscribe to store: fires whenever any state slice changes
    const unsubStore = _store.subscribe(() => {
      syncFromStoreState(_store.state)
    })

    // Initial sync
    syncFromStoreState(_store.state)

    // DOM events (supplement store subscription; also reliable fallback)
    _abortCtrl = new AbortController()
    const evtOpts = { signal: _abortCtrl.signal }

    videoEl.addEventListener('loadedmetadata', () => {
      isReady.value    = true
      duration.value   = videoEl.duration || 0
    }, evtOpts)

    videoEl.addEventListener('canplay', () => {
      isReady.value = true
    }, evtOpts)

    videoEl.addEventListener('play', () => {
      isPlaying.value  = true
      isPaused.value   = false
      isEnded.value    = false
    }, evtOpts)

    videoEl.addEventListener('pause', () => {
      isPlaying.value = false
      isPaused.value  = true
    }, evtOpts)

    videoEl.addEventListener('ended', () => {
      isPlaying.value = false
      isEnded.value   = true
    }, evtOpts)

    videoEl.addEventListener('timeupdate', () => {
      currentTime.value = videoEl.currentTime || 0
    }, evtOpts)

    videoEl.addEventListener('durationchange', () => {
      duration.value = isNaN(videoEl.duration) ? 0 : videoEl.duration
    }, evtOpts)

    videoEl.addEventListener('volumechange', () => {
      volume.value  = videoEl.volume  ?? 1
      isMuted.value = videoEl.muted   ?? false
    }, evtOpts)

    videoEl.addEventListener('waiting',  () => { isWaiting.value  = true  }, evtOpts)
    videoEl.addEventListener('playing',  () => { isWaiting.value  = false }, evtOpts)
    videoEl.addEventListener('seeking',  () => { isSeeking.value  = true  }, evtOpts)
    videoEl.addEventListener('seeked',   () => { isSeeking.value  = false }, evtOpts)

    videoEl.addEventListener('fullscreenchange', () => {
      isFullscreen.value = !!document.fullscreenElement
    }, evtOpts)

    // Store unsub for store subscription cleanup
    _abortCtrl._storeUnsub = unsubStore
  })

  // ── Unmount ────────────────────────────────────────────────────────────────
  onBeforeUnmount(() => {
    _abortCtrl?._storeUnsub?.()
    _abortCtrl?.abort()
    _detach?.()
    _store?.destroy?.()
    _store = null
    _detach = null
    _abortCtrl = null
    isReady.value = false
  })

  // ── Watch src prop changes ─────────────────────────────────────────────────
  if (options.src !== undefined) {
    watch(
      () => toValue(options.src),
      (newSrc) => {
        const videoEl = toValue(videoRef)
        if (videoEl && newSrc) {
          videoEl.src = newSrc
          videoEl.load()
          isReady.value     = false
          currentTime.value = 0
          duration.value    = 0
        }
      }
    )
  }

  // ── Control functions ──────────────────────────────────────────────────────
  // The v10 store's attach() syncs state FROM the native element via events,
  // so the correct pattern is to drive the native <video> element directly.
  function play(): Promise<void> | void {
    return toValue(videoRef)?.play()
  }

  function pause(): void {
    toValue(videoRef)?.pause()
  }

  function togglePlay(): void {
    isPaused.value ? play() : pause()
  }

  function seek(time: number): void {
    const videoEl = toValue(videoRef)
    if (videoEl) videoEl.currentTime = time
  }

  function setVolume(level: number): void {
    const clamped = Math.max(0, Math.min(1, level))
    volume.value = clamped
    const videoEl = toValue(videoRef)
    if (videoEl) videoEl.volume = clamped
  }

  function toggleMute(): void {
    const videoEl = toValue(videoRef)
    if (videoEl) videoEl.muted = !videoEl.muted
  }

  function toggleFullscreen(): void {
    const videoEl = toValue(videoRef)
    if (!document.fullscreenElement) {
      videoEl?.requestFullscreen?.()
    } else {
      document.exitFullscreen?.()
    }
  }

  function requestFullscreen(): void {
    toValue(videoRef)?.requestFullscreen?.()
  }

  function exitFullscreen(): void {
    document.exitFullscreen?.()
  }

  // ── Expose ─────────────────────────────────────────────────────────────────
  return {
    // Reactive state (readonly to enforce single direction)
    isReady:      readonly(isReady),
    isPlaying:    readonly(isPlaying),
    isPaused:     readonly(isPaused),
    isEnded:      readonly(isEnded),
    isWaiting:    readonly(isWaiting),
    isSeeking:    readonly(isSeeking),
    isFullscreen: readonly(isFullscreen),
    currentTime:  readonly(currentTime),
    duration:     readonly(duration),
    volume,   // mutable — usable with v-model via ControlPanel
    isMuted,  // mutable — usable with toggle binding

    // Controls
    play,
    pause,
    togglePlay,
    seek,
    setVolume,
    toggleMute,
    toggleFullscreen,
    requestFullscreen,
    exitFullscreen,
  }
}
