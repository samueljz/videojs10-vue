interface Props {
    isPlaying?: boolean;
    isPaused?: boolean;
    isMuted?: boolean;
    volume?: number;
    currentTime?: number;
    duration?: number;
}
declare const _default: import('vue').DefineComponent<Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
    pause: () => any;
    play: () => any;
    toggle: () => any;
    volume: (level: number) => any;
    seek: (time: number) => any;
    mute: () => any;
}, string, import('vue').PublicProps, Readonly<Props> & Readonly<{
    onPause?: (() => any) | undefined;
    onPlay?: (() => any) | undefined;
    onToggle?: (() => any) | undefined;
    onVolume?: ((level: number) => any) | undefined;
    onSeek?: ((time: number) => any) | undefined;
    onMute?: (() => any) | undefined;
}>, {
    isPlaying: boolean;
    isPaused: boolean;
    currentTime: number;
    duration: number;
    volume: number;
    isMuted: boolean;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, HTMLDivElement>;
export default _default;
