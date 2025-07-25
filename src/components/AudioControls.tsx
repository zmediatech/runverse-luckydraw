import React from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

interface AudioControlsProps {
  isAudioEnabled: boolean;
  currentTrack: string | null;
  isLoading?: boolean;
  onToggleMute: () => void;
  onEnableAudio: () => void;
}

export const AudioControls: React.FC<AudioControlsProps> = ({
  isAudioEnabled,
  currentTrack,
  isLoading = false,
  onToggleMute,
  onEnableAudio
}) => {
  const getTrackDisplay = () => {
    if (isLoading) return '⏳ Loading Audio...';
    switch (currentTrack) {
      case 'background': return '🎰 Lucky Draw Music';
      case 'spinning': return '🎵 Spinning Music';
      case 'winning': return '🎉 Congratulations!';
      default: return '🔇 No Audio';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-3">
      {/* Current track indicator */}
      {isAudioEnabled && (currentTrack || isLoading) && (
        <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2 border border-cyan-400/30">
          <div className="flex items-center gap-2 text-cyan-300 text-sm">
            <Music className="w-4 h-4" />
            <span>{getTrackDisplay()}</span>
          </div>
        </div>
      )}
      
      {/* Audio control button */}
      <button
        onClick={onToggleMute}
        disabled={isLoading}
        className={`p-3 rounded-full border-2 transition-all duration-300 backdrop-blur-sm ${
          isLoading
            ? 'bg-yellow-600/20 border-yellow-400 text-yellow-400 cursor-not-allowed'
            : isAudioEnabled 
            ? 'bg-green-600/20 border-green-400 text-green-400 hover:bg-green-600/30' 
            : 'bg-red-600/20 border-red-400 text-red-400 hover:bg-red-600/30'
        }`}
        title={isLoading ? 'Loading Audio...' : isAudioEnabled ? 'Mute Audio' : 'Unmute Audio'}
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
        ) : isAudioEnabled ? (
          <Volume2 className="w-5 h-5" />
        ) : (
          <VolumeX className="w-5 h-5" />
        )}
      </button>
    </div>
  );
};