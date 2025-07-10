import React, { useState, useEffect } from 'react';
import { Trophy, Zap, Star, Crown, Gift, Gem, Coins, Award, Users, AlertCircle, RefreshCw } from 'lucide-react';
import { useLuckyDraw } from './hooks/useLuckyDraw';
import { ParticipantDisplay } from './components/ParticipantDisplay';
import { PrizeDisplay } from './components/PrizeDisplay';
import { GameState, Player, Participant, Prize } from './types';

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

function App() {
  const { 
    luckyDrawData, 
    participants, 
    prizes, 
    loading: apiLoading, 
    error: apiError,
    participantCount,
    totalEntries,
    numWinners
  } = useLuckyDraw();

  const [gameState, setGameState] = useState<GameState>('start');
  const [currentParticipantIndex, setCurrentParticipantIndex] = useState(0);
  const [currentPrizeIndex, setCurrentPrizeIndex] = useState(0);
  const [tickerSpeed, setTickerSpeed] = useState(80);
  const [wonPrize, setWonPrize] = useState<Prize | null>(null);
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);

  // Show loading state while API data is being fetched
  if (apiLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-cyan-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="loading-spinner mx-auto"></div>
          <h2 className="text-2xl font-bold text-cyan-400 neon-glow-text">
            Loading Lucky Draw...
          </h2>
          <p className="text-cyan-300">Fetching participants and prizes</p>
        </div>
      </div>
    );
  }

  // Show error state if API call failed
  if (apiError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-cyan-900 flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md mx-auto p-6">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto" />
          <h2 className="text-2xl font-bold text-red-400">Error Loading Data</h2>
          <p className="text-red-300">{apiError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  const startGame = () => {
    if (participants.length === 0 || prizes.length === 0) {
      alert('No participants or prizes available!');
      return;
    }

    setGameState('ticker');
    setTickerSpeed(80);
    
    // Fast ticker animation that gradually slows down
    const participantInterval = setInterval(() => {
      setCurrentParticipantIndex((prev) => (prev + 1) % participants.length);
    }, tickerSpeed);

    const prizeInterval = setInterval(() => {
      setCurrentPrizeIndex((prev) => (prev + 1) % prizes.length);
    }, tickerSpeed);

    // Gradually slow down the ticker
    const slowDownInterval = setInterval(() => {
      setTickerSpeed(prev => {
        const newSpeed = prev + 20;
        if (newSpeed >= 300) {
          clearInterval(slowDownInterval);
          clearInterval(participantInterval);
          clearInterval(prizeInterval);
          
          // Final slow reveal of the winner
          setTimeout(() => {
            const finalParticipantIndex = Math.floor(Math.random() * participants.length);
            const finalPrizeIndex = Math.floor(Math.random() * prizes.length);
            
            setCurrentParticipantIndex(finalParticipantIndex);
            setCurrentPrizeIndex(finalPrizeIndex);
            setSelectedParticipant(participants[finalParticipantIndex]);
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
      clearInterval(participantInterval);
      clearInterval(prizeInterval);
    }, 4000);
  };

  const resetGame = () => {
    setGameState('start');
    setCurrentParticipantIndex(0);
    setCurrentPrizeIndex(0);
    setTickerSpeed(80);
    setWonPrize(null);
    setSelectedParticipant(null);
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
            <div className="space-y-4">
              <p className="text-xl md:text-2xl text-cyan-300 font-light tracking-wide">
                Spin for amazing prizes
              </p>
              <div className="flex justify-center gap-8 text-sm text-purple-300">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>{participantCount} Participants</span>
                </div>
                <div className="flex items-center gap-2">
                  <Gift className="w-5 h-5" />
                  <span>{prizes.length} Prizes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  <span>{numWinners} Winners</span>
                </div>
              </div>
            </div>
            <button
              onClick={startGame}
              disabled={participants.length === 0 || prizes.length === 0}
              className="start-button px-12 py-4 text-xl font-bold text-white bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg border-2 border-cyan-400 hover:border-pink-400 transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              <ParticipantDisplay 
                participants={participants}
                currentIndex={currentParticipantIndex}
                isSpinning={true}
              />
              <PrizeDisplay 
                prizes={prizes}
                currentIndex={currentPrizeIndex}
                isSpinning={true}
              />
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-6">
                {/* Winner Display */}
                <div className="winner-card p-8 rounded-xl border-2 border-green-400 bg-black/40 backdrop-blur-sm">
                  <div className="text-lg text-green-300 mb-4">WINNER</div>
                  <div className="mb-4 flex justify-center">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-green-400">
                      {selectedParticipant?.picture ? (
                        <img 
                          src={selectedParticipant.picture} 
                          alt={selectedParticipant.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-green-400 to-cyan-400 flex items-center justify-center text-white font-bold text-xl">
                          {selectedParticipant?.name.charAt(0)}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-white neon-glow-text mb-2">
                    {selectedParticipant?.name}
                  </div>
                  <div className="text-sm text-green-300">
                    ID: {selectedParticipant?.id.slice(-8)}
                  </div>
                </div>

                {/* Prize Display */}
                <div className={`prize-won-card ${getPrizeRarityGlow(wonPrize?.rarity || 'common')} p-8 rounded-xl border-2 border-yellow-400 bg-black/40 backdrop-blur-sm`}>
                  <div className="text-lg text-yellow-300 mb-4">PRIZE WON</div>
                  <div className="mb-4 flex justify-center">
                    {wonPrize?.picture ? (
                      <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-current">
                        <img 
                          src={wonPrize.picture} 
                          alt={wonPrize.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className={`${wonPrize?.color} flex justify-center`}>
                        {wonPrize?.icon}
                      </div>
                    )}
                  </div>
                  <div className="text-2xl font-bold text-white neon-glow-text mb-2">
                    {wonPrize?.name}
                  </div>
                  <div className="text-xl text-yellow-400 font-mono">
                    {wonPrize?.value}
                  </div>
                </div>
              </div>
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-purple-400 neon-glow-text animate-pulse">
              PROCESSING RESULT...
            </h2>
            <div className="loading-spinner mx-auto"></div>
          </div>
        )}

        {gameState === 'leaderboard' && (
          <div className="w-full max-w-4xl mx-auto space-y-6">
            <div className="text-center space-y-4 animate-fade-in">
              <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-cyan-400 to-pink-400 neon-glow-text">
                RESULTS
              </h1>
              <p className="text-lg text-cyan-300">Lucky Draw Champion</p>
              
              {/* Winner Announcement */}
              {selectedParticipant && wonPrize && (
                <div className="text-center mb-8">
                  <div className="text-2xl text-green-400 mb-4">🎉 WINNER ANNOUNCEMENT 🎉</div>
                  <div className={`inline-flex items-center gap-6 px-8 py-6 rounded-xl ${getPrizeRarityGlow(wonPrize.rarity)} max-w-2xl mx-auto`}>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-current">
                        {selectedParticipant.picture ? (
                          <img 
                            src={selectedParticipant.picture} 
                            alt={selectedParticipant.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-green-400 to-cyan-400 flex items-center justify-center text-white font-bold text-lg">
                            {selectedParticipant.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="text-left">
                        <div className="text-xl font-bold text-white">{selectedParticipant.name}</div>
                        <div className="text-sm text-green-300">Winner</div>
                      </div>
                    </div>
                    <div className="text-4xl">🏆</div>
                    <div className="flex items-center gap-4">
                      {wonPrize.picture ? (
                        <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-current">
                          <img 
                            src={wonPrize.picture} 
                            alt={wonPrize.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className={`${wonPrize.color}`}>{wonPrize.icon}</div>
                      )}
                      <div className="text-left">
                        <div className="text-xl font-bold text-white">{wonPrize.name}</div>
                        <div className="text-sm text-yellow-300">{wonPrize.value}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* All Participants */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-center text-purple-400">All Participants</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {participants.map((participant, index) => (
                  <div
                    key={participant.id}
                    className={`participant-card p-4 rounded-lg border-2 ${
                      selectedParticipant?.id === participant.id 
                        ? 'border-green-400 bg-green-900/20' 
                        : 'border-purple-400/50 bg-purple-900/20'
                    } backdrop-blur-sm animate-slide-in`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-current">
                        {participant.picture ? (
                          <img 
                            src={participant.picture} 
                            alt={participant.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-cyan-400 to-purple-400 flex items-center justify-center text-white font-bold">
                            {participant.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-white">{participant.name}</div>
                        <div className="text-xs text-gray-400">ID: {participant.id.slice(-8)}</div>
                      </div>
                      {selectedParticipant?.id === participant.id && (
                        <Crown className="w-6 h-6 text-yellow-400" />
                      )}
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