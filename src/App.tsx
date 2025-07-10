import React, { useState } from 'react';
import { Trophy, Zap, Star, Crown, Gift, Gem, Coins, Award } from 'lucide-react';

interface Player {
  id: number;
  name: string;
  score: number;
  rank: number;
}

interface Prize {
  id: number;
  name: string;
  value: string;
  icon: React.ReactNode;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  color: string;
}

const mockPlayers: Player[] = [
  { id: 1, name: "NEXUS_PRIME", score: 98750, rank: 1 },
  { id: 2, name: "CYBER_STORM", score: 94320, rank: 2 },
  { id: 3, name: "NEON_BLADE", score: 91580, rank: 3 },
  { id: 4, name: "QUANTUM_FLUX", score: 89420, rank: 4 },
  { id: 5, name: "DIGITAL_GHOST", score: 87340, rank: 5 },
  { id: 6, name: "VOID_RUNNER", score: 85200, rank: 6 },
  { id: 7, name: "PIXEL_WARRIOR", score: 83150, rank: 7 },
  { id: 8, name: "MATRIX_HACKER", score: 81900, rank: 8 },
  { id: 9, name: "CHROME_VIPER", score: 80750, rank: 9 },
  { id: 10, name: "NEON_KNIGHT", score: 79600, rank: 10 },
  { id: 11, name: "CYBER_PHOENIX", score: 78450, rank: 11 },
  { id: 12, name: "VOLT_STRIKER", score: 77300, rank: 12 },
];

const prizes: Prize[] = [
  { id: 1, name: "LEGENDARY CROWN", value: "10,000 COINS", icon: <Crown className="w-16 h-16" />, rarity: 'legendary', color: 'text-yellow-400' },
  { id: 2, name: "EPIC TROPHY", value: "5,000 COINS", icon: <Trophy className="w-16 h-16" />, rarity: 'epic', color: 'text-purple-400' },
  { id: 3, name: "RARE DIAMOND", value: "2,500 COINS", icon: <Gem className="w-16 h-16" />, rarity: 'rare', color: 'text-cyan-400' },
  { id: 4, name: "GOLD COINS", value: "1,000 COINS", icon: <Coins className="w-16 h-16" />, rarity: 'common', color: 'text-yellow-300' },
  { id: 5, name: "SILVER STAR", value: "750 COINS", icon: <Star className="w-16 h-16" />, rarity: 'common', color: 'text-gray-300' },
  { id: 6, name: "BRONZE MEDAL", value: "500 COINS", icon: <Award className="w-16 h-16" />, rarity: 'common', color: 'text-orange-400' },
  { id: 7, name: "MYSTERY BOX", value: "??? COINS", icon: <Gift className="w-16 h-16" />, rarity: 'rare', color: 'text-pink-400' },
  { id: 8, name: "POWER BOOST", value: "2X MULTIPLIER", icon: <Zap className="w-16 h-16" />, rarity: 'epic', color: 'text-blue-400' },
];

type GameState = 'start' | 'ticker' | 'loading' | 'leaderboard';

function App() {
  const [gameState, setGameState] = useState<GameState>('start');
  const [currentPrizeIndex, setCurrentPrizeIndex] = useState(0);
  const [tickerSpeed, setTickerSpeed] = useState(80);
  const [wonPrize, setWonPrize] = useState<Prize | null>(null);

  const startGame = () => {
    setGameState('ticker');
    setTickerSpeed(80);
    
    // Fast ticker animation that gradually slows down
    const tickerInterval = setInterval(() => {
      setCurrentPrizeIndex((prev) => (prev + 1) % prizes.length);
    }, tickerSpeed);

    // Gradually slow down the ticker
    const slowDownInterval = setInterval(() => {
      setTickerSpeed(prev => {
        const newSpeed = prev + 20;
        if (newSpeed >= 300) {
          clearInterval(slowDownInterval);
          clearInterval(tickerInterval);
          
          // Final slow reveal of the winner
          setTimeout(() => {
            const finalPrizeIndex = Math.floor(Math.random() * prizes.length);
            setCurrentPrizeIndex(finalPrizeIndex);
            setWonPrize(prizes[finalPrizeIndex]);
            setGameState('loading');
            
            // Show leaderboard after loading
            setTimeout(() => {
              setGameState('leaderboard');
            }, 2500);
          }, 500);
        }
        return newSpeed;
      });
    }, 200);

    // Cleanup after 4 seconds if not already cleared
    setTimeout(() => {
      clearInterval(slowDownInterval);
      clearInterval(tickerInterval);
    }, 4000);
  };

  const resetGame = () => {
    setGameState('start');
    setCurrentPrizeIndex(0);
    setTickerSpeed(80);
    setWonPrize(null);
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2: return <Trophy className="w-6 h-6 text-cyan-400" />;
      case 3: return <Star className="w-6 h-6 text-pink-400" />;
      default: return <Zap className="w-5 h-5 text-purple-400" />;
    }
  };

  const getRankGlow = (rank: number) => {
    switch (rank) {
      case 1: return 'rank-1';
      case 2: return 'rank-2';
      case 3: return 'rank-3';
      default: return 'rank-default';
    }
  };

  const getPrizeRarityGlow = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'prize-legendary';
      case 'epic': return 'prize-epic';
      case 'rare': return 'prize-rare';
      default: return 'prize-common';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-cyan-900 relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-grid opacity-20"></div>
      
      {/* Floating particles */}
      <div className="particles">
        {[...Array(20)].map((_, i) => (
          <div key={i} className={`particle particle-${i}`}></div>
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        {gameState === 'start' && (
          <div className="text-center space-y-8 animate-fade-in">
            <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 neon-glow-text animate-pulse-glow">
              LUCKY DRAW
            </h1>
            <p className="text-xl md:text-2xl text-cyan-300 font-light tracking-wide">
              Spin for amazing prizes
            </p>
            <button
              onClick={startGame}
              className="start-button px-12 py-4 text-xl font-bold text-white bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg border-2 border-cyan-400 hover:border-pink-400 transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              SPIN NOW
            </button>
          </div>
        )}

        {gameState === 'ticker' && (
          <div className="text-center space-y-8">
            <h2 className="text-3xl md:text-5xl font-bold text-cyan-400 neon-glow-text animate-pulse">
              SPINNING...
            </h2>
            <div className="prize-wheel-container p-8 rounded-xl border-2 border-cyan-400 bg-black/40 backdrop-blur-sm max-w-lg mx-auto">
              <div className="text-sm text-cyan-300 mb-4 opacity-75">CURRENT PRIZE</div>
              <div className={`prize-display ${getPrizeRarityGlow(prizes[currentPrizeIndex].rarity)} p-6 rounded-lg mb-4`}>
                <div className={`${prizes[currentPrizeIndex].color} mb-3 flex justify-center ticker-icon`}>
                  {prizes[currentPrizeIndex].icon}
                </div>
                <div className="text-2xl font-bold text-white neon-glow-text ticker-text">
                  {prizes[currentPrizeIndex].name}
                </div>
                <div className="text-lg text-cyan-300 mt-2">
                  {prizes[currentPrizeIndex].value}
                </div>
              </div>
              <div className="mt-4 flex justify-center">
                <div className="loading-dots">
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                </div>
              </div>
            </div>
            <p className="text-lg text-purple-300 opacity-75">
              The wheel is spinning...
            </p>
          </div>
        )}

        {gameState === 'loading' && (
          <div className="text-center space-y-8">
            <div className="match-found-animation">
              <div className="text-2xl text-green-400 font-bold mb-4 animate-pulse">
                CONGRATULATIONS!
              </div>
              <div className={`prize-won-card ${getPrizeRarityGlow(wonPrize?.rarity || 'common')} p-8 rounded-xl border-2 border-green-400 bg-black/40 backdrop-blur-sm max-w-sm mx-auto`}>
                <div className="text-lg text-green-300 mb-4">YOU WON</div>
                <div className={`${wonPrize?.color} mb-4 flex justify-center`}>
                  {wonPrize?.icon}
                </div>
                <div className="text-2xl font-bold text-white neon-glow-text mb-2">
                  {wonPrize?.name}
                </div>
                <div className="text-xl text-yellow-400 font-mono">
                  {wonPrize?.value}
                </div>
              </div>
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-purple-400 neon-glow-text animate-pulse">
              ADDING TO INVENTORY...
            </h2>
            <div className="loading-spinner mx-auto"></div>
          </div>
        )}

        {gameState === 'leaderboard' && (
          <div className="w-full max-w-4xl mx-auto space-y-6">
            <div className="text-center space-y-4 animate-fade-in">
              <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-cyan-400 to-pink-400 neon-glow-text">
                LEADERBOARD
              </h1>
              <p className="text-lg text-cyan-300">Digital Champions of the Arena</p>
              {wonPrize && (
                <div className="text-center mb-6">
                  <div className="text-lg text-green-400 mb-2">🎉 Latest Win:</div>
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${getPrizeRarityGlow(wonPrize.rarity)}`}>
                    <span className={`${wonPrize.color}`}>{wonPrize.icon}</span>
                    <span className="text-white font-bold">{wonPrize.name}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Top 3 Spotlight */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {mockPlayers.slice(0, 3).map((player, index) => (
                <div
                  key={player.id}
                  className={`top-player-card ${getRankGlow(player.rank)} animate-slide-in`}
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getRankIcon(player.rank)}
                      <span className="text-lg font-bold">#{player.rank}</span>
                    </div>
                    <div className="text-sm opacity-75">TOP {player.rank}</div>
                  </div>
                  <div className="text-xl font-bold mb-1">{player.name}</div>
                  <div className="text-2xl font-mono">{player.score.toLocaleString()}</div>
                </div>
              ))}
            </div>

            {/* Full Leaderboard */}
            <div className="leaderboard-container max-h-96 overflow-y-auto">
              <div className="space-y-2">
                {mockPlayers.map((player, index) => (
                  <div
                    key={player.id}
                    className={`leaderboard-row ${getRankGlow(player.rank)} animate-slide-in-left`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 min-w-16">
                        {getRankIcon(player.rank)}
                        <span className="text-lg font-bold">#{player.rank}</span>
                      </div>
                      <div className="flex-1">
                        <div className="text-lg font-bold">{player.name}</div>
                      </div>
                      <div className="text-xl font-mono text-cyan-400">
                        {player.score.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center pt-6">
              <button
                onClick={resetGame}
                className="px-8 py-3 text-lg font-bold text-white bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg border-2 border-pink-400 hover:border-cyan-400 transition-all duration-300 transform hover:scale-105"
              >
                SPIN AGAIN
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;