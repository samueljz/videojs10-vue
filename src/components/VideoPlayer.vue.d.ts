interface Props {
    src: string;
    poster?: string;
    autoplay?: boolean;
    controls?: boolean;
    muted?: boolean;
    loop?: boolean;
    options?: Record<string, any>;
    variant?: 'default' | 'minimal' | 'custom';
}
declare function __VLS_template(): {
    attrs: Partial<{}>;
    slots: {
        default?(_: {
            isReady: boolean;
            isPlaying: boolean;
            isPaused: boolean;
            currentTime: number;
            duration: number;
            volume: number;
            isMuted: boolean;
            play: () => Promise<void> | void;
            pause: () => void;
            togglePlay: () => void;
            seek: (time: number) => void;
        }): any;
    };
    refs: {
        container: HTMLDivElement;
        videoEl: HTMLVideoElement;
    };
    rootEl: HTMLDivElement;
};
type __VLS_TemplateResult = ReturnType<typeof __VLS_template>;
declare const __VLS_component: import('vue').DefineComponent<Props, {
    isReady: Readonly<import('vue').Ref<boolean, boolean>>;
    isPlaying: Readonly<import('vue').Ref<boolean, boolean>>;
    isPaused: Readonly<import('vue').Ref<boolean, boolean>>;
    isEnded: Readonly<import('vue').Ref<boolean, boolean>>;
    isWaiting: Readonly<import('vue').Ref<boolean, boolean>>;
    isSeeking: Readonly<import('vue').Ref<boolean, boolean>>;
    isFullscreen: Readonly<import('vue').Ref<boolean, boolean>>;
    currentTime: Readonly<import('vue').Ref<number, number>>;
    duration: Readonly<import('vue').Ref<number, number>>;
    volume: import('vue').Ref<number, number>;
    isMuted: import('vue').Ref<boolean, boolean>;
    play: () => Promise<void> | void;
    pause: () => void;
    togglePlay: () => void;
    seek: (time: number) => void;
    setVolume: (level: number) => void;
    toggleMute: () => void;
    toggleFullscreen: () => void;
    requestFullscreen: () => void;
    exitFullscreen: () => void;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
    ended: () => any;
    error: () => any;
    pause: () => any;
    play: () => any;
    timeupdate: (time: number) => any;
    ready: () => any;
}, string, import('vue').PublicProps, Readonly<Props> & Readonly<{
    onEnded?: (() => any) | undefined;
    onError?: (() => any) | undefined;
    onPause?: (() => any) | undefined;
    onPlay?: (() => any) | undefined;
    onTimeupdate?: ((time: number) => any) | undefined;
    onReady?: (() => any) | undefined;
}>, {
    poster: string;
    autoplay: boolean;
    controls: boolean;
    muted: boolean;
    loop: boolean;
    options: Record<string, any>;
    variant: "default" | "minimal" | "custom";
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {
    container: HTMLDivElement;
    videoEl: HTMLVideoElement;
}, HTMLDivElement>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, __VLS_TemplateResult["slots"]>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
