<template>
  <div class="cuepoints-demo">
    <!-- Player with cue markers overlaid on its own seekbar -->
    <div class="cuepoints-demo__player-wrap">
      <VideoPlayer
        ref="playerRef"
        :src="BBB_SRC"
        :poster="BBB_POSTER"
        :controls="true"
        :cuepoints="cuepoints"
        @cuepoint-enter="onCuepointEnter"
      >
        <template #default="{ duration, activeCuepointIds, seekToCuepoint }">
          <CuepointMarkers
            :cuepoints="cuepoints"
            :duration="duration"
            :active-ids="activeCuepointIds"
            @select="seekToCuepoint"
          />
        </template>
      </VideoPlayer>

      <!-- Active cue toast -->
      <transition name="cue-toast">
        <div v-if="toast" class="cue-toast" role="status" aria-live="polite">
          <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
          </svg>
          <span>Cuepoint: <strong>{{ toast }}</strong></span>
        </div>
      </transition>
    </div>

    <!-- Cuepoint list -->
    <div class="cue-list">
      <div class="cue-list__header">
        <span class="cue-list__title">Cuepoints</span>
        <span class="badge badge--accent">{{ items.length }}</span>
      </div>
      <div class="cue-list__items">
        <div
          v-for="cp in items"
          :key="cp.id"
          class="cue-item"
          :class="{ 'cue-item--active': activeIds.includes(cp.id) }"
        >
          <button class="cue-item__seek-btn" @click="playerRef?.seekToCuepoint(cp)" :title="`Seek to ${formatTime(cp.time)}`">
            <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12"><path d="M8 5v14l11-7z"/></svg>
          </button>
          <div class="cue-item__info">
            <span class="cue-item__label">{{ cp.title }}</span>
            <span class="cue-item__time">{{ formatTime(cp.time) }}</span>
          </div>
          <span v-if="activeIds.includes(cp.id)" class="badge badge--primary">Active</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import VideoPlayer from './VideoPlayer.vue'
import CuepointMarkers from './CuepointMarkers.vue'
import { normalizeCuepoints } from '../composables/useCuepoints'
import type { Cuepoint, CuepointInput } from '../composables/useCuepoints'

// ── Constants ──────────────────────────────────────────────────────────────
const BBB_SRC    = 'https://cdn.jsdelivr.net/npm/big-buck-bunny-1080p/video.mp4'
const BBB_POSTER = 'https://cdn.jsdelivr.net/npm/big-buck-bunny-1080p/poster.jpg'

const cuepoints: CuepointInput[] = [
  { time: 10, title: 'Chase begins' },
  { time: 22, title: 'Gotcha!' },
]

// Same list with generated ids — used to render the side list.
const items = normalizeCuepoints(cuepoints)

// ── State ──────────────────────────────────────────────────────────────────
const playerRef = ref<InstanceType<typeof VideoPlayer> | null>(null)
const toast     = ref<string | null>(null)
const activeIds = computed(() => playerRef.value?.activeCuepoints.map((cp) => cp.id) ?? [])

let toastTimer: ReturnType<typeof setTimeout> | null = null

function onCuepointEnter(cp: Cuepoint) {
  if (toastTimer) clearTimeout(toastTimer)
  toast.value = cp.title
  toastTimer = setTimeout(() => { toast.value = null }, 2500)
}

onBeforeUnmount(() => {
  if (toastTimer) clearTimeout(toastTimer)
})

function formatTime(s: number): string {
  const m   = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}
</script>

<style scoped>
.cuepoints-demo {
  display: grid;
  grid-template-columns: 1fr 260px;
  gap: var(--space-5);
  align-items: start;
}

/* ── Player wrap — needed for toast positioning ── */
.cuepoints-demo__player-wrap {
  position: relative;
  min-width: 0;
}

/* ── Toast ── */
.cue-toast {
  position: absolute;
  top: var(--space-3);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  background: rgba(17, 17, 27, 0.92);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-full);
  backdrop-filter: blur(12px);
  color: var(--color-text-primary);
  font-size: var(--text-sm);
  white-space: nowrap;
  box-shadow: var(--shadow-lg);
  pointer-events: none;
  z-index: 10;
}

.cue-toast svg { color: var(--color-accent-light); flex-shrink: 0; }

.cue-toast-enter-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.cue-toast-leave-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.cue-toast-enter-from  { opacity: 0; transform: translateX(-50%) translateY(-8px); }
.cue-toast-leave-to    { opacity: 0; transform: translateX(-50%) translateY(-8px); }

/* ── Cue list ── */
.cue-list {
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.cue-list__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--color-border-subtle);
  background: var(--color-bg-surface);
}

.cue-list__title {
  font-size: var(--text-xs);
  font-weight: var(--weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-muted);
}

.cue-list__items {
  padding: var(--space-2);
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.cue-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  border: 1px solid transparent;
  transition: all var(--transition-fast);
}

.cue-item:hover {
  background: var(--color-bg-surface);
  border-color: var(--color-border-subtle);
}

.cue-item--active {
  background: var(--color-primary-muted);
  border-color: var(--color-primary-light);
}

.cue-item__seek-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  border-radius: 50%;
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border-subtle);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
  padding: 0;
}

.cue-item__seek-btn:hover {
  background: var(--color-primary-muted);
  border-color: var(--color-primary-light);
  color: var(--color-primary-light);
}

.cue-item__info { flex: 1; min-width: 0; }

.cue-item__label {
  display: block;
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  color: var(--color-text-primary);
}

.cue-item--active .cue-item__label { color: var(--color-primary-light); }

.cue-item__time {
  display: block;
  font-size: var(--text-xs);
  font-family: var(--font-mono);
  color: var(--color-text-muted);
  margin-top: 1px;
}

/* ── Responsive ── */
@media (max-width: 800px) {
  .cuepoints-demo {
    grid-template-columns: 1fr;
  }
}
</style>
