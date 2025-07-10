import React from 'react';
import { Prize } from '../types';

interface PrizeDisplayProps {
  prizes: Prize[];
  currentIndex: number;
  isSpinning: boolean;
}

export const PrizeDisplay: React.FC<PrizeDisplayProps> = ({
  prizes,
  currentIndex,
  isSpinning
}) => {
  if (prizes.length === 0) {
    return null;
  }

  const currentPrize = prizes[currentIndex];

  const getPrizeRarityGlow = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'prize-legendary';
      case 'epic': return 'prize-epic';
      case 'rare': return 'prize-rare';
      default: return 'prize-common';
    }
  };

  return (
    <div className="prize-wheel-container p-8 rounded-xl border-2 border-pink-400 bg-black/40 backdrop-blur-sm max-w-lg mx-auto">
      <div className="text-sm text-pink-300 mb-4 opacity-75">CURRENT PRIZE</div>
      <div className={`prize-display ${getPrizeRarityGlow(currentPrize.rarity)} p-6 rounded-lg mb-4`}>
        <div className="mb-4 flex justify-center">
          {currentPrize.picture ? (
            <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-current">
              <img 
                src={currentPrize.picture} 
                alt={currentPrize.name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className={`${currentPrize.color} mb-3 flex justify-center ticker-icon`}>
              {currentPrize.icon}
            </div>
          )}
        </div>
        <div className="text-2xl font-bold text-white neon-glow-text ticker-text">
          {currentPrize.name}
        </div>
        <div className="text-lg text-pink-300 mt-2">
          {currentPrize.value}
        </div>
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