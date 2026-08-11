<template>
  <div class="control-panel">
    <div class="control-panel__row">
      <!-- Playback controls -->
      <div class="control-panel__group">
        <button class="btn btn--primary btn--sm" @click="onPlay" :disabled="isPlaying && !isPaused">
          <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M8 5v14l11-7z"/></svg>
          Play
        </button>
        <button class="btn btn--secondary btn--sm" @click="onPause" :disabled="isPaused">
          <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
          Pause
        </button>
        <button class="btn btn--ghost btn--sm" @click="onToggle">
          <svg v-if="isPaused" viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M8 5v14l11-7z"/></svg>
          <svg v-else viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
          Toggle
        </button>
      </div>

      <!-- Seek controls -->
      <div class="control-panel__group">
        <button class="btn btn--secondary btn--sm" @click="onSeekBack">
          <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z"/></svg>
          −10s
        </button>
        <button class="btn btn--secondary btn--sm" @click="onSeekForward">
          <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z"/></svg>
          +10s
        </button>
      </div>

      <!-- Volume & mute -->
      <div class="control-panel__group">
        <button class="btn btn--ghost btn--sm" @click="onMute">
          <svg v-if="isMuted" viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>
          <svg v-else viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>
          {{ isMuted ? 'Unmute' : 'Mute' }}
        </button>
        <div class="control-panel__volume">
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            :value="volume"
            class="control-panel__slider"
            aria-label="Volume"
            @input="onVolumeChange"
          />
          <span class="control-panel__volume-label">{{ Math.round(volume * 100) }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface Props {
  isPlaying?: boolean;
  isPaused?: boolean;
  isMuted?: boolean;
  volume?: number;
  currentTime?: number;
  duration?: number;
}

const props = withDefaults(defineProps<Props>(), {
  isPlaying: false,
  isPaused: true,
  isMuted: false,
  volume: 1,
  currentTime: 0,
  duration: 0,
})

const emit = defineEmits<{
  (e: 'play'): void;
  (e: 'pause'): void;
  (e: 'toggle'): void;
  (e: 'seek', time: number): void;
  (e: 'volume', level: number): void;
  (e: 'mute'): void;
}>()

function onPlay()         { emit('play') }
function onPause()        { emit('pause') }
function onToggle()       { emit('toggle') }
function onSeekBack()     { emit('seek', Math.max(0, props.currentTime - 10)) }
function onSeekForward()  { emit('seek', Math.min(props.duration, props.currentTime + 10)) }
function onMute()         { emit('mute') }
function onVolumeChange(e: Event) {
  const target = e.target as HTMLInputElement;
  emit('volume', parseFloat(target.value))
}
</script>

<style scoped>
.control-panel {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-lg);
  padding: var(--space-4) var(--space-5);
}

.control-panel__row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
  align-items: center;
}

.control-panel__group {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-wrap: wrap;
}

.control-panel__group:not(:last-child) {
  padding-right: var(--space-4);
  border-right: 1px solid var(--color-border-subtle);
}

.control-panel__volume {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.control-panel__volume-label {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  min-width: 3ch;
  font-variant-numeric: tabular-nums;
}

/* Range slider */
.control-panel__slider {
  -webkit-appearance: none;
  width: 100px;
  height: 4px;
  border-radius: var(--radius-full);
  background: var(--color-bg-active);
  outline: none;
  cursor: pointer;
  accent-color: var(--color-primary);
}

.control-panel__slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--color-primary-light);
  cursor: pointer;
  box-shadow: 0 0 6px var(--color-primary-glow);
  transition: transform var(--transition-fast);
}

.control-panel__slider:hover::-webkit-slider-thumb {
  transform: scale(1.2);
}
</style>
