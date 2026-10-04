# videojs10-vue (Video.js 10 + Vue 3)

This repository showcases a Vue 3 component and composable that wrap the Video.js 10 (`@videojs/html`). It bridges the new Video.js reactive Media Store into Vue's reactivity system.

## Features

- **Vue 3 Composable (`useVideoPlayer`)**: A fully reactive wrapper around the Video.js 10 media store.
- **Cuepoints API (`useCuepoints`, `cuepoints` prop, `<CuepointMarkers>`)**: Time-based cues with enter/exit events, usable standalone or through `<VideoPlayer>`.
- **`<VideoPlayer>` Component**: A customizable Vue component ready for immediate use.
- **Showcase Demo**: Includes examples of a hero player with external controls, autoplay configurations, and custom styling.

## Installation

You can install this package in your own Vue 3 project:

```sh
npm install videojs10-vue @videojs/html
```

Make sure to also import the CSS in your `main.ts` or `App.vue`:

```ts
import 'videojs10-vue/style.css'
```

## Local Development (Showcase)

To run the local showcase demo:

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

## Basic Usage

You can use the `VideoPlayer` component directly in your Vue templates:

```vue
<template>
  <VideoPlayer
    src="https://cdn.jsdelivr.net/npm/big-buck-bunny-1080p/video.mp4"
    :controls="true"
  />
</template>

<script setup>
import { VideoPlayer } from 'videojs10-vue'
</script>
```

### Accessing Reactive State and Controls

You can access the player's state and control methods via a template ref:

```vue
<template>
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
import { VideoPlayer } from 'videojs10-vue'

const player = ref(null)
</script>
```

## Cuepoints

Video.js 10 (`@videojs/html` 10.0.x) has no cuepoint support yet ([videojs/v10#1442](https://github.com/videojs/v10/issues/1442); only `kind="chapters"` tracks exist), so this library provides one, backed by a hidden native `TextTrack` (`kind: 'metadata'`). If Video.js ships an official API, only `useCuepoints` needs to change.

### Setting cuepoints

Provide plain objects with a `time` (in seconds) and a `title`. The cuepoints and timeline markers are generated for you — there are no ids to manage:

```ts
import type { CuepointInput } from 'videojs10-vue'

const cuepoints: CuepointInput[] = [
  { time: 10, title: 'Chase begins' },
  { time: 22, title: 'Gotcha!' },
]
```

| Field     | Type     | Required | Description |
|-----------|----------|----------|-------------|
| `time`    | `number` | yes      | Start time in seconds. Invalid (negative / non-finite) times are ignored with a console warning. |
| `title`   | `string` | yes      | Human readable title (marker tooltip and cue text). |
| `endTime` | `number` | no       | End time in seconds. Defaults to `time + 0.5`, so the cuepoint is "active" for half a second. Set it to make a cuepoint span a range. |
| `data`    | `T`      | no       | Arbitrary payload, handed back in enter/exit callbacks. |

### With `<VideoPlayer>`

Pass the list to the `cuepoints` prop. It is reactive: add, remove or edit entries and the player stays in sync.

```vue
<template>
  <VideoPlayer
    src="video.mp4"
    :cuepoints="cuepoints"
    @cuepoint-enter="cp => console.log('Entered:', cp.title)"
    @cuepoint-exit="cp => console.log('Left:', cp.title)"
  >
    <!-- Optional: timeline markers generated from the same list -->
    <template #default="{ duration, activeCuepointIds, seekToCuepoint }">
      <CuepointMarkers
        :cuepoints="cuepoints"
        :duration="duration"
        :active-ids="activeCuepointIds"
        @select="seekToCuepoint"
      />
    </template>
  </VideoPlayer>
</template>

<script setup lang="ts">
import { VideoPlayer, CuepointMarkers, type CuepointInput } from 'videojs10-vue'

const cuepoints: CuepointInput[] = [
  { time: 10, title: 'Chase begins' },
  { time: 22, endTime: 26, title: 'Gotcha!', data: { sponsor: true } },
]
</script>
```

To also show cuepoints added at runtime as markers, pass the slot's `cuepoints` (all current cuepoints) to `<CuepointMarkers>` instead of your own list.

Events receive the cuepoint (`{ time, title, endTime?, data? }`). Skipping over a cuepoint by seeking also fires `cuepoint-enter` / `cuepoint-exit`.

Via a template ref (`ref="player"`) you can also add cuepoints at runtime:

```ts
const intro = { time: 5, title: 'Intro' }
player.value.addCuepoint(intro)
player.value.seekToCuepoint(intro)
player.value.removeCuepoint(intro)       // matched by time + title
player.value.clearCuepoints()
player.value.cuepoints                   // all cuepoints, sorted by time
player.value.activeCuepoints             // cuepoints the playhead is inside
```

### Standalone composable

Works with any `<video>` element, without `<VideoPlayer>`:

```ts
import { ref } from 'vue'
import { useCuepoints } from 'videojs10-vue'

const videoEl = ref<HTMLVideoElement | null>(null)

const { addCuepoint, activeCuepoints, seekToCuepoint } = useCuepoints(videoEl, {
  cuepoints: [{ time: 12, title: 'Highlight' }], // optional initial / reactive list
  onEnter: (cp) => console.log('entered', cp.title),
  onExit: (cp) => console.log('left', cp.title),
})

addCuepoint({ time: 30, title: 'Another one' })
```

Options: `cuepoints`, `defaultDuration` (default `0.5`), `trackLabel` (default `'Cuepoints'`), `onEnter`, `onExit`.

### Marker styling

`<CuepointMarkers>` is absolutely positioned over the player. The defaults line up with the native seekbar in Chrome / Edge (track inset 16px from each side, centred ~22px above the bottom). Native controls differ between browsers, so for other browsers or a custom seekbar adjust `--cuepoint-markers-bottom`, `--cuepoint-markers-left` and `--cuepoint-markers-right`, and colour it with `--cuepoint-color` / `--cuepoint-active-color`. Replace the marker visuals entirely with the `marker` slot (`{ cuepoint, active }`).

## Vue compiler setup

`<VideoPlayer>` renders the Video.js custom elements `video-player` and `media-container`. When consuming the **source** of this library in your own app, mark them as custom elements in `vite.config.ts` (`vue({ template: { compilerOptions: { isCustomElement: (tag) => ['video-player', 'media-container'].includes(tag) } } })`). The published bundle is precompiled and does not need this.

## API Reference

For full API documentation on the `useVideoPlayer` composable and `<VideoPlayer>` component props and events, start the dev server (`npm run dev`) and navigate to the "API Reference" section in the local app.
