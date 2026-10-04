import { inject, provide, type InjectionKey, type Ref } from 'vue'
import type { Cuepoint, CuepointInput } from './useCuepoints'

export interface VideoPlayerContext {
  duration: Ref<number>
  cuepoints: Ref<readonly CuepointInput[]>
  activeIds: Ref<readonly string[]>
  seekToCuepoint: (cp: Cuepoint) => void
}

export const VideoPlayerKey: InjectionKey<VideoPlayerContext> = Symbol('VideoPlayer')

export function useVideoPlayerContext() {
  return inject(VideoPlayerKey, null)
}
