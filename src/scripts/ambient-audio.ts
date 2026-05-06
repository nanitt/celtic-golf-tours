/**
 * Ambient Audio Manager
 * Handles background audio with crossfade, user preferences, and accessibility
 *
 * Features:
 * - Multiple simultaneous audio sources with crossfade
 * - Volume control and mute
 * - Persists user preference
 * - Respects prefers-reduced-motion
 */

interface AudioTrack {
  id: string;
  url: string;
  volume: number;
  loop: boolean;
}

interface AmbientAudioState {
  enabled: boolean;
  masterVolume: number;
  audioContext: AudioContext | null;
  gainNode: GainNode | null;
  tracks: Map<string, {
    buffer: AudioBuffer | null;
    source: AudioBufferSourceNode | null;
    gainNode: GainNode | null;
    loaded: boolean;
  }>;
}

const STORAGE_KEY = 'celtic-golf-ambient-audio';
const DEFAULT_VOLUME = 0.15;
const CROSSFADE_DURATION = 1.5; // seconds

const state: AmbientAudioState = {
  enabled: false,
  masterVolume: DEFAULT_VOLUME,
  audioContext: null,
  gainNode: null,
  tracks: new Map()
};

/**
 * Initialize the audio system
 */
export async function initAmbientAudio(): Promise<boolean> {
  // Check for reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    console.info('[AmbientAudio] Disabled due to reduced motion preference');
    return false;
  }

  // Load user preference
  const savedPref = localStorage.getItem(STORAGE_KEY);
  if (savedPref) {
    try {
      const pref = JSON.parse(savedPref);
      state.enabled = pref.enabled ?? false;
      state.masterVolume = pref.volume ?? DEFAULT_VOLUME;
    } catch (e) {
      // Ignore parse errors
    }
  }

  try {
    state.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    state.gainNode = state.audioContext.createGain();
    state.gainNode.connect(state.audioContext.destination);
    state.gainNode.gain.value = state.enabled ? state.masterVolume : 0;
    return true;
  } catch (e) {
    console.warn('[AmbientAudio] Web Audio API not supported');
    return false;
  }
}

/**
 * Save user preference to localStorage
 */
function savePreference() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      enabled: state.enabled,
      volume: state.masterVolume
    }));
  } catch (e) {
    // Ignore storage errors
  }
}

/**
 * Load an audio track
 */
export async function loadTrack(track: AudioTrack): Promise<boolean> {
  if (!state.audioContext) return false;

  if (state.tracks.has(track.id)) {
    return true; // Already loaded
  }

  try {
    const response = await fetch(track.url);
    if (!response.ok) {
      console.warn(`[AmbientAudio] Failed to fetch: ${track.url}`);
      return false;
    }

    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await state.audioContext.decodeAudioData(arrayBuffer);

    // Create gain node for this track
    const trackGainNode = state.audioContext.createGain();
    trackGainNode.connect(state.gainNode!);
    trackGainNode.gain.value = track.volume;

    state.tracks.set(track.id, {
      buffer: audioBuffer,
      source: null,
      gainNode: trackGainNode,
      loaded: true
    });

    return true;
  } catch (e) {
    console.warn(`[AmbientAudio] Failed to load track: ${track.id}`, e);
    state.tracks.set(track.id, {
      buffer: null,
      source: null,
      gainNode: null,
      loaded: false
    });
    return false;
  }
}

/**
 * Play a specific track
 */
export function playTrack(trackId: string, fadeIn = true): boolean {
  if (!state.audioContext || !state.gainNode) return false;

  const track = state.tracks.get(trackId);
  if (!track || !track.buffer || !track.gainNode) {
    console.warn(`[AmbientAudio] Track not loaded: ${trackId}`);
    return false;
  }

  // Resume audio context if suspended
  if (state.audioContext.state === 'suspended') {
    state.audioContext.resume();
  }

  // Stop existing source for this track
  if (track.source) {
    try {
      track.source.stop();
    } catch (e) {
      // Ignore if already stopped
    }
  }

  // Create new source
  const source = state.audioContext.createBufferSource();
  source.buffer = track.buffer;
  source.loop = true;
  source.connect(track.gainNode);

  // Fade in
  if (fadeIn) {
    track.gainNode.gain.setValueAtTime(0, state.audioContext.currentTime);
    track.gainNode.gain.linearRampToValueAtTime(
      state.enabled ? 1 : 0,
      state.audioContext.currentTime + CROSSFADE_DURATION
    );
  }

  source.start();
  track.source = source;

  return true;
}

/**
 * Stop a specific track
 */
export function stopTrack(trackId: string, fadeOut = true): void {
  if (!state.audioContext) return;

  const track = state.tracks.get(trackId);
  if (!track || !track.source || !track.gainNode) return;

  if (fadeOut) {
    track.gainNode.gain.linearRampToValueAtTime(
      0,
      state.audioContext.currentTime + CROSSFADE_DURATION
    );

    setTimeout(() => {
      if (track.source) {
        try {
          track.source.stop();
        } catch (e) {
          // Ignore if already stopped
        }
        track.source = null;
      }
    }, CROSSFADE_DURATION * 1000 + 100);
  } else {
    try {
      track.source.stop();
    } catch (e) {
      // Ignore if already stopped
    }
    track.source = null;
  }
}

/**
 * Crossfade from one track to another
 */
export function crossfadeTo(fromTrackId: string | null, toTrackId: string): void {
  if (fromTrackId) {
    stopTrack(fromTrackId, true);
  }
  playTrack(toTrackId, true);
}

/**
 * Enable ambient audio
 */
export function enableAudio(): void {
  if (!state.audioContext || !state.gainNode) return;

  state.enabled = true;
  savePreference();

  // Resume context if needed
  if (state.audioContext.state === 'suspended') {
    state.audioContext.resume();
  }

  // Fade in master volume
  state.gainNode.gain.cancelScheduledValues(state.audioContext.currentTime);
  state.gainNode.gain.setValueAtTime(state.gainNode.gain.value, state.audioContext.currentTime);
  state.gainNode.gain.linearRampToValueAtTime(
    state.masterVolume,
    state.audioContext.currentTime + 0.5
  );

  // Resume all track gain nodes
  state.tracks.forEach(track => {
    if (track.gainNode && track.source) {
      track.gainNode.gain.cancelScheduledValues(state.audioContext!.currentTime);
      track.gainNode.gain.linearRampToValueAtTime(
        1,
        state.audioContext!.currentTime + CROSSFADE_DURATION
      );
    }
  });
}

/**
 * Disable ambient audio
 */
export function disableAudio(): void {
  if (!state.audioContext || !state.gainNode) return;

  state.enabled = false;
  savePreference();

  // Fade out master volume
  state.gainNode.gain.cancelScheduledValues(state.audioContext.currentTime);
  state.gainNode.gain.setValueAtTime(state.gainNode.gain.value, state.audioContext.currentTime);
  state.gainNode.gain.linearRampToValueAtTime(0, state.audioContext.currentTime + 0.5);
}

/**
 * Toggle ambient audio
 */
export function toggleAudio(): boolean {
  if (state.enabled) {
    disableAudio();
  } else {
    enableAudio();
  }
  return state.enabled;
}

/**
 * Set master volume (0-1)
 */
export function setVolume(volume: number): void {
  state.masterVolume = Math.max(0, Math.min(1, volume));
  savePreference();

  if (state.enabled && state.audioContext && state.gainNode) {
    state.gainNode.gain.cancelScheduledValues(state.audioContext.currentTime);
    state.gainNode.gain.linearRampToValueAtTime(
      state.masterVolume,
      state.audioContext.currentTime + 0.1
    );
  }
}

/**
 * Get current audio state
 */
export function getAudioState(): { enabled: boolean; volume: number } {
  return {
    enabled: state.enabled,
    volume: state.masterVolume
  };
}

/**
 * Check if audio is supported and initialized
 */
export function isAudioSupported(): boolean {
  return state.audioContext !== null;
}

/**
 * Cleanup - call when component unmounts
 */
export function destroyAmbientAudio(): void {
  state.tracks.forEach(track => {
    if (track.source) {
      try {
        track.source.stop();
      } catch (e) {
        // Ignore
      }
    }
  });
  state.tracks.clear();

  if (state.audioContext) {
    state.audioContext.close();
    state.audioContext = null;
    state.gainNode = null;
  }
}
