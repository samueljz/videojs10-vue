import { Transition as e, createCommentVNode as t, createElementBlock as n, createElementVNode as r, createVNode as i, defineComponent as a, normalizeClass as o, onBeforeUnmount as s, onMounted as c, openBlock as l, readonly as u, ref as d, renderSlot as f, toValue as p, unref as m, watch as h, withCtx as g } from "vue";
import { createPlayer as _, selectFullscreen as v, selectPlayback as y, selectTime as b, selectVolume as x } from "@videojs/html";
//#region node_modules/@videojs/utils/dist/dom/event.js
function S(e, t, n) {
	return new Promise((r, i) => {
		let a = () => {
			i(n?.signal?.reason ?? "Aborted");
		};
		if (n?.signal?.aborted) {
			a();
			return;
		}
		n?.signal?.addEventListener("abort", a, { once: !0 }), e.addEventListener(t, (e) => {
			n?.signal?.removeEventListener("abort", a), r(e);
		}, {
			...n,
			once: !0
		});
	});
}
//#endregion
//#region node_modules/@videojs/utils/dist/dom/listen.js
function C(e, t, n, r) {
	return e.addEventListener(t, n, r), () => e.removeEventListener(t, n, r);
}
//#endregion
//#region node_modules/@videojs/utils/dist/predicate/predicate.js
function w(e) {
	return typeof e == "function";
}
function T(e) {
	return e === null;
}
function E(e) {
	return e === void 0;
}
function D(e) {
	return typeof e == "object" && !!e;
}
//#endregion
//#region node_modules/@videojs/utils/dist/dom/text-track.js
function O(e) {
	return e.kind === "captions" || e.kind === "subtitles";
}
function k(e, t) {
	if (!(e instanceof HTMLElement)) return null;
	for (let n of e.querySelectorAll("track")) if (n.track === t) return n;
	return null;
}
function A(e, t) {
	return e.textTracks ? Array.from(e.textTracks).filter(t).sort(j) : [];
}
function j(e, t) {
	return e.kind > t.kind ? 1 : e.kind < t.kind ? -1 : 0;
}
//#endregion
//#region node_modules/@videojs/utils/dist/dom/time-ranges.js
function M(e) {
	let t = [];
	for (let n = 0; n < e.length; n++) t.push([e.start(n), e.end(n)]);
	return t;
}
//#endregion
//#region node_modules/@videojs/utils/dist/dom/webkit.js
function N() {
	return "WebKitPlaybackTargetAvailabilityEvent" in globalThis;
}
function P(e) {
	return N() && "webkitCurrentPlaybackTargetIsWireless" in e;
}
//#endregion
//#region node_modules/@videojs/store/dist/default/core/slice.js
function F() {
	return (e) => e;
}
//#endregion
//#region node_modules/@videojs/utils/dist/function/noop.js
function I(...e) {}
//#endregion
//#region node_modules/@videojs/core/dist/default/dom/feature.js
var L = F();
function R(e, t) {
	if (arguments.length === 1) return L(e);
	let { name: n, state: r, attach: i } = e, a = (e) => L({
		...E(n) ? {} : { name: n },
		state: (t) => r(t, e),
		...i ? { attach: (t) => i(t, e) } : {}
	}), o = a(t), s = ((e) => E(e) ? o : a(e));
	return s.state = o.state, o.attach && (s.attach = o.attach), E(n) || Object.defineProperty(s, "name", { value: n }), s;
}
//#endregion
//#region node_modules/@videojs/media/dist/default/core/constants.js
var z = Object.freeze({
	length: 0,
	start: () => 0,
	end: () => 0
}), ee = Object.assign(new EventTarget(), {
	length: 0,
	*[Symbol.iterator]() {},
	getTrackById: () => null
}), te = new EventTarget();
Object.freeze({});
//#endregion
//#region node_modules/@videojs/media/dist/default/core/predicate.js
function ne(e) {
	return e.readyState >= 1;
}
function B(e) {
	if (!D(e)) return !1;
	let t = e;
	return !E(t.paused) && !E(t.ended) && w(t.pause);
}
function V(e) {
	if (!D(e)) return !1;
	let t = e;
	return !E(t.currentTime) && !E(t.duration) && !E(t.seeking);
}
function H(e) {
	if (!D(e)) return !1;
	let t = e;
	return !E(t.src) && !E(t.currentSrc) && !E(t.readyState) && w(t.load);
}
function U(e) {
	if (!D(e)) return !1;
	let t = e;
	return !E(t.volume) && !E(t.muted);
}
function W(e) {
	return D(e) ? !E(e.playbackRate) : !1;
}
function G(e) {
	if (!D(e)) return !1;
	let t = e;
	return !E(t.buffered) && t.buffered !== z && !E(t.seekable) && t.seekable !== z;
}
function re(e) {
	return D(e) ? !E(e.error) : !1;
}
function K(e) {
	if (!D(e)) return !1;
	let t = e;
	return !E(t.textTracks) && t.textTracks !== ee;
}
function q(e) {
	return D(e) ? !E(e.videoRenditions) : !1;
}
function J(e) {
	return D(e) ? !E(e.audioTracks) : !1;
}
function ie(e) {
	if (!D(e)) return !1;
	let t = e;
	return !E(t.videoWidth) && !E(t.videoHeight);
}
function ae(e) {
	if (!D(e)) return !1;
	let t = e;
	return D(t.remote) && t.remote !== te;
}
function oe(e) {
	return D(e) && "querySelectorAll" in e && w(e.querySelectorAll);
}
//#endregion
//#region node_modules/@videojs/core/dist/default/dom/store/features/audio-track.js
function se(e, t) {
	return e.id || String(t);
}
function ce(e) {
	return {
		...e.id !== void 0 && { id: e.id },
		...e.kind !== void 0 && { kind: e.kind },
		label: e.label,
		language: e.language,
		enabled: e.enabled
	};
}
var le = R({
	name: "audioTrack",
	state: ({ target: e }) => ({
		audioTrackList: [],
		selectAudioTrack(t) {
			let { media: n } = e();
			if (!J(n)) return;
			let r = [...n.audioTracks], i = r.find((e, n) => se(e, n) === t);
			if (i) for (let e of r) e.enabled = e === i;
		}
	}),
	attach({ target: e, signal: t, set: n }) {
		let { media: r } = e, i = null, a = null, o = () => J(r) ? r.audioTracks : null, s = (e = o()) => {
			n({ audioTrackList: e ? [...e].map(ce) : [] });
		}, c = () => {
			let e = o();
			if (e === i) {
				s(e);
				return;
			}
			a?.abort(), a = new AbortController(), i = e, i && (C(i, "addtrack", () => s(i), { signal: a.signal }), C(i, "removetrack", () => s(i), { signal: a.signal }), C(i, "change", () => s(i), { signal: a.signal })), s(i);
		};
		c(), C(r, "loadstart", c, { signal: t }), t.addEventListener("abort", () => a?.abort(), { once: !0 });
	}
}), ue = R({
	name: "buffer",
	state: () => ({
		buffered: [],
		seekable: []
	}),
	attach({ target: e, signal: t, set: n }) {
		let { media: r } = e;
		if (!G(r)) return;
		let i = () => n({
			buffered: M(r.buffered),
			seekable: M(r.seekable)
		});
		i(), C(r, "progress", i, { signal: t }), C(r, "emptied", i, { signal: t });
	}
}), de = /* @__PURE__ */ new WeakMap();
function fe(e) {
	return de.get(e);
}
//#endregion
//#region node_modules/@videojs/core/dist/default/dom/presentation/remote-playback.js
function Y(e) {
	let t = e;
	if (D(t.remote) && "state" in t.remote && "prompt" in t.remote) return t.remote;
}
function pe(e) {
	return Y(e)?.state === "connected";
}
function me(e) {
	return Y(e)?.state === "connecting";
}
async function he(e) {
	let t = Y(e);
	if (!t) throw new DOMException("Remote playback not supported", "NotSupportedError");
	return t.prompt();
}
//#endregion
//#region node_modules/@videojs/core/dist/default/dom/store/features/controls.js
var ge = 2e3, _e = 250, ve = 500, ye = R({
	name: "controls",
	state: ({ get: e, set: t }) => ({
		userActive: !0,
		controlsVisible: !0,
		toggleControls() {
			let n = !e().userActive;
			return t({
				userActive: n,
				controlsVisible: n
			}), n;
		}
	}),
	attach({ target: e, signal: t, get: n, set: r }) {
		let { media: i, container: a } = e;
		if (!B(i) || T(a)) return;
		let o = (e) => e || i.paused || pe(i) || me(i), s;
		function c() {
			clearTimeout(s), s = void 0;
		}
		function l() {
			c(), s = setTimeout(d, ge);
		}
		function u() {
			n().userActive || r({
				userActive: !0,
				controlsVisible: !0
			}), l();
		}
		function d() {
			c(), r({
				userActive: !1,
				controlsVisible: o(!1)
			});
		}
		r({ toggleControls() {
			return n().controlsVisible ? d() : u(), n().controlsVisible;
		} });
		let f = 0, p = 0, m = () => p > 0 && Date.now() - p < ve;
		function h(e) {
			f = Date.now(), e.pointerType === "touch" && (p = f);
		}
		function g(e) {
			if (e.pointerType === "touch" && (p = Date.now()), e.pointerType === "touch" && Date.now() - f < _e) {
				if (fe(a)?.claimsTap(e, "toggleControls")) return;
				let t = [i, a].includes(e.target);
				n().controlsVisible && t ? d() : u();
			} else u();
		}
		let _ = () => {
			let { userActive: e } = n();
			r({ controlsVisible: o(e) }), !i.paused && e && l();
		};
		function v(e) {
			if (e.pointerType === "touch") {
				n().userActive && l();
				return;
			}
			u();
		}
		if (C(a, "pointermove", v, { signal: t }), C(a, "pointerdown", h, { signal: t }), C(a, "pointerup", g, { signal: t }), C(a, "keyup", u, { signal: t }), C(a, "focusin", () => {
			m() || u();
		}, { signal: t }), C(a, "mouseleave", () => {
			m() || d();
		}, { signal: t }), C(i, "play", _, { signal: t }), C(i, "pause", _, { signal: t }), C(i, "ended", _, { signal: t }), ae(i)) {
			let e = () => {
				let { userActive: e } = n();
				r({ controlsVisible: o(e) });
			};
			C(i.remote, "connect", e, { signal: t }), C(i.remote, "connecting", e, { signal: t }), C(i.remote, "disconnect", e, { signal: t });
		}
		t.addEventListener("abort", c, { once: !0 }), l();
	}
}), be = R({
	name: "error",
	state: ({ set: e }) => ({
		error: null,
		dismissError() {
			e({ error: null });
		}
	}),
	attach({ target: e, signal: t, set: n }) {
		let { media: r } = e;
		re(r) && (C(r, "error", () => n({ error: r.error }), { signal: t }), C(r, "emptied", () => n({ error: null }), { signal: t }));
	}
});
//#endregion
//#region node_modules/@videojs/core/dist/default/dom/presentation/fullscreen.js
function xe() {
	let e = document;
	return e.fullscreenEnabled || e.webkitFullscreenEnabled ? !0 : w(document.createElement("video").webkitSetPresentationMode);
}
function Se() {
	let e = document;
	return e.fullscreenElement ?? e.webkitFullscreenElement ?? null;
}
function Ce(e) {
	if (!(e instanceof Element)) return !1;
	try {
		return e.matches(":fullscreen");
	} catch {
		return !1;
	}
}
function X(e, t) {
	if (t.webkitPresentationMode === "fullscreen") return !0;
	let n = Se();
	return n && (n === e || n === t) || Ce(e) || Ce(t) ? !0 : t.isFullscreen ?? !1;
}
async function we(e, t) {
	let n = document;
	if (e && (n.fullscreenEnabled || n.webkitFullscreenEnabled)) {
		let t = e;
		if (w(t.requestFullscreen)) return t.requestFullscreen();
		if (w(t.webkitRequestFullscreen)) return t.webkitRequestFullscreen();
	}
	let r = t;
	if (w(r.webkitSetPresentationMode)) {
		r.webkitSetPresentationMode("fullscreen");
		return;
	}
	let i = t;
	if (w(i.requestFullscreen)) return i.requestFullscreen();
}
async function Z(e) {
	let t = document, n = e;
	if (n.webkitPresentationMode === "fullscreen" && w(n.webkitSetPresentationMode)) {
		n.webkitSetPresentationMode("inline");
		return;
	}
	if (w(t.exitFullscreen)) return t.exitFullscreen();
	if (w(t.webkitExitFullscreen)) return t.webkitExitFullscreen();
	let r = e;
	if (w(r.exitFullscreen)) return r.exitFullscreen();
}
//#endregion
//#region node_modules/@videojs/core/dist/default/dom/presentation/pip.js
function Te() {
	if (document.pictureInPictureEnabled) {
		let e = /.*Version\/.*Safari\/.*/.test(navigator.userAgent), t = typeof matchMedia == "function" && matchMedia("(display-mode: standalone)").matches;
		return !e || !t;
	}
	return w(document.createElement("video").webkitSetPresentationMode);
}
function Q(e) {
	return e.webkitPresentationMode === "picture-in-picture" || document.pictureInPictureElement === e ? !0 : e.isPictureInPicture ?? !1;
}
async function Ee(e) {
	let t = e;
	if (w(t.webkitSetPresentationMode)) {
		t.webkitSetPresentationMode("picture-in-picture");
		return;
	}
	let n = e;
	if (w(n.requestPictureInPicture)) return n.requestPictureInPicture();
}
async function $(e) {
	let t = e;
	if (t.webkitPresentationMode === "picture-in-picture" && w(t.webkitSetPresentationMode)) {
		t.webkitSetPresentationMode("inline");
		return;
	}
	if (w(document.exitPictureInPicture)) return document.exitPictureInPicture();
	let n = e;
	if (w(n.exitPictureInPicture)) return n.exitPictureInPicture();
}
//#endregion
//#region node_modules/@videojs/core/dist/default/dom/store/features/fullscreen.js
var De = R({
	name: "fullscreen",
	state: ({ target: e }) => ({
		fullscreen: !1,
		fullscreenAvailability: "unavailable",
		async requestFullscreen() {
			let { media: t, container: n } = e();
			return Q(t) && await $(t), we(n, t);
		},
		async exitFullscreen() {
			let { media: t } = e();
			return Z(t);
		},
		async toggleFullscreen() {
			let { media: t, container: n } = e();
			return X(n, t) ? Z(t) : (Q(t) && await $(t), we(n, t));
		}
	}),
	attach({ target: e, signal: t, set: n }) {
		let { media: r, container: i } = e;
		n({ fullscreenAvailability: xe() ? "available" : "unsupported" });
		let a = () => n({ fullscreen: X(i, r) });
		a(), C(document, "fullscreenchange", a, { signal: t }), C(document, "webkitfullscreenchange", a, { signal: t }), "webkitPresentationMode" in r && C(r, "webkitpresentationmodechanged", a, { signal: t });
	}
}), Oe = R({
	name: "pip",
	state: ({ target: e }) => ({
		pip: !1,
		pipAvailability: "unavailable",
		async requestPictureInPicture() {
			let { media: t, container: n } = e();
			return X(n, t) && await Z(t), Ee(t);
		},
		async exitPictureInPicture() {
			let { media: t } = e();
			return $(t);
		},
		async togglePictureInPicture() {
			let { media: t, container: n } = e();
			return Q(t) ? $(t) : (X(n, t) && await Z(t), Ee(t));
		}
	}),
	attach({ target: e, signal: t, set: n }) {
		let { media: r } = e;
		n({ pipAvailability: Te() ? "available" : "unsupported" });
		let i = () => n({ pip: Q(r) });
		i(), C(r, "enterpictureinpicture", i, { signal: t }), C(r, "leavepictureinpicture", i, { signal: t }), "webkitPresentationMode" in r && C(r, "webkitpresentationmodechanged", i, { signal: t });
	}
}), ke = R({
	name: "playback",
	state: ({ target: e }) => ({
		paused: !0,
		ended: !1,
		started: !1,
		waiting: !1,
		play() {
			return e().media.play();
		},
		pause() {
			let { media: t } = e();
			B(t) && t.pause();
		},
		togglePaused() {
			let t = e().media;
			return B(t) ? t.paused ? (t.play(), !0) : (t.pause(), !1) : !1;
		}
	}),
	attach({ target: e, signal: t, set: n }) {
		let { media: r } = e;
		if (!B(r) || !V(r) || !H(r)) return;
		let i = () => n({
			paused: r.paused,
			ended: r.ended,
			started: !r.paused || r.currentTime > 0,
			waiting: r.readyState < HTMLMediaElement.HAVE_FUTURE_DATA && !r.paused
		});
		i(), C(r, "emptied", i, { signal: t }), C(r, "play", i, { signal: t }), C(r, "pause", i, { signal: t }), C(r, "ended", i, { signal: t }), C(r, "playing", i, { signal: t }), C(r, "waiting", i, { signal: t }), C(r, "seeked", i, { signal: t });
	}
}), Ae = [
	.2,
	.5,
	.7,
	1,
	1.2,
	1.5,
	1.7,
	2
], je = R({
	name: "playbackRate",
	state: ({ target: e }) => ({
		playbackRates: Ae,
		playbackRate: 1,
		setPlaybackRate(t) {
			let { media: n } = e();
			W(n) && (n.playbackRate = t);
		}
	}),
	attach({ target: e, signal: t, set: n }) {
		let { media: r } = e;
		if (!W(r)) return;
		let i = () => n({ playbackRate: r.playbackRate });
		i(), C(r, "ratechange", i, { signal: t });
	}
}), Me = "auto";
function Ne(e, t) {
	return e.id || String(t);
}
function Pe(e) {
	return {
		...e.id !== void 0 && { id: e.id },
		...e.width !== void 0 && { width: e.width },
		...e.height !== void 0 && { height: e.height },
		...e.bitrate !== void 0 && { bitrate: e.bitrate },
		...e.frameRate !== void 0 && { frameRate: e.frameRate },
		...e.codec !== void 0 && { codec: e.codec },
		selected: e.selected
	};
}
function Fe(e) {
	return e.width && e.height ? Math.min(e.width, e.height) : e.height ?? e.width;
}
var Ie = R({
	name: "quality",
	state: ({ target: e }) => ({
		videoRenditionList: [],
		activeVideoRendition: null,
		selectVideoRendition(t) {
			let { media: n } = e();
			if (!q(n)) return;
			if (t === Me) {
				n.videoRenditions.selectedIndex = -1;
				return;
			}
			let r = [...n.videoRenditions].findIndex((e, n) => Ne(e, n) === t);
			r !== -1 && (n.videoRenditions.selectedIndex = r);
		}
	}),
	attach({ target: e, signal: t, set: n }) {
		let { media: r } = e, i = null, a = null, o = () => q(r) ? r.videoRenditions : null, s = (e) => {
			if (!e) return null;
			let t = [...e], n = t.find((e) => e.active);
			if (n) return n;
			if (!ie(r) || !r.videoWidth && !r.videoHeight) return null;
			let i = Fe({
				width: r.videoWidth || void 0,
				height: r.videoHeight || void 0
			}), a = t.filter((e) => Fe(e) === i);
			return a.length === 1 ? a[0] : null;
		}, c = (e = o()) => {
			let t = s(e);
			n({
				videoRenditionList: e ? [...e].map(Pe) : [],
				activeVideoRendition: t ? Pe(t) : null
			});
		}, l = () => {
			let e = o();
			if (e === i) {
				c(e);
				return;
			}
			a?.abort(), a = new AbortController(), i = e, i && (C(i, "addrendition", () => c(i), { signal: a.signal }), C(i, "removerendition", () => c(i), { signal: a.signal }), C(i, "change", () => c(i), { signal: a.signal }), C(i, "activechange", () => c(i), { signal: a.signal })), c(i);
		};
		l(), C(r, "loadstart", l, { signal: t }), C(r, "resize", () => c(i), { signal: t }), t.addEventListener("abort", () => a?.abort(), { once: !0 });
	}
}), Le = R({
	name: "remotePlayback",
	state: ({ target: e }) => ({
		remotePlaybackState: "disconnected",
		remotePlaybackAvailability: "unsupported",
		async toggleRemotePlayback() {
			let { media: t, container: n } = e();
			return pe(t) ? he(t) : (X(n, t) && await Z(t), await he(t));
		}
	}),
	attach({ target: e, signal: t, set: n }) {
		let { media: r } = e;
		if (!ae(r)) return;
		if (P(r)) {
			let e = () => {
				n({ remotePlaybackState: r.webkitCurrentPlaybackTargetIsWireless ? "connected" : "disconnected" });
			};
			C(r, "webkitplaybacktargetavailabilitychanged", (e) => {
				let { availability: t } = e;
				n({ remotePlaybackAvailability: t === "available" ? "available" : "unavailable" });
			}, { signal: t }), C(r, "webkitcurrentplaybacktargetiswirelesschanged", e, { signal: t }), e();
			return;
		}
		let i = () => n({ remotePlaybackState: r.remote.state });
		i(), C(r.remote, "connect", i, { signal: t }), C(r.remote, "connecting", i, { signal: t }), C(r.remote, "disconnect", i, { signal: t }), r.remote.watchAvailability((e) => {
			n({ remotePlaybackAvailability: e ? "available" : "unavailable" });
		}).catch(() => {
			n({ remotePlaybackAvailability: "unsupported" });
		}), t.addEventListener("abort", () => {
			r.remote?.cancelWatchAvailability?.().catch(() => {});
		});
	}
}), Re = R({
	name: "source",
	state: ({ target: e, signals: t }) => ({
		source: null,
		canPlay: !1,
		loadSource(n) {
			t.clear();
			let { media: r } = e();
			return H(r) ? (r.src = n, r.load(), n) : n;
		}
	}),
	attach({ target: e, signal: t, set: n }) {
		let { media: r } = e;
		if (!H(r)) return;
		let i = () => n({
			source: r.currentSrc || r.src || null,
			canPlay: r.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA
		});
		i(), C(r, "canplay", i, { signal: t }), C(r, "canplaythrough", i, { signal: t }), C(r, "loadstart", i, { signal: t }), C(r, "emptied", i, { signal: t });
	}
});
//#endregion
//#region node_modules/@videojs/core/dist/default/dom/store/features/text-track.js
function ze(e, t) {
	return e.id || `track:${t}:${e.kind}:${e.language}:${e.label}`;
}
var Be = R({
	name: "textTrack",
	state: ({ target: e }) => ({
		chaptersCues: [],
		thumbnailCues: [],
		thumbnailTrackSrc: null,
		textTrackList: [],
		subtitlesShowing: !1,
		toggleSubtitles(t) {
			let { media: n } = e();
			if (!K(n)) return !1;
			let r = A(n, O);
			if (!r.length) return !1;
			let i = r.some((e) => e.mode === "showing"), a = t ?? !i;
			for (let e of r) e.mode = a ? "showing" : "disabled";
			return a;
		},
		selectSubtitlesTrack(t) {
			let { media: n } = e();
			if (!K(n)) return;
			let r = Array.from(n.textTracks).map((e, t) => ({
				index: t,
				track: e
			})).filter(({ track: e }) => O(e));
			if (!r.length) return;
			if (t === "off") {
				for (let { track: e } of r) e.mode = "disabled";
				return;
			}
			let i = r.find(({ index: e, track: n }) => ze(n, e) === t)?.track;
			if (i) for (let { track: e } of r) e.mode = e === i ? "showing" : "disabled";
		}
	}),
	attach({ target: e, signal: t, set: n }) {
		let { media: r } = e;
		if (!K(r)) return;
		let i = null, a = () => {
			i?.abort(), i = new AbortController();
			let e = null, t = null, o = [], s = !1;
			for (let n = 0; n < r.textTracks.length; n++) {
				let i = r.textTracks[n];
				!e && i.kind === "chapters" && (e = i), !t && i.kind === "metadata" && i.label === "thumbnails" && (t = i), o.push({
					id: ze(i, n),
					kind: i.kind,
					label: i.label,
					language: i.language,
					mode: i.mode
				}), O(i) && i.mode === "showing" && (s = !0);
			}
			let c = e?.cues ? Array.from(e.cues) : [], l = t?.cues ? Array.from(t.cues) : [], u = null;
			t && (u = k(r, t)?.src ?? null);
			let d = oe(r) && r.querySelectorAll("track") || [], f = r instanceof HTMLElement && r.shadowRoot?.querySelectorAll("track") || [];
			for (let e of [...d, ...f]) e.track?.cues?.length || C(e, "load", a, { signal: i.signal });
			n({
				chaptersCues: c,
				thumbnailCues: l,
				thumbnailTrackSrc: u,
				textTrackList: o,
				subtitlesShowing: s
			});
		};
		a();
		let o = r.textTracks;
		o instanceof EventTarget && (C(o, "addtrack", a, { signal: t }), C(o, "removetrack", a, { signal: t }), C(o, "change", a, { signal: t })), C(r, "loadstart", a, { signal: t }), t.addEventListener("abort", () => i?.abort(), { once: !0 });
	}
}), Ve = { seek: Symbol.for("@videojs/seek") }, He = R({
	name: "time",
	state: ({ target: e, signals: t, set: n }) => ({
		currentTime: 0,
		duration: 0,
		seeking: !1,
		async seek(r) {
			let { media: i } = e(), a = t.supersede(Ve.seek);
			if (!V(i) || !H(i)) return 0;
			if (!ne(i) && !await S(i, "loadedmetadata", { signal: a }).catch(() => !1)) return i.currentTime;
			let o = Math.max(0, Math.min(r, i.duration || Infinity));
			return n({
				currentTime: o,
				seeking: !0
			}), i.currentTime = o, await S(i, "seeked", { signal: a }).catch(I), i.currentTime;
		}
	}),
	attach({ target: e, signal: t, set: n, get: r }) {
		let { media: i } = e;
		if (!V(i)) return;
		let a = () => {
			let { duration: e } = i;
			if (e === Infinity && G(i)) {
				let { seekable: e } = i;
				return e.length > 0 ? e.end(e.length - 1) : 0;
			}
			return Number.isFinite(e) ? e : 0;
		}, o = () => n({
			currentTime: i.currentTime,
			duration: a(),
			seeking: i.seeking
		}), s = () => {
			r().seeking || o();
		};
		o(), C(i, "timeupdate", s, { signal: t }), C(i, "durationchange", o, { signal: t }), C(i, "seeking", o, { signal: t }), C(i, "seeked", o, { signal: t }), C(i, "loadedmetadata", o, { signal: t }), C(i, "emptied", o, { signal: t }), C(i, "progress", s, { signal: t });
	}
}), Ue = .25, We = R({
	name: "volume",
	state: ({ target: e }) => ({
		volume: 1,
		muted: !1,
		volumeAvailability: "unavailable",
		setVolume(t) {
			let { media: n } = e();
			if (!U(n)) return 0;
			let r = Math.max(0, Math.min(1, t));
			return r > 0 && n.muted && (n.muted = !1), n.volume = r, n.volume;
		},
		toggleMuted() {
			let { media: t } = e();
			return U(t) ? (t.muted || t.volume === 0 ? (t.muted = !1, t.volume === 0 && (t.volume = Ue)) : t.muted = !0, t.muted) : !1;
		}
	}),
	attach({ target: e, signal: t, set: n }) {
		let { media: r } = e;
		if (!U(r)) return;
		n({ volumeAvailability: Ge() });
		let i = () => n({
			volume: r.volume,
			muted: r.muted
		});
		i(), C(r, "volumechange", i, { signal: t });
	}
});
function Ge() {
	let e = document.createElement("video");
	try {
		return e.volume = .5, e.volume === .5 ? "available" : "unsupported";
	} catch {
		return "unsupported";
	}
}
//#endregion
//#region src/composables/useVideoPlayer.ts
var { create: Ke } = _({ features: [
	ke,
	je,
	Ie,
	le,
	We,
	He,
	Re,
	ue,
	De,
	Oe,
	Le,
	ye,
	Be,
	be
] });
function qe(e, t = {}) {
	let n = null, r = null, i = null, a = d(!1), o = d(!1), l = d(!0), f = d(!1), m = d(!1), g = d(!1), _ = d(0), S = d(0), C = d(1), w = d(!1), T = d(!1);
	function E(e) {
		if (!e) return;
		let t = y(e), n = b(e), r = x(e), i = v(e);
		t && (l.value = !!t.paused, o.value = !t.paused && !t.ended, f.value = !!t.ended, m.value = !!t.waiting), n && (_.value = n.currentTime ?? 0, S.value = n.duration ?? 0, g.value = !!n.seeking), r && (C.value = r.volume ?? 1, w.value = !!r.muted), i && (T.value = !!i.fullscreen);
	}
	c(() => {
		let s = p(e);
		if (!s) return;
		n = Ke(), r = n.attach(s);
		let c = p(t.src);
		c && (s.src = c), t.poster && (s.poster = t.poster), t.autoplay && (s.autoplay = !0), t.muted && (s.muted = !0), t.loop && (s.loop = !0), t.controls !== !1 && (s.controls = !0);
		let u = n.subscribe(() => {
			E(n.state);
		});
		E(n.state), i = new AbortController();
		let d = { signal: i.signal };
		s.addEventListener("loadedmetadata", () => {
			a.value = !0, S.value = s.duration || 0;
		}, d), s.addEventListener("canplay", () => {
			a.value = !0;
		}, d), s.addEventListener("play", () => {
			o.value = !0, l.value = !1, f.value = !1;
		}, d), s.addEventListener("pause", () => {
			o.value = !1, l.value = !0;
		}, d), s.addEventListener("ended", () => {
			o.value = !1, f.value = !0;
		}, d), s.addEventListener("timeupdate", () => {
			_.value = s.currentTime || 0;
		}, d), s.addEventListener("durationchange", () => {
			S.value = isNaN(s.duration) ? 0 : s.duration;
		}, d), s.addEventListener("volumechange", () => {
			C.value = s.volume ?? 1, w.value = s.muted ?? !1;
		}, d), s.addEventListener("waiting", () => {
			m.value = !0;
		}, d), s.addEventListener("playing", () => {
			m.value = !1;
		}, d), s.addEventListener("seeking", () => {
			g.value = !0;
		}, d), s.addEventListener("seeked", () => {
			g.value = !1;
		}, d), s.addEventListener("fullscreenchange", () => {
			T.value = !!document.fullscreenElement;
		}, d), i._storeUnsub = u;
	}), s(() => {
		i?._storeUnsub?.(), i?.abort(), r?.(), n?.destroy?.(), n = null, r = null, i = null, a.value = !1;
	}), t.src !== void 0 && h(() => p(t.src), (t) => {
		let n = p(e);
		n && t && (n.src = t, n.load(), a.value = !1, _.value = 0, S.value = 0);
	});
	function D() {
		return p(e)?.play();
	}
	function O() {
		p(e)?.pause();
	}
	function k() {
		l.value ? D() : O();
	}
	function A(t) {
		let n = p(e);
		n && (n.currentTime = t);
	}
	function j(t) {
		let n = Math.max(0, Math.min(1, t));
		C.value = n;
		let r = p(e);
		r && (r.volume = n);
	}
	function M() {
		let t = p(e);
		t && (t.muted = !t.muted);
	}
	function N() {
		let t = p(e);
		document.fullscreenElement ? document.exitFullscreen?.() : t?.requestFullscreen?.();
	}
	function P() {
		p(e)?.requestFullscreen?.();
	}
	function F() {
		document.exitFullscreen?.();
	}
	return {
		isReady: u(a),
		isPlaying: u(o),
		isPaused: u(l),
		isEnded: u(f),
		isWaiting: u(m),
		isSeeking: u(g),
		isFullscreen: u(T),
		currentTime: u(_),
		duration: u(S),
		volume: C,
		isMuted: w,
		play: D,
		pause: O,
		togglePlay: k,
		seek: A,
		setVolume: j,
		toggleMute: M,
		toggleFullscreen: N,
		requestFullscreen: P,
		exitFullscreen: F
	};
}
//#endregion
//#region src/components/VideoPlayer.vue?vue&type=script&setup=true&lang.ts
var Je = ["poster"], Ye = {
	key: 0,
	class: "video-player__overlay video-player__overlay--loading"
}, Xe = {
	key: 0,
	class: "video-player__overlay video-player__overlay--ended"
}, Ze = /*#__PURE__*/ ((e, t) => {
	let n = e.__vccOpts || e;
	for (let [e, r] of t) n[e] = r;
	return n;
})(/* @__PURE__ */ a({
	__name: "VideoPlayer",
	props: {
		src: {},
		poster: { default: "" },
		autoplay: {
			type: Boolean,
			default: !1
		},
		controls: {
			type: Boolean,
			default: !0
		},
		muted: {
			type: Boolean,
			default: !1
		},
		loop: {
			type: Boolean,
			default: !1
		},
		options: { default: () => ({}) },
		variant: { default: "default" }
	},
	emits: [
		"ready",
		"play",
		"pause",
		"ended",
		"timeupdate",
		"error"
	],
	setup(a, { expose: s, emit: c }) {
		let u = a, p = c, _ = d(null), v = d(null), { isReady: y, isPlaying: b, isPaused: x, isEnded: S, isWaiting: C, isSeeking: w, isFullscreen: T, currentTime: E, duration: D, volume: O, isMuted: k, play: A, pause: j, togglePlay: M, seek: N, setVolume: P, toggleMute: F, toggleFullscreen: I, requestFullscreen: L, exitFullscreen: R } = qe(_, {
			src: u.src,
			poster: u.poster,
			autoplay: u.autoplay,
			muted: u.muted,
			loop: u.loop,
			controls: u.controls
		});
		h(y, (e) => {
			e && p("ready");
		}), h(b, (e) => {
			e && p("play");
		}), h(x, (e) => {
			e && p("pause");
		}), h(S, (e) => {
			e && p("ended");
		}), h(E, (e) => {
			p("timeupdate", e);
		});
		function z() {
			N(0), A();
		}
		return s({
			isReady: y,
			isPlaying: b,
			isPaused: x,
			isEnded: S,
			isWaiting: C,
			isSeeking: w,
			isFullscreen: T,
			currentTime: E,
			duration: D,
			volume: O,
			isMuted: k,
			play: A,
			pause: j,
			togglePlay: M,
			seek: N,
			setVolume: P,
			toggleMute: F,
			toggleFullscreen: I,
			requestFullscreen: L,
			exitFullscreen: R
		}), (s, c) => (l(), n("div", {
			ref_key: "container",
			ref: v,
			class: o(["video-player", [`video-player--${a.variant}`, { "video-player--fullscreen": m(T) }]])
		}, [
			r("video", {
				ref_key: "videoEl",
				ref: _,
				class: "video-player__video",
				playsinline: "",
				poster: a.poster
			}, null, 8, Je),
			i(e, { name: "fade" }, {
				default: g(() => [m(C) && !m(x) ? (l(), n("div", Ye, [...c[0] ||= [r("div", {
					class: "video-player__spinner",
					"aria-label": "Loading…"
				}, null, -1)]])) : t("", !0)]),
				_: 1
			}),
			i(e, { name: "fade" }, {
				default: g(() => [m(S) ? (l(), n("div", Xe, [r("button", {
					class: "video-player__replay-btn",
					onClick: z,
					"aria-label": "Replay"
				}, [...c[1] ||= [r("svg", {
					viewBox: "0 0 24 24",
					fill: "currentColor",
					width: "32",
					height: "32"
				}, [r("path", { d: "M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" })], -1), r("span", null, "Replay", -1)]])])) : t("", !0)]),
				_: 1
			}),
			f(s.$slots, "default", {
				isReady: m(y),
				isPlaying: m(b),
				isPaused: m(x),
				currentTime: m(E),
				duration: m(D),
				volume: m(O),
				isMuted: m(k),
				play: m(A),
				pause: m(j),
				togglePlay: m(M),
				seek: m(N)
			}, void 0, !0)
		], 2));
	}
}), [["__scopeId", "data-v-a246797f"]]);
//#endregion
export { Ze as VideoPlayer, qe as useVideoPlayer };
