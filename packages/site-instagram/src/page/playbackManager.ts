// The playback manager handles the volume states of the different videos and synchronizes it across all players.
import type { VideoPlayer } from './videoPlayer';

export interface PlaybackManager {
  // Must be called whenever a video playback was started.
  notifyVideoPlay: (videoPlayer: VideoPlayer) => void;

  // Must be called whenever a video volume was changed.
  notifyVideoVolumeChange: (videoPlayer: VideoPlayer) => void;

  // Must be called whenever a video playback speed was changed.
  notifyVideoPlaybackSpeedChange: (videoPlayer: VideoPlayer) => void;

  // Must be called when playback ends and the next video should be shown.
  advanceToNextVideo: (videoPlayer: VideoPlayer) => void;
}
