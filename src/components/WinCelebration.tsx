import React, { useEffect, useState } from 'react';

interface WinCelebrationProps {
  show: boolean;
  winnerName: string;
  prizeName: string;
  onComplete: () => void;
}

export const WinCelebration: React.FC<WinCelebrationProps> = ({
  show,
  winnerName,
  prizeName,
  onComplete
}) => {
  const [showEffects, setShowEffects] = useState(false);

  useEffect(() => {
    if (show) {
      setShowEffects(true);
      
      // Auto-complete after 6 seconds
      const timer = setTimeout(() => {
        setShowEffects(false);
        onComplete();
      }, 6000);

      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!showEffects) return null;

  // Generate confetti pieces
  const confettiPieces = Array.from({ length: 100 }, (_, i) => {
    const types = ['confetti-gold', 'confetti-silver', 'confetti-rainbow', 'confetti-star', 'confetti-heart', 'confetti-diamond'];
    const type = types[i % types.length];
    const left = Math.random() * 100;
    const delay = Math.random() * 2;
    const duration = 3 + Math.random() * 2;
    
    return (
      <div
        key={`confetti-${i}`}
        className={`confetti-burst ${type}`}
        style={{
          left: `${left}%`,
          animationDelay: `${delay}s`,
          animationDuration: `${duration}s`
        }}
      />
    );
  });

  // Generate fireworks
  const fireworks = Array.from({ length: 20 }, (_, i) => {
    const colors = ['firework-gold', 'firework-cyan', 'firework-pink', 'firework-purple'];
    const color = colors[i % colors.length];
    const left = 20 + Math.random() * 60; // Keep fireworks in center area
    const top = 20 + Math.random() * 40;
    const delay = Math.random() * 3;
    
    return (
      <div
        key={`firework-${i}`}
        className={`firework ${color}`}
        style={{
          left: `${left}%`,
          top: `${top}%`,
          animationDelay: `${delay}s`
        }}
      />
    );
  });

  return (
    <>
      {/* Winner Spotlight */}
      <div className="winner-spotlight" />
      
      {/* Celebration Text */}
      <div className="celebration-text">
        🎉 CONGRATULATIONS! 🎉
      </div>
      
      {/* Confetti Burst */}
      <div className="win-confetti">
        {confettiPieces}
      </div>
      
      {/* Fireworks */}
      <div className="fireworks">
        {fireworks}
      </div>
      
      {/* Winner Announcement */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-[1002] pointer-events-none">
        <div className="bg-black/80 backdrop-blur-lg rounded-2xl p-8 border-4 border-gold-400 shadow-2xl">
          <div className="text-3xl font-bold text-gold-400 mb-4 animate-pulse">
            🏆 WINNER 🏆
          </div>
          <div className="text-2xl font-bold text-white mb-2">
            {winnerName}
          </div>
          <div className="text-lg text-cyan-400">
            Won: {prizeName}
          </div>
        </div>
      </div>
    </>
  );
};