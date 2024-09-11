import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface VideoPlayerState {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  progress: number;
  duration: number;
  isAutoplayOn: boolean;
  isSubtitlesOn: boolean;
  isSettingsOpen: boolean;
  isStableVolumeOn: boolean;
  isAmbientModeOn: boolean;
  isAnnotationsOn: boolean;
  playbackSpeed: number;
  quality: string;
  isMiniPlayer: boolean;
  isTheaterMode: boolean;
  isFullScreen: boolean;
}

const initialState: VideoPlayerState = {
  isPlaying: false,
  isMuted: false,
  volume: 0.5,
  progress: 0,
  duration: 0,
  isAutoplayOn: false,
  isSubtitlesOn: false,
  isSettingsOpen: false,
  isStableVolumeOn: false,
  isAmbientModeOn: false,
  isAnnotationsOn: false,
  playbackSpeed: 1,
  quality: 'auto',
  isMiniPlayer: false,
  isTheaterMode: false,
  isFullScreen: false,
};

const videoPlayerSlice = createSlice({
  name: 'videoPlayer',
  initialState,
  reducers: {
    togglePlayPause(state) {
      state.isPlaying = !state.isPlaying;
    },
    toggleMute(state) {
      state.isMuted = !state.isMuted;
    },
    setVolume(state, action: PayloadAction<number>) {
      state.volume = action.payload;
    },
    setProgress(state, action: PayloadAction<number>) {
      state.progress = action.payload;
    },
    setDuration(state, action: PayloadAction<number>) {
      state.duration = action.payload;
    },
    toggleAutoplay(state) {
      state.isAutoplayOn = !state.isAutoplayOn;
    },
    toggleSubtitles(state) {
      state.isSubtitlesOn = !state.isSubtitlesOn;
    },
    toggleSettingsOpen(state) {
      state.isSettingsOpen = !state.isSettingsOpen;
    },
    toggleStableVolume(state) {
      state.isStableVolumeOn = !state.isStableVolumeOn;
    },
    toggleAmbientMode(state) {
      state.isAmbientModeOn = !state.isAmbientModeOn;
    },
    toggleAnnotations(state) {
      state.isAnnotationsOn = !state.isAnnotationsOn;
    },
    setPlaybackSpeed(state, action: PayloadAction<number>) {
      state.playbackSpeed = action.payload;
    },
    setQuality(state, action: PayloadAction<string>) {
      state.quality = action.payload;
    },
    toggleMiniPlayer(state) {
      state.isMiniPlayer = !state.isMiniPlayer;
    },
    toggleTheaterMode(state) {
      state.isTheaterMode = !state.isTheaterMode;
    },
    toggleFullScreen(state) {
      state.isFullScreen = !state.isFullScreen;
    }
  }
});

export const {
  togglePlayPause,
  toggleMute,
  setVolume,
  setProgress,
  setDuration,
  toggleAutoplay,
  toggleSubtitles,
  toggleSettingsOpen,
  toggleStableVolume,
  toggleAmbientMode,
  toggleAnnotations,
  setPlaybackSpeed,
  setQuality,
  toggleMiniPlayer,
  toggleTheaterMode,
  toggleFullScreen
} = videoPlayerSlice.actions;

export default videoPlayerSlice.reducer;
