<template>
  <div class="state-display">
    <h3 class="state-display__label">Live State</h3>
    <div class="state-display__grid">
      <div v-for="item in stateItems" :key="item.key" class="state-item">
        <span class="state-item__key">{{ item.key }}</span>
        <span class="state-item__value" :class="item.class">{{ item.formatted }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface Props {
  isReady?: boolean;
  isPlaying?: boolean;
  isPaused?: boolean;
  isEnded?: boolean;
  isWaiting?: boolean;
  isFullscreen?: boolean;
  isMuted?: boolean;
  currentTime?: number;
  duration?: number;
  volume?: number;
}

const props = withDefaults(defineProps<Props>(), {
  isReady: false,
  isPlaying: false,
  isPaused: true,
  isEnded: false,
  isWaiting: false,
  isFullscreen: false,
  isMuted: false,
  currentTime: 0,
  duration: 0,
  volume: 1,
})

function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

function formatBool(v: boolean): string {
  return v ? 'true' : 'false'
}

const stateItems = computed(() => [
  {
    key: 'isReady',
    formatted: formatBool(props.isReady),
    class: props.isReady ? 'state-item__value--true' : 'state-item__value--false',
  },
  {
    key: 'isPlaying',
    formatted: formatBool(props.isPlaying),
    class: props.isPlaying ? 'state-item__value--true' : 'state-item__value--false',
  },
  {
    key: 'isPaused',
    formatted: formatBool(props.isPaused),
    class: props.isPaused ? 'state-item__value--neutral' : 'state-item__value--false',
  },
  {
    key: 'isEnded',
    formatted: formatBool(props.isEnded),
    class: props.isEnded ? 'state-item__value--neutral' : 'state-item__value--false',
  },
  {
    key: 'isWaiting',
    formatted: formatBool(props.isWaiting),
    class: props.isWaiting ? 'state-item__value--neutral' : 'state-item__value--false',
  },
  {
    key: 'isFullscreen',
    formatted: formatBool(props.isFullscreen),
    class: 'state-item__value--neutral',
  },
  {
    key: 'isMuted',
    formatted: formatBool(props.isMuted),
    class: props.isMuted ? 'state-item__value--neutral' : 'state-item__value--false',
  },
  {
    key: 'currentTime',
    formatted: formatTime(props.currentTime),
    class: 'state-item__value--number',
  },
  {
    key: 'duration',
    formatted: formatTime(props.duration),
    class: 'state-item__value--number',
  },
  {
    key: 'volume',
    formatted: `${Math.round(props.volume * 100)}%`,
    class: 'state-item__value--number',
  },
])
</script>

<style scoped>
.state-display {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-lg);
  padding: var(--space-4) var(--space-5);
  min-width: 220px;
}

.state-display__label {
  font-size: var(--text-xs);
  font-weight: var(--weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text-muted);
  margin-bottom: var(--space-4);
}

.state-display__grid {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.state-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  padding: var(--space-1) 0;
  border-bottom: 1px solid var(--color-border-subtle);
}

.state-item:last-child {
  border-bottom: none;
}

.state-item__key {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  flex-shrink: 0;
}

.state-item__value {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  font-weight: var(--weight-medium);
  text-align: right;
}

.state-item__value--true    { color: var(--color-success); }
.state-item__value--false   { color: var(--color-text-muted); }
.state-item__value--neutral { color: var(--color-warning); }
.state-item__value--number  { color: var(--color-accent-light); font-variant-numeric: tabular-nums; }
</style>
