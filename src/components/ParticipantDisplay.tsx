import React from 'react';
import { Participant } from '../types';
import { Users } from 'lucide-react';

interface ParticipantDisplayProps {
  participants: Participant[];
  currentIndex: number;
  isSpinning: boolean;
}

export const ParticipantDisplay: React.FC<ParticipantDisplayProps> = ({
  participants,
  currentIndex,
  isSpinning
}) => {
  if (participants.length === 0) {
    return (
      <div className="participant-wheel-container p-8 rounded-xl border-2 border-cyan-400 bg-black/40 backdrop-blur-sm max-w-lg mx-auto text-center">
        <Users className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
        <p className="text-cyan-300">Loading participants...</p>
      </div>
    );
  }

  const currentParticipant = participants[currentIndex];
  
  if (!currentParticipant) {
    return (
      <div className="participant-wheel-container p-8 rounded-xl border-2 border-cyan-400 bg-black/40 backdrop-blur-sm max-w-lg mx-auto text-center">
        <Users className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
        <p className="text-cyan-300">No participant selected</p>
      </div>
    );
  }

  return (
    <div className="participant-wheel-container p-8 rounded-xl border-2 border-cyan-400 bg-black/40 backdrop-blur-sm max-w-lg mx-auto">
      <div className="text-sm text-cyan-300 mb-4 opacity-75">CURRENT PARTICIPANT</div>
      <div className={`participant-display ${isSpinning ? 'spinning' : ''} p-6 rounded-lg mb-4`}>
        <div className="mb-4 flex justify-center">
          <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-cyan-400 participant-avatar">
            {currentParticipant.picture ? (
              <img 
                src={currentParticipant.picture} 
                alt={currentParticipant.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-cyan-400 to-purple-400 flex items-center justify-center text-white font-bold text-xl">
                {currentParticipant.name?.charAt(0) || '?'}
              </div>
            )}
          </div>
        </div>
        <div className="text-2xl font-bold text-white neon-glow-text participant-name">
          {currentParticipant.name}
        </div>
        <div className="text-lg text-cyan-300 mt-2">
          ID: {currentParticipant.id.slice(-8)}
        </div>
      </div>
      <div className="text-sm text-purple-300 opacity-75">
        Participant {currentIndex + 1} of {participants.length}
      </div>
      {isSpinning && (
        <div className="mt-4 flex justify-center">
          <div className="loading-dots">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        </div>
      )}
    </div>
  );
};