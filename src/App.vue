<template>
  <aside class="app-sidebar" aria-label="Showcase navigation">
    <!-- Logo / Brand -->
    <div class="sidebar-brand">
      <div class="sidebar-brand__icon">
        <svg viewBox="0 0 32 32" fill="none" width="28" height="28">
          <rect width="32" height="32" rx="8" fill="url(#grad)"/>
          <path d="M10 11l12 5-12 5V11z" fill="white"/>
          <defs>
            <linearGradient id="grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
              <stop stop-color="#6366f1"/>
              <stop offset="1" stop-color="#06b6d4"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div>
        <div class="sidebar-brand__name">VideoPlayer</div>
        <div class="sidebar-brand__version">
          <span class="badge badge--accent">v10 beta</span>
        </div>
      </div>
    </div>

    <!-- Nav links -->
    <nav class="sidebar-nav" aria-label="Section links">
      <div class="sidebar-nav__group">
        <div class="sidebar-nav__group-label">Demos</div>
        <a
          v-for="item in navItems"
          :key="item.id"
          :href="`#${item.id}`"
          class="sidebar-nav__link"
          :class="{ 'sidebar-nav__link--active': activeSection === item.id }"
          @click.prevent="scrollToSection(item.id)"
        >
          <span class="sidebar-nav__link-icon" v-html="item.icon" />
          {{ item.label }}
        </a>
      </div>
    </nav>

    <!-- Footer -->
    <div class="sidebar-footer">
      <div class="sidebar-footer__row">
        <span class="sidebar-footer__label">@videojs/html</span>
        <span class="badge badge--primary">10.0.0-beta.26</span>
      </div>
      <div class="sidebar-footer__row sidebar-footer__row--muted">Vue 3 + Vite</div>
    </div>
  </aside>

  <main class="app-main" ref="mainEl">
    <!-- ═══════════════════════════════════════════════
         PAGE HEADER
    ═══════════════════════════════════════════════ -->
    <header class="page-header">
      <div class="page-header__eyebrow">
        <span class="badge badge--primary">Video.js 10</span>
        <span class="badge badge--accent">Vue 3</span>
      </div>
      <h1 class="page-header__title">
        <span class="text-gradient">VideoPlayer</span> Component
      </h1>
      <p class="page-header__subtitle">
        A Vue 3 composable wrapping the Video.js 10 <code>@videojs/html</code> beta,
        bridging its reactive Media Store into Vue's reactivity system.
        Big Buck Bunny powered. Dark. Premium.
      </p>
    </header>

    <!-- ═══════════════════════════════════════════════
         1. HERO PLAYER
    ═══════════════════════════════════════════════ -->
    <ShowcaseSection
      id="hero"
      title="Hero Player"
      description="Full-featured player with live reactive state display and external programmatic controls. All state updates driven by the useVideoPlayer() composable."
      badge="Featured"
    >
      <div class="hero-layout">
        <div class="hero-layout__player">
          <VideoPlayer
            ref="heroPlayer"
            :src="BBB_SRC"
            :poster="BBB_POSTER"
            :controls="true"
            @ready="heroReady = true"
          />
        </div>
        <div class="hero-layout__panel">
          <StateDisplay
            :is-ready="heroIsReady"
            :is-playing="heroIsPlaying"
            :is-paused="heroIsPaused"
            :is-ended="heroIsEnded"
            :is-waiting="heroIsWaiting"
            :is-fullscreen="heroIsFullscreen"
            :is-muted="heroIsMuted"
            :current-time="heroCurrentTime"
            :duration="heroDuration"
            :volume="heroVolume"
          />
        </div>
      </div>

      <div class="hero-controls">
        <ControlPanel
          :is-playing="heroIsPlaying"
          :is-paused="heroIsPaused"
          :is-muted="heroIsMuted"
          :volume="heroVolume"
          :current-time="heroCurrentTime"
          :duration="heroDuration"
          @play="heroPlayer?.play()"
          @pause="heroPlayer?.pause()"
          @toggle="heroPlayer?.togglePlay()"
          @seek="(t) => heroPlayer?.seek(t)"
          @mute="heroPlayer?.toggleMute()"
          @volume="(v) => heroPlayer?.setVolume(v)"
        />
      </div>
    </ShowcaseSection>

    <!-- ═══════════════════════════════════════════════
         2. DEFAULT CONFIGURATION
    ═══════════════════════════════════════════════ -->
    <ShowcaseSection
      id="default"
      title="Default Configuration"
      description="Minimal usage with only a src prop. Controls enabled by default."
    >
      <div class="demo-layout">
        <div class="demo-layout__player">
          <VideoPlayer
            :src="BBB_SRC"
            :controls="true"
          />
        </div>
        <div class="demo-layout__code">
          <CodeBlock :code="CODE_DEFAULT" lang="vue" />
        </div>
      </div>
    </ShowcaseSection>

    <!-- ═══════════════════════════════════════════════
         3. AUTOPLAY MUTED
    ═══════════════════════════════════════════════ -->
    <ShowcaseSection
      id="autoplay"
      title="Autoplay + Muted"
      description="Autoplay requires muted on most browsers. The :autoplay and :muted props wire directly through the composable."
    >
      <div class="demo-layout">
        <div class="demo-layout__player">
          <VideoPlayer
            :src="BBB_SRC"
            :autoplay="true"
            :muted="true"
            :controls="true"
            :loop="true"
          />
        </div>
        <div class="demo-layout__code">
          <CodeBlock :code="CODE_AUTOPLAY" lang="vue" />
        </div>
      </div>
    </ShowcaseSection>

    <!-- ═══════════════════════════════════════════════
         4. CUSTOM STYLED
    ═══════════════════════════════════════════════ -->
    <ShowcaseSection
      id="custom"
      title="Custom Styled"
      description="The variant='custom' prop enables alternate styling — glow shadow, larger radius — demonstrating full CSS control without Shadow DOM interference."
    >
      <div class="demo-layout">
        <div class="demo-layout__player">
          <VideoPlayer
            :src="BBB_SRC"
            :controls="true"
            variant="custom"
          />
        </div>
        <div class="demo-layout__code">
          <CodeBlock :code="CODE_CUSTOM" lang="vue" />
        </div>
      </div>
    </ShowcaseSection>

    <!-- ═══════════════════════════════════════════════
         5. API REFERENCE
    ═══════════════════════════════════════════════ -->
    <ShowcaseSection
      id="api"
      title="API Reference"
      description="Full documentation for the useVideoPlayer() composable, VideoPlayer component props, and the exposed instance API."
    >
      <!-- useVideoPlayer() -->
      <div class="api-section">
        <h3 class="api-section__title">
          <code>useVideoPlayer(videoRef, options)</code>
        </h3>
        <p class="api-section__description">
          Vue 3 composable that initializes a Video.js 10 player, bridges
          the Media Store to Vue reactivity, and exposes controls.
        </p>

        <h4 class="api-table-heading">Options</h4>
        <div class="api-table-wrap">
          <table class="api-table">
            <thead>
              <tr>
                <th>Prop</th><th>Type</th><th>Default</th><th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr><td><code>src</code></td><td><code>string | Ref&lt;string&gt;</code></td><td>—</td><td>Video source URL. Reactive.</td></tr>
              <tr><td><code>poster</code></td><td><code>string</code></td><td><code>''</code></td><td>Poster image URL.</td></tr>
              <tr><td><code>autoplay</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Autoplay on mount.</td></tr>
              <tr><td><code>controls</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Show native controls.</td></tr>
              <tr><td><code>muted</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Start muted.</td></tr>
              <tr><td><code>loop</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Loop playback.</td></tr>
            </tbody>
          </table>
        </div>

        <h4 class="api-table-heading">Returns — Reactive State</h4>
        <div class="api-table-wrap">
          <table class="api-table">
            <thead>
              <tr><th>Property</th><th>Type</th><th>Description</th></tr>
            </thead>
            <tbody>
              <tr><td><code>isReady</code></td><td><code>Readonly&lt;Ref&lt;boolean&gt;&gt;</code></td><td>Player has loaded and can play.</td></tr>
              <tr><td><code>isPlaying</code></td><td><code>Readonly&lt;Ref&lt;boolean&gt;&gt;</code></td><td>Video is actively playing.</td></tr>
              <tr><td><code>isPaused</code></td><td><code>Readonly&lt;Ref&lt;boolean&gt;&gt;</code></td><td>Playback is paused.</td></tr>
              <tr><td><code>isEnded</code></td><td><code>Readonly&lt;Ref&lt;boolean&gt;&gt;</code></td><td>Playback reached end.</td></tr>
              <tr><td><code>isWaiting</code></td><td><code>Readonly&lt;Ref&lt;boolean&gt;&gt;</code></td><td>Buffering / stalled.</td></tr>
              <tr><td><code>isSeeking</code></td><td><code>Readonly&lt;Ref&lt;boolean&gt;&gt;</code></td><td>Seek in progress.</td></tr>
              <tr><td><code>isFullscreen</code></td><td><code>Readonly&lt;Ref&lt;boolean&gt;&gt;</code></td><td>Fullscreen is active.</td></tr>
              <tr><td><code>currentTime</code></td><td><code>Readonly&lt;Ref&lt;number&gt;&gt;</code></td><td>Playback position (seconds).</td></tr>
              <tr><td><code>duration</code></td><td><code>Readonly&lt;Ref&lt;number&gt;&gt;</code></td><td>Total duration (seconds).</td></tr>
              <tr><td><code>volume</code></td><td><code>Ref&lt;number&gt;</code></td><td>Volume 0–1. Mutable.</td></tr>
              <tr><td><code>isMuted</code></td><td><code>Ref&lt;boolean&gt;</code></td><td>Muted state. Mutable.</td></tr>
            </tbody>
          </table>
        </div>

        <h4 class="api-table-heading">Returns — Controls</h4>
        <div class="api-table-wrap">
          <table class="api-table">
            <thead>
              <tr><th>Method</th><th>Signature</th><th>Description</th></tr>
            </thead>
            <tbody>
              <tr><td><code>play()</code></td><td><code>() → Promise&lt;void&gt;</code></td><td>Start playback.</td></tr>
              <tr><td><code>pause()</code></td><td><code>() → void</code></td><td>Pause playback.</td></tr>
              <tr><td><code>togglePlay()</code></td><td><code>() → void</code></td><td>Toggle play/pause.</td></tr>
              <tr><td><code>seek(time)</code></td><td><code>(seconds: number) → void</code></td><td>Seek to time position.</td></tr>
              <tr><td><code>setVolume(level)</code></td><td><code>(level: number) → void</code></td><td>Set volume 0–1 (clamped).</td></tr>
              <tr><td><code>toggleMute()</code></td><td><code>() → void</code></td><td>Toggle mute state.</td></tr>
              <tr><td><code>toggleFullscreen()</code></td><td><code>() → void</code></td><td>Toggle fullscreen.</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- VideoPlayer component props -->
      <div class="api-section">
        <h3 class="api-section__title">
          <code>&lt;VideoPlayer&gt;</code> Component Props
        </h3>
        <div class="api-table-wrap">
          <table class="api-table">
            <thead>
              <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
            </thead>
            <tbody>
              <tr><td><code>src</code></td><td><code>string</code></td><td>required</td><td>Video source URL.</td></tr>
              <tr><td><code>poster</code></td><td><code>string</code></td><td><code>''</code></td><td>Poster image.</td></tr>
              <tr><td><code>autoplay</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Autoplay on mount.</td></tr>
              <tr><td><code>controls</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Show native controls.</td></tr>
              <tr><td><code>muted</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Start muted.</td></tr>
              <tr><td><code>loop</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Loop.</td></tr>
              <tr><td><code>variant</code></td><td><code>'default' | 'minimal' | 'custom'</code></td><td><code>'default'</code></td><td>Visual style variant.</td></tr>
            </tbody>
          </table>
        </div>

        <h4 class="api-table-heading">Emits</h4>
        <div class="api-table-wrap">
          <table class="api-table">
            <thead><tr><th>Event</th><th>Payload</th><th>Description</th></tr></thead>
            <tbody>
              <tr><td><code>ready</code></td><td>—</td><td>Player ready to play.</td></tr>
              <tr><td><code>play</code></td><td>—</td><td>Playback started.</td></tr>
              <tr><td><code>pause</code></td><td>—</td><td>Playback paused.</td></tr>
              <tr><td><code>ended</code></td><td>—</td><td>Playback ended.</td></tr>
              <tr><td><code>timeupdate</code></td><td><code>number</code></td><td>Current time in seconds.</td></tr>
            </tbody>
          </table>
        </div>

        <h4 class="api-table-heading">Exposed (template ref access)</h4>
        <p class="api-section__description" style="margin-bottom: var(--space-3)">
          All reactive state and control methods are accessible via template ref:
        </p>
        <CodeBlock :code="CODE_TEMPLATE_REF" lang="vue" />
      </div>
    </ShowcaseSection>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import VideoPlayer from './components/VideoPlayer.vue'
import ShowcaseSection from './components/ShowcaseSection.vue'
import StateDisplay from './components/StateDisplay.vue'
import ControlPanel from './components/ControlPanel.vue'
import CodeBlock from './components/CodeBlock.vue'

// ── Constants ──────────────────────────────────────────────────────────────
const BBB_SRC    = 'https://cdn.jsdelivr.net/npm/big-buck-bunny-1080p/video.mp4'
const BBB_POSTER = 'https://cdn.jsdelivr.net/npm/big-buck-bunny-1080p/poster.jpg'

// ── Hero player ref ────────────────────────────────────────────────────────
const heroPlayer = ref<InstanceType<typeof VideoPlayer> | null>(null)
const heroReady  = ref(false)
const mainEl     = ref<HTMLElement | null>(null)

// ── Hero player state unwrappers ───────────────────────────────────────────
// Vue auto-unwraps refs that are exposed via defineExpose, so heroPlayer.value.isPaused
// already returns a plain boolean (not a Ref). We just need the computed to track
// heroPlayer.value reactively so the template re-renders when the player mounts.
const heroIsReady     = computed(() => heroPlayer.value?.isReady     ?? false)
const heroIsPlaying   = computed(() => heroPlayer.value?.isPlaying   ?? false)
const heroIsPaused    = computed(() => heroPlayer.value?.isPaused    ?? true)
const heroIsEnded     = computed(() => heroPlayer.value?.isEnded     ?? false)
const heroIsWaiting   = computed(() => heroPlayer.value?.isWaiting   ?? false)
const heroIsFullscreen= computed(() => heroPlayer.value?.isFullscreen?? false)
const heroIsMuted     = computed(() => heroPlayer.value?.isMuted     ?? false)
const heroCurrentTime = computed(() => heroPlayer.value?.currentTime ?? 0)
const heroDuration    = computed(() => heroPlayer.value?.duration    ?? 0)
const heroVolume      = computed(() => heroPlayer.value?.volume      ?? 1)

// ── Sidebar navigation ─────────────────────────────────────────────────────
const activeSection = ref('hero')

interface NavItem {
  id: string;
  label: string;
  icon: string;
}

const navItems: NavItem[] = [
  { id: 'hero',     label: 'Hero Player',           icon: iconPlay() },
  { id: 'default',  label: 'Default Config',         icon: iconSliders() },
  { id: 'autoplay', label: 'Autoplay + Muted',       icon: iconZap() },
  { id: 'custom',   label: 'Custom Styled',          icon: iconStar() },
  { id: 'api',      label: 'API Reference',          icon: iconCode() },
]

function scrollToSection(id: string) {
  const el = document.getElementById(id)
  el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  activeSection.value = id
}

// Track active section via IntersectionObserver
let observer: IntersectionObserver | null = null
onMounted(() => {
  const sections = navItems.map(({ id }) => document.getElementById(id)).filter((el): el is HTMLElement => el !== null)
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          activeSection.value = entry.target.id
        }
      }
    },
    { threshold: 0, rootMargin: '-20% 0px -60% 0px' }
  )
  sections.forEach((s) => observer?.observe(s))
})

onBeforeUnmount(() => {
  observer?.disconnect()
})

// ── SVG icon helpers ───────────────────────────────────────────────────────
function iconPlay()    { return `<svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M8 5v14l11-7z"/></svg>` }
function iconSliders() { return `<svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"/></svg>` }
function iconZap()     { return `<svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M7 2v11h3v9l7-12h-4l4-8z"/></svg>` }
function iconStar()    { return `<svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>` }
function iconCode()    { return `<svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/></svg>` }

// ── Code examples ──────────────────────────────────────────────────────────
const CODE_DEFAULT = `<template>
  <VideoPlayer
    src="https://example.com/video.mp4"
    :controls="true"
  />
</template>

<script setup>
import VideoPlayer from './components/VideoPlayer.vue'
<\/script>`

const CODE_AUTOPLAY = `<template>
  <VideoPlayer
    src="https://example.com/video.mp4"
    :autoplay="true"
    :muted="true"
    :controls="true"
    :loop="true"
  />
</template>

<script setup>
import VideoPlayer from './components/VideoPlayer.vue'
<\/script>`

const CODE_CUSTOM = `<template>
  <!-- variant="custom" applies glow shadow + larger radius -->
  <VideoPlayer
    src="https://example.com/video.mp4"
    :controls="true"
    variant="custom"
  />
</template>

<script setup>
import VideoPlayer from './components/VideoPlayer.vue'
<\/script>`

const CODE_TEMPLATE_REF = `<template>
  <VideoPlayer ref="player" src="video.mp4" />

  <!-- Read reactive state directly from template -->
  <p>{{ player?.currentTime?.toFixed(1) }}s / {{ player?.duration?.toFixed(0) }}s</p>

  <!-- Call controls via ref -->
  <button @click="player?.togglePlay()">
    {{ player?.isPlaying ? 'Pause' : 'Play' }}
  </button>
</template>

<script setup>
import { ref } from 'vue'
import VideoPlayer from './components/VideoPlayer.vue'

const player = ref(null)
<\/script>`
</script>

<style scoped>
/* ── Page header ── */
.page-header {
  margin-bottom: var(--space-16);
  padding-bottom: var(--space-12);
  border-bottom: 1px solid var(--color-border-subtle);
}

.page-header__eyebrow {
  display: flex;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
}

.page-header__title {
  font-size: var(--text-4xl);
  font-weight: var(--weight-bold);
  line-height: var(--leading-tight);
  margin-bottom: var(--space-4);
  letter-spacing: -0.03em;
}

.page-header__subtitle {
  font-size: var(--text-lg);
  color: var(--color-text-secondary);
  line-height: var(--leading-loose);
  max-width: 60ch;
}

.page-header__subtitle code {
  font-family: var(--font-mono);
  font-size: 0.9em;
  color: var(--color-accent-light);
  background: var(--color-bg-elevated);
  padding: 1px 6px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border-subtle);
}

/* ── Sidebar brand ── */
.sidebar-brand {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-5) var(--space-5) var(--space-4);
  border-bottom: 1px solid var(--color-border-subtle);
}

.sidebar-brand__icon {
  flex-shrink: 0;
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.sidebar-brand__name {
  font-weight: var(--weight-semibold);
  font-size: var(--text-base);
  color: var(--color-text-primary);
  line-height: 1.2;
}

.sidebar-brand__version {
  margin-top: var(--space-1);
}

/* ── Sidebar nav ── */
.sidebar-nav {
  flex: 1;
  padding: var(--space-4) var(--space-3);
}

.sidebar-nav__group-label {
  font-size: var(--text-xs);
  font-weight: var(--weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text-muted);
  padding: var(--space-2) var(--space-3);
  margin-bottom: var(--space-1);
}

.sidebar-nav__link {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: all var(--transition-fast);
  margin-bottom: 2px;
}

.sidebar-nav__link:hover {
  background: var(--color-bg-elevated);
  color: var(--color-text-primary);
}

.sidebar-nav__link--active {
  background: var(--color-primary-muted);
  color: var(--color-primary-light);
}

.sidebar-nav__link-icon {
  display: flex;
  align-items: center;
  opacity: 0.7;
}

.sidebar-nav__link--active .sidebar-nav__link-icon {
  opacity: 1;
}

/* ── Sidebar footer ── */
.sidebar-footer {
  padding: var(--space-4) var(--space-5);
  border-top: 1px solid var(--color-border-subtle);
}

.sidebar-footer__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
}

.sidebar-footer__row + .sidebar-footer__row {
  margin-top: var(--space-2);
}

.sidebar-footer__row--muted {
  color: var(--color-text-muted);
}

.sidebar-footer__label {
  font-family: var(--font-mono);
}

/* ── Hero layout ── */
.hero-layout {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: var(--space-5);
  align-items: start;
  margin-bottom: var(--space-5);
}

@media (max-width: 900px) {
  .hero-layout {
    grid-template-columns: 1fr;
  }
}

.hero-layout__player { min-width: 0; }
.hero-layout__panel  { flex-shrink: 0; }

.hero-controls {
  margin-top: var(--space-4);
}

/* ── Demo layout (player + code) ── */
.demo-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-6);
  align-items: start;
}

@media (max-width: 800px) {
  .demo-layout {
    grid-template-columns: 1fr;
  }
}

.demo-layout__player { min-width: 0; }
.demo-layout__code   { min-width: 0; }

/* ── API Reference ── */
.api-section {
  margin-bottom: var(--space-10);
}

.api-section + .api-section {
  padding-top: var(--space-8);
  border-top: 1px solid var(--color-border-subtle);
}

.api-section__title {
  font-size: var(--text-lg);
  font-weight: var(--weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-2);
}

.api-section__title code {
  font-family: var(--font-mono);
  font-size: 0.95em;
  color: var(--color-accent-light);
}

.api-section__description {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: var(--leading-loose);
  margin-bottom: var(--space-5);
  max-width: 72ch;
}

.api-table-heading {
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
  color: var(--color-text-secondary);
  margin: var(--space-5) 0 var(--space-3);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: var(--text-xs);
}

.api-table-wrap {
  overflow-x: auto;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-subtle);
  margin-bottom: var(--space-5);
}

.api-table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--text-sm);
}

.api-table thead {
  background: var(--color-bg-elevated);
  border-bottom: 1px solid var(--color-border-default);
}

.api-table th {
  text-align: left;
  padding: var(--space-3) var(--space-4);
  font-size: var(--text-xs);
  font-weight: var(--weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-muted);
  white-space: nowrap;
}

.api-table td {
  padding: var(--space-3) var(--space-4);
  color: var(--color-text-secondary);
  border-bottom: 1px solid var(--color-border-subtle);
  vertical-align: top;
  line-height: var(--leading-normal);
}

.api-table tbody tr:last-child td {
  border-bottom: none;
}

.api-table tbody tr:hover td {
  background: var(--color-bg-elevated);
}

.api-table code {
  font-family: var(--font-mono);
  font-size: 0.9em;
  color: var(--color-accent-light);
  background: rgba(6, 182, 212, 0.07);
  padding: 1px 5px;
  border-radius: var(--radius-sm);
}

.api-table td:first-child code {
  color: var(--color-primary-light);
  background: var(--color-primary-muted);
}
</style>
