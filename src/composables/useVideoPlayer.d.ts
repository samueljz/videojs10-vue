import { Ref } from 'vue';
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
export declare function useVideoPlayer(videoRef: Ref<HTMLVideoElement | null>, options?: VideoPlayerOptions): {
    isReady: Readonly<Ref<boolean, boolean>>;
    isPlaying: Readonly<Ref<boolean, boolean>>;
    isPaused: Readonly<Ref<boolean, boolean>>;
    isEnded: Readonly<Ref<boolean, boolean>>;
    isWaiting: Readonly<Ref<boolean, boolean>>;
    isSeeking: Readonly<Ref<boolean, boolean>>;
    isFullscreen: Readonly<Ref<boolean, boolean>>;
    currentTime: Readonly<Ref<number, number>>;
    duration: Readonly<Ref<number, number>>;
    volume: Ref<number, number>;
    isMuted: Ref<boolean, boolean>;
    play: () => Promise<void> | void;
    pause: () => void;
    togglePlay: () => void;
    seek: (time: number) => void;
    setVolume: (level: number) => void;
    toggleMute: () => void;
    toggleFullscreen: () => void;
    requestFullscreen: () => void;
    exitFullscreen: () => void;
};
