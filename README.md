# videojs10-vue (Video.js 10 + Vue 3)

This repository showcases a Vue 3 component and composable that wrap the Video.js 10 (`@videojs/html`) beta. It bridges the new Video.js reactive Media Store into Vue's reactivity system.

## Features

- **Vue 3 Composable (`useVideoPlayer`)**: A fully reactive wrapper around the Video.js 10 media store.
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

## API Reference

For full API documentation on the `useVideoPlayer` composable and `<VideoPlayer>` component props and events, start the dev server (`npm run dev`) and navigate to the "API Reference" section in the local app.
