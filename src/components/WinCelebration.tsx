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
      
      // Auto-complete after 1.5 seconds
      const timer = setTimeout(() => {
        setShowEffects(false);
        onComplete();
      }, 1500);

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
      
      {/* Confetti Burst */}
      <div className="win-confetti">
        {confettiPieces}
      </div>
      
      {/* Fireworks */}
      <div className="fireworks">
        {fireworks}
      </div>
    </>
  );
};