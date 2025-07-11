import React from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

interface AudioControlsProps {
  isAudioEnabled: boolean;
  currentTrack: string | null;
  onToggleMute: () => void;
  onEnableAudio: () => void;
}

export const AudioControls: React.FC<AudioControlsProps> = ({
  isAudioEnabled,
  currentTrack,
  onToggleMute,
  onEnableAudio
}) => {
  const getTrackDisplay = () => {
    switch (currentTrack) {
      case 'background': return '🎵 Background Music';
      case 'ticker': return '🎰 Spinning Sound';
      case 'winning': return '🎉 Victory Fanfare';
      default: return '🔇 No Audio';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-3">
      {/* Current track indicator */}
      {isAudioEnabled && currentTrack && (
        <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2 border border-cyan-400/30">
          <div className="flex items-center gap-2 text-cyan-300 text-sm">
            <Music className="w-4 h-4" />
            <span>{getTrackDisplay()}</span>
          </div>
        </div>
      )}
      
      {/* Audio control button */}
      <button
        onClick={isAudioEnabled ? onToggleMute : onEnableAudio}
        className={`p-3 rounded-full border-2 transition-all duration-300 backdrop-blur-sm ${
          isAudioEnabled 
            ? 'bg-cyan-600/20 border-cyan-400 text-cyan-400 hover:bg-cyan-600/30' 
            : 'bg-red-600/20 border-red-400 text-red-400 hover:bg-red-600/30'
        }`}
        title={isAudioEnabled ? 'Mute Audio' : 'Enable Audio'}
      >
        {isAudioEnabled ? (
          <Volume2 className="w-5 h-5" />
        ) : (
          <VolumeX className="w-5 h-5" />
        )}
      </button>
    </div>
  );
};