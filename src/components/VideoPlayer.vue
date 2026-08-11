<template>
  <div
    ref="container"
    class="video-player"
    :class="[
      `video-player--${variant}`,
      { 'video-player--fullscreen': isFullscreen }
    ]"
  >
    <video
      ref="videoEl"
      class="video-player__video"
      playsinline
      :poster="poster"
    />

    <!-- Loading overlay -->
    <transition name="fade">
      <div v-if="isWaiting && !isPaused" class="video-player__overlay video-player__overlay--loading">
        <div class="video-player__spinner" aria-label="Loading…" />
      </div>
    </transition>

    <!-- Ended overlay -->
    <transition name="fade">
      <div v-if="isEnded" class="video-player__overlay video-player__overlay--ended">
        <button class="video-player__replay-btn" @click="replayVideo" aria-label="Replay">
          <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
            <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
          </svg>
          <span>Replay</span>
        </button>
      </div>
    </transition>

    <!-- Slot for custom overlays -->
    <slot
      :is-ready="isReady"
      :is-playing="isPlaying"
      :is-paused="isPaused"
      :current-time="currentTime"
      :duration="duration"
      :volume="volume"
      :is-muted="isMuted"
      :play="play"
      :pause="pause"
      :toggle-play="togglePlay"
      :seek="seek"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useVideoPlayer } from '../composables/useVideoPlayer'

export interface Props {
  src: string;
  poster?: string;
  autoplay?: boolean;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
  options?: Record<string, any>;
  variant?: 'default' | 'minimal' | 'custom';
}

const props = withDefaults(defineProps<Props>(), {
  poster: '',
  autoplay: false,
  controls: true,
  muted: false,
  loop: false,
  options: () => ({}),
  variant: 'default',
})

const emit = defineEmits<{
  (e: 'ready'): void;
  (e: 'play'): void;
  (e: 'pause'): void;
  (e: 'ended'): void;
  (e: 'timeupdate', time: number): void;
  (e: 'error'): void;
}>()

// ── Template refs ─────────────────────────────────────────────────────────
const videoEl = ref<HTMLVideoElement | null>(null)
const container = ref<HTMLElement | null>(null)

// ── Composable ────────────────────────────────────────────────────────────
const {
  isReady,
  isPlaying,
  isPaused,
  isEnded,
  isWaiting,
  isSeeking,
  isFullscreen,
  currentTime,
  duration,
  volume,
  isMuted,
  play,
  pause,
  togglePlay,
  seek,
  setVolume,
  toggleMute,
  toggleFullscreen,
  requestFullscreen,
  exitFullscreen,
} = useVideoPlayer(videoEl, {
  src:      props.src,
  poster:   props.poster,
  autoplay: props.autoplay,
  muted:    props.muted,
  loop:     props.loop,
  controls: props.controls,
})

// ── Watch props → emit events ──────────────────────────────────────────────
watch(isReady,     (v) => { if (v) emit('ready') })
watch(isPlaying,   (v) => { if (v) emit('play') })
watch(isPaused,    (v) => { if (v) emit('pause') })
watch(isEnded,     (v) => { if (v) emit('ended') })
watch(currentTime, (v) => { emit('timeupdate', v) })

// ── Replay ─────────────────────────────────────────────────────────────────
function replayVideo() {
  seek(0)
  play()
}

// ── Expose to parent via template ref ─────────────────────────────────────
defineExpose({
  // State
  isReady,
  isPlaying,
  isPaused,
  isEnded,
  isWaiting,
  isSeeking,
  isFullscreen,
  currentTime,
  duration,
  volume,
  isMuted,
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
})
</script>

<style scoped>
.video-player {
  position: relative;
  width: 100%;
  background: #000;
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-xl);
  aspect-ratio: 16 / 9;
  container-type: inline-size;
}

.video-player--custom {
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-xl), var(--shadow-glow-primary);
  outline: 1px solid var(--color-border-default);
}

.video-player--fullscreen {
  border-radius: 0;
}

.video-player__video {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

/* ── Overlays ── */
.video-player__overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.video-player__overlay--loading {
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(2px);
}

.video-player__overlay--ended {
  background: rgba(0, 0, 0, 0.65);
  pointer-events: auto;
}

/* Loading spinner */
.video-player__spinner {
  width: 48px;
  height: 48px;
  border: 3px solid rgba(255, 255, 255, 0.15);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Replay button */
.video-player__replay-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-4) var(--space-6);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-xl);
  color: #fff;
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  cursor: pointer;
  transition: all var(--transition-fast);
  backdrop-filter: blur(8px);
}

.video-player__replay-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active { transition: opacity var(--transition-fast); }
.fade-enter-from,
.fade-leave-to { opacity: 0; }
</style>
