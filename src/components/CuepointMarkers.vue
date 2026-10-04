<template>
  <div v-show="playerDuration > 0" class="cuepoint-markers" aria-hidden="true">
    <button
      v-for="cp in resolved"
      :key="cp.id"
      type="button"
      class="cuepoint-marker"
      :class="{ 'cuepoint-marker--active': highlightedIds.includes(cp.id) }"
      :style="{ left: `${position(cp)}%` }"
      :title="`${cp.title} — ${formatTime(cp.time)}`"
      tabindex="-1"
      @click.stop="handleSelect(cp)"
    >
      <slot name="marker" :cuepoint="cp" :active="highlightedIds.includes(cp.id)">
        <span class="cuepoint-marker__pip" />
        <span class="cuepoint-marker__label">{{ cp.title }}</span>
      </slot>
    </button>
  </div>
</template>

<script setup lang="ts" generic="T = unknown">
import { computed } from 'vue'
import { normalizeCuepoints } from '../composables/useCuepoints'
import type { Cuepoint, CuepointInput } from '../composables/useCuepoints'
import { useVideoPlayerContext } from '../composables/useVideoPlayerContext'

/**
 * Renders clickable cuepoint markers positioned along a timeline.
 *
 * Place it inside the `<VideoPlayer>` default slot (it is absolutely
 * positioned over the player). Align it with the seekbar via the
 * `--cuepoint-markers-bottom|left|right` CSS custom properties.
 */
const props = withDefaults(defineProps<{
  /** Plain `{ time, title }` objects (ids are generated, same as the player). */
  cuepoints?: readonly CuepointInput<T>[]
  /** Media duration in seconds; markers are hidden until it is known. */
  duration?: number
  activeIds?: readonly string[]
}>(), {
  cuepoints: () => [],
  duration: 0,
  activeIds: () => [],
})

const context = useVideoPlayerContext()

const inputCuepoints = computed(() => (props.cuepoints.length ? props.cuepoints : (context?.cuepoints.value ?? [])) as readonly CuepointInput<T>[])
const playerDuration = computed(() => props.duration || (context?.duration.value ?? 0))
const highlightedIds = computed(() => props.activeIds.length ? props.activeIds : (context?.activeIds.value ?? []))

const resolved = computed(() => normalizeCuepoints(inputCuepoints.value))

const emit = defineEmits<{
  (e: 'select', cuepoint: Cuepoint<T>): void
}>()

function handleSelect(cp: Cuepoint<T>) {
  if (context?.seekToCuepoint) {
    context.seekToCuepoint(cp)
  }
  emit('select', cp)
}

function position(cp: Cuepoint<T>): number {
  const d = playerDuration.value
  if (!d) return 0
  return Math.min(100, Math.max(0, (cp.time / d) * 100))
}

function formatTime(s: number): string {
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}
</script>

<style scoped>
/*
 * Defaults match Chrome / Edge's native seekbar: the track runs 16px in from
 * each side and its centre line sits ~22px above the bottom edge (the pip is
 * 10px tall, so its bottom is 17px up). Override via the CSS variables below
 * for other browsers or a custom seekbar.
 */
.cuepoint-markers {
  position: absolute;
  bottom: var(--cuepoint-markers-bottom, 17px);
  left: var(--cuepoint-markers-left, 16px);
  right: var(--cuepoint-markers-right, 16px);
  height: 0;
  pointer-events: none;
}

.cuepoint-marker {
  position: absolute;
  bottom: 0;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  pointer-events: auto;
}

.cuepoint-marker__pip {
  display: block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--cuepoint-color, #22d3ee);
  border: 2px solid rgba(0, 0, 0, 0.6);
  box-shadow: 0 0 0 2px rgba(6, 182, 212, 0.3);
  transition: transform 0.15s, background 0.15s, box-shadow 0.15s;
}

.cuepoint-marker__label {
  position: absolute;
  bottom: 14px;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  font-size: 10px;
  font-weight: 600;
  color: #fff;
  background: rgba(0, 0, 0, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 2px 6px;
  border-radius: 4px;
  backdrop-filter: blur(4px);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.15s;
}

.cuepoint-marker:hover .cuepoint-marker__pip,
.cuepoint-marker--active .cuepoint-marker__pip {
  transform: scale(1.5);
  background: var(--cuepoint-active-color, #818cf8);
  box-shadow: 0 0 10px rgba(99, 102, 241, 0.7);
}

.cuepoint-marker:hover .cuepoint-marker__label,
.cuepoint-marker--active .cuepoint-marker__label {
  opacity: 1;
}
</style>
