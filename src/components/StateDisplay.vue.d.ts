interface Props {
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
declare const _default: import('vue').DefineComponent<Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<Props> & Readonly<{}>, {
    isReady: boolean;
    isPlaying: boolean;
    isPaused: boolean;
    isEnded: boolean;
    isWaiting: boolean;
    isFullscreen: boolean;
    currentTime: number;
    duration: number;
    volume: number;
    isMuted: boolean;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, HTMLDivElement>;
export default _default;
