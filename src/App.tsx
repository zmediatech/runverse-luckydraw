import React, { useState, useEffect } from 'react';
import { Trophy, Zap, Star, Crown, Gift, Gem, Coins, Award, Users, AlertCircle, RefreshCw } from 'lucide-react';
import { useLuckyDraw } from './hooks/useLuckyDraw';
import { ParticipantDisplay } from './components/ParticipantDisplay';
import { PrizeDisplay } from './components/PrizeDisplay';
import { submitWinners } from './services/api';
import { GameState, Participant, Prize } from './types';

function App() {
  const { 
    luckyDrawData, 
    participants, 
    winners,
    remainingParticipants,
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
  const [winnersSubmitted, setWinnersSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // Show loading state while API data is being fetched
  if (apiLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-cyan-900 flex items-center justify-center relative overflow-hidden">
        {/* Animated background grid */}
        <div className="absolute inset-0 bg-grid opacity-20"></div>
        
        {/* Floating particles */}
        <div className="particles">
          {[...Array(10)].map((_, i) => (
            <div key={i} className={`particle particle-${i}`}></div>
          ))}
        </div>
        
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
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-cyan-900 flex items-center justify-center relative overflow-hidden">
        {/* Animated background grid */}
        <div className="absolute inset-0 bg-grid opacity-20"></div>
        
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
    if (participants.length === 0) {
      alert('No participants available! Please check your connection and try again.');
      return;
    }
    
    if (prizes.length === 0) {
      alert('No prizes available! The game will continue with default prizes.');
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
              // Submit winners data to API
              submitWinnersData();
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

  const submitWinnersData = async () => {
    if (!luckyDrawData || winners.length === 0 || winnersSubmitted) {
      return;
    }

    try {
      setSubmissionError(null);
      
      // Format winners data for API
      const winnersData = winners.map(winner => ({
        uid: winner.id,
        reward: winner.prize?.name || 'Unknown Prize',
        position: winner.position?.toString() || '0'
      }));

      await submitWinners(luckyDrawData.eventId, winnersData);
      setWinnersSubmitted(true);
      console.log('Winners data submitted successfully to backend');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit winners data';
      setSubmissionError(errorMessage);
      console.error('Failed to submit winners data:', errorMessage);
    }
  };

  const resetGame = () => {
    setGameState('start');
    setCurrentParticipantIndex(0);
    setCurrentPrizeIndex(0);
    setTickerSpeed(80);
    setWonPrize(null);
    setSelectedParticipant(null);
    setWinnersSubmitted(false);
    setSubmissionError(null);
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
            <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 neon-glow-text animate-fly-in golden-border">
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
              disabled={participants.length === 0}
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
                LUCKY DRAW RESULTS
              </h1>
              <p className="text-lg text-cyan-300">Tournament Champions & All Participants</p>
              <div className="flex justify-center gap-8 text-sm text-purple-300 mt-4">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>{participantCount} Total Participants</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  <span>{winners.length} Prize Winners</span>
                </div>
                {winnersSubmitted && (
                  <div className="flex items-center gap-2 text-green-400">
                    <Award className="w-5 h-5" />
                    <span>Results Submitted</span>
                  </div>
                )}
                {submissionError && (
                  <div className="flex items-center gap-2 text-red-400">
                    <AlertCircle className="w-5 h-5" />
                    <span>Submission Failed</span>
                  </div>
                )}
              </div>
            </div>

            {/* Top 3 Winners Podium */}
            {winners.length > 0 && (
              <div className="section-spacing">
                <h2 className="text-3xl font-bold text-center text-yellow-400 neon-glow-text">
                  🏆 PRIZE WINNERS 🏆
                </h2>
                
                {/* Top 3 Podium */}
                <div className="flex justify-center items-end gap-6 mb-12">
                  {winners.slice(0, 3).map((winner, index) => {
                    const podiumOrder = [1, 0, 2]; // 2nd, 1st, 3rd for visual arrangement
                    const actualIndex = podiumOrder[index];
                    const actualWinner = winners[actualIndex];
                    if (!actualWinner) return null;
                    
                    const heights = ['h-32', 'h-40', 'h-28'];
                    
                    return (
                      <div
                        key={actualWinner.id}
                        className={`podium-card ${getRankGlow(actualWinner.position || 1)} p-6 rounded-xl ${heights[index]} flex flex-col justify-between items-center animate-slide-in backdrop-blur-sm min-w-[160px]`}
                        style={{ animationDelay: `${index * 0.2}s` }}
                      >
                        <div className="text-center">
                          <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-current mb-4 mx-auto">
                            {actualWinner.picture ? (
                              <img 
                                src={actualWinner.picture} 
                                alt={actualWinner.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center text-white font-bold text-lg">
                                {actualWinner.name.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div className="font-bold text-white text-base mb-2 truncate max-w-[140px]">{actualWinner.name}</div>
                          <div className="text-sm opacity-75 mb-3">Position {actualWinner.position}</div>
                        </div>
                        
                        {actualWinner.prize && (
                          <div className="text-center mt-2">
                            {actualWinner.prize.picture ? (
                              <div className="w-14 h-14 rounded-lg overflow-hidden border-2 border-current mx-auto mb-3">
                                <img 
                                  src={actualWinner.prize.picture} 
                                  alt={actualWinner.prize.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className={`${actualWinner.prize.color} mb-3 flex justify-center`}>
                                {actualWinner.prize.icon}
                              </div>
                            )}
                            <div className="text-sm font-bold text-white truncate max-w-[140px]">{actualWinner.prize.name}</div>
                          </div>
                        )}
                        
                        <div className="text-3xl mt-3">
                          {getRankIcon(actualWinner.position || 1)}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* All Winners Table */}
                {winners.length > 0 && (
                  <div className="section-spacing">
                    <h3 className="text-2xl font-bold text-center text-purple-400 mb-8 mt-12">All Prize Winners</h3>
                    <div className="leaderboard-container max-h-[500px] overflow-y-auto">
                        {winners.map((winner, index) => (
                          <div
                            key={winner.id}
                            className={`leaderboard-row ${getRankGlow(winner.position || 1)} flex items-center gap-8 animate-slide-in-left`}
                            style={{ animationDelay: `${index * 0.1}s` }}
                          >
                            <div className="flex items-center gap-4 min-w-[100px]">
                              <span className="text-3xl font-bold"># {winner.position}</span>
                              {getRankIcon(winner.position || 1)}
                            </div>
                            
                            <div className="w-16 h-16 rounded-full overflow-hidden border-3 border-current flex-shrink-0 ml-2">
                              {winner.picture ? (
                                <img 
                                  src={winner.picture} 
                                  alt={winner.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center text-white font-bold">
                                  {winner.name.charAt(0)}
                                </div>
                              )}
                            </div>
                            
                            <div className="flex-1 ml-4">
                              <div className="font-bold text-white text-xl mb-1">{winner.name}</div>
                              <div className="text-sm opacity-75">ID: {winner.id.slice(-8)}</div>
                            </div>
                            
                            {winner.prize && (
                              <div className="flex items-center gap-6 min-w-[280px] flex-shrink-0 ml-6">
                                {winner.prize.picture ? (
                                  <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-current">
                                    <img 
                                      src={winner.prize.picture} 
                                      alt={winner.prize.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                ) : (
                                  <div className={`${winner.prize.color}`}>
                                    {winner.prize.icon}
                                  </div>
                                )}
                                <div className="ml-2">
                                  <div className="font-bold text-white text-lg">{winner.prize.name}</div>
                                  <div className="text-base text-yellow-300 mt-1">{winner.prize.value}</div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Remaining Participants */}
            {remainingParticipants.length > 0 && (
              <div className="section-spacing">
                <h3 className="text-2xl font-bold text-center text-cyan-400 mb-8">All Participants</h3>
                <div className="leaderboard-container max-h-80 overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {remainingParticipants.map((participant, index) => (
                      <div
                        key={participant.id}
                        className="participant-card animate-slide-in"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <div className="flex items-center gap-5">
                          <span className="text-base font-bold text-purple-300 min-w-[50px]"># {participant.position}</span>
                          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-purple-400/50 flex-shrink-0">
                            {participant.picture ? (
                              <img 
                                src={participant.picture} 
                                alt={participant.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-cyan-400 to-purple-400 flex items-center justify-center text-white font-bold text-sm">
                                {participant.name.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0 ml-2">
                            <div className="font-bold text-white text-base truncate">{participant.name}</div>
                            <div className="text-sm text-gray-400 truncate mt-1">ID: {participant.id.slice(-8)}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="text-center pt-12">
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