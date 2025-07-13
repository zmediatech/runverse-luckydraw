import React, { useState, useEffect } from 'react';
import { Trophy, Zap, Star, Crown, Gift, Gem, Coins, Award, Users, AlertCircle, RefreshCw } from 'lucide-react';
import { useLuckyDraw } from './hooks/useLuckyDraw';
import { useAudio } from './hooks/useAudio';
import { ParticipantDisplay } from './components/ParticipantDisplay';
import { PrizeDisplay } from './components/PrizeDisplay';
import { WinCelebration } from './components/WinCelebration';
import { AudioControls } from './components/AudioControls';
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

  const {
    isAudioEnabled,
    currentTrack,
    isLoading: audioLoading,
    enableAudio,
    playBackgroundMusic,
    playTickerSound,
    playWinningSound,
    stopAllAudio,
    toggleMute
  } = useAudio();

  const [gameState, setGameState] = useState<GameState>('start');
  const [currentParticipantIndex, setCurrentParticipantIndex] = useState(0);
  const [currentPrizeIndex, setCurrentPrizeIndex] = useState(0);
  const [tickerSpeed, setTickerSpeed] = useState(80);
  const [wonPrize, setWonPrize] = useState<Prize | null>(null);
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [winnersSubmitted, setWinnersSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  // Start background music when component mounts
  useEffect(() => {
    if (gameState === 'start') {
      playBackgroundMusic();
    }
  }, [gameState, isAudioEnabled]);

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

    // Enable audio if not already enabled
    if (!isAudioEnabled) {
      enableAudio();
    }

    setGameState('ticker');
    // Stop background music and start spinning music
    stopAllAudio();
    setTimeout(() => {
      playTickerSound(); // Start spinning music after brief pause
    }, 200);
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
            
            // Show celebration effects and go directly to results
            setShowCelebration(true);
            playWinningSound(); // Play revealing congratulations sound with claps
            setGameState('leaderboard');
            
            // Submit winners data to API
            submitWinnersData();
            
            // Hide celebration effects after 1.5 seconds
            setTimeout(() => {
              setShowCelebration(false);
            }, 1500);
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
    setShowCelebration(false);
    setShowCelebration(false);
    
    // Reset audio to background music
    stopAllAudio();
    if (isAudioEnabled) {
      setTimeout(() => playBackgroundMusic(), 500);
    }
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

      {/* Lucky draw themed background elements */}
      <div className="lucky-draw-bg">
        {[...Array(15)].map((_, i) => {
          const icons = ['🎰', '🎲', '🎯', '🎪', '🎊', '🎉', '💎', '👑', '🏆', '⭐', '💰', '🎁', '🍀', '🔥', '⚡'];
          const icon = icons[i % icons.length];
          const sizes = ['small', '', 'large'];
          const size = sizes[i % sizes.length];
          const left = Math.random() * 100;
          const delay = Math.random() * 15;
          const duration = 15 + Math.random() * 10;
          
          return (
            <div
              key={`icon-${i}`}
              className={`floating-icon ${size}`}
              style={{
                left: `${left}%`,
                animationDelay: `${delay}s`,
                animationDuration: `${duration}s`
              }}
            >
              {icon}
            </div>
          );
        })}
      </div>

      {/* Sparkle effects */}
      <div className="sparkles">
        {[...Array(25)].map((_, i) => {
          const left = Math.random() * 100;
          const top = Math.random() * 100;
          const delay = Math.random() * 3;
          
          return (
            <div
              key={`sparkle-${i}`}
              className="sparkle"
              style={{
                left: `${left}%`,
                top: `${top}%`,
                animationDelay: `${delay}s`
              }}
            />
          );
        })}
      </div>

      {/* Prize symbols floating */}
      <div className="prize-symbols">
        {[...Array(12)].map((_, i) => {
          const symbols = ['💰', '🏆', '👑', '💎', '⭐', '🎁', '🎯', '🍀', '🔥', '⚡', '💫', '✨'];
          const symbol = symbols[i % symbols.length];
          const left = Math.random() * 100;
          const delay = Math.random() * 12;
          const duration = 12 + Math.random() * 6;
          
          return (
            <div
              key={`prize-${i}`}
              className="prize-symbol"
              style={{
                left: `${left}%`,
                animationDelay: `${delay}s`,
                animationDuration: `${duration}s`
              }}
            >
              {symbol}
            </div>
          );
        })}
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        {gameState === 'start' && (
          <div className="hero-container">
            {/* Floating Shapes */}
            <div className="floating-shapes">
              {[...Array(15)].map((_, i) => {
                const shapes = ['shape-circle', 'shape-square', 'shape-triangle'];
                const shape = shapes[i % shapes.length];
                const size = 20 + Math.random() * 40;
                const left = Math.random() * 100;
                const delay = Math.random() * 20;
                
                return (
                  <div
                    key={`shape-${i}`}
                    className={`shape ${shape}`}
                    style={{
                      width: shape === 'shape-triangle' ? 'auto' : `${size}px`,
                      height: shape === 'shape-triangle' ? 'auto' : `${size}px`,
                      left: `${left}%`,
                      animationDelay: `${delay}s`,
                      animationDuration: `${20 + Math.random() * 10}s`
                    }}
                  />
                );
              })}
            </div>

            <div className="w-full max-w-6xl mx-auto flex flex-col items-center">
              {/* Hero Title */}
              <h1 className="hero-title animate-fly-in">
                LUCKY DRAW
              </h1>
              
              {/* Hero Subtitle */}
              <p className="hero-subtitle animate-fly-in" style={{ animationDelay: '0.8s' }}>
                🎯 Spin the wheel and win amazing prizes! 🎯
              </p>

              {/* Stats Grid */}
              <div className="stats-grid animate-flip-flop-twice">
                <div className="stat-item">
                  <span className="stat-icon">👥</span>
                  <div className="stat-number">{participantCount}</div>
                  <div className="stat-label">Players Ready</div>
                </div>
                
                <div className="stat-item">
                  <span className="stat-icon">🎁</span>
                  <div className="stat-number">{prizes.length}</div>
                  <div className="stat-label">Amazing Prizes</div>
                </div>
                
                <div className="stat-item">
                  <span className="stat-icon">🏆</span>
                  <div className="stat-number">{numWinners}</div>
                  <div className="stat-label">Lucky Winners</div>
                </div>
              </div>

              {/* Call to Action */}
              <div className="cta-section">
                <p className="cta-text">
                  Ready to test your luck? 🍀
                </p>
                <button
                  onClick={startGame}
                  disabled={participants.length === 0}
                  className="play-button"
                >
                  🎲 Play Now
                </button>
                
                {participants.length === 0 && (
                  <div className="mt-4 text-red-400 text-sm font-medium bg-red-900/20 rounded-lg p-3 border border-red-500/30">
                    ⚠️ No participants available. Please check your connection and try again.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {gameState === 'ticker' && (
          <div className="text-center space-y-8">
            <h2 className="text-3xl md:text-5xl font-bold text-cyan-400 neon-glow-text animate-pulse">
              SPINNING...
            </h2>
            <div className="flex justify-center max-w-2xl mx-auto">
              <ParticipantDisplay 
                participants={participants}
                currentIndex={currentParticipantIndex}
                isSpinning={true}
              />
            </div>
            <p className="text-lg text-purple-300 opacity-75">
              The wheel is spinning...
            </p>
          </div>
        )}


        {gameState === 'leaderboard' && (
          <div className="w-full max-w-4xl mx-auto space-y-6">
            <div className="text-center space-y-4 animate-fade-in">
              <h1 className="text-4xl md:text-6xl font-bold text-white">
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

            {/* Prize Winners Section */}
            {winners.length > 0 && (
              <div className="section-spacing">
                <h2 className="text-3xl font-bold text-center text-yellow-400 mb-8">
                  🏆 PRIZE WINNERS 🏆
                </h2>
                
                {/* Top 3 Winners Grid */}
                <div className="flex flex-col md:flex-row justify-center items-end gap-6 max-w-6xl mx-auto mb-12">
                  {/* Leaderboard arrangement: 2nd, 1st, 3rd */}
                  {[
                    winners.find(w => w.position === 2), // 2nd place (left)
                    winners.find(w => w.position === 1), // 1st place (center, tallest)
                    winners.find(w => w.position === 3)  // 3rd place (right)
                  ].filter(Boolean).map((winner, index) => {
                    const isFirst = winner.position === 1;
                    const isSecond = winner.position === 2;
                    const isThird = winner.position === 3;
                    
                    return (
                    <div
                      key={winner.id}
                      className={`
                        ${isFirst ? 'bg-yellow-500' : 
                          isSecond ? 'bg-cyan-500' : 
                          'bg-pink-500'} 
                        p-8 rounded-3xl animate-slide-in border-0
                        ${isFirst ? 'min-h-[500px] md:w-80 leaderboard-champion' : 
                          isSecond ? 'min-h-[420px] md:w-72 leaderboard-runner-up' : 
                          'min-h-[380px] md:w-72 leaderboard-third-place'}
                        w-full flex flex-col justify-between relative
                        ${isFirst ? 'order-2 md:order-2' : 
                          isSecond ? 'order-1 md:order-1' : 
                          'order-3 md:order-3'}
                      `}
                      style={{ animationDelay: `${index * 0.2}s` }}
                    >
                      {/* Position Badge */}
                      <div className="flex items-center justify-center mb-6 relative z-10">
                        <div className={`flex items-center gap-3 ${isFirst ? 'text-3xl' : 'text-2xl'} font-bold ${
                          isFirst ? 'text-yellow-900' : 
                          isSecond ? 'text-cyan-900' : 
                          'text-pink-900'
                        }`}>
                          {getRankIcon(winner.position || 1)}
                          <span>#{winner.position}</span>
                        </div>
                      </div>
                      
                      {/* Winner Avatar */}
                      <div className="flex justify-center mb-6 relative z-10">
                        <div className={`${isFirst ? 'w-28 h-28' : 'w-24 h-24'} rounded-full overflow-hidden border-4 ${
                          isFirst ? 'border-yellow-700' : 
                          isSecond ? 'border-cyan-700' : 
                          'border-pink-700'
                        } shadow-lg`}>
                          {winner.picture ? (
                            <img 
                              src={winner.picture} 
                              alt={winner.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className={`w-full h-full bg-gradient-to-br ${
                              isFirst ? 'from-yellow-400 to-orange-400' : 
                              isSecond ? 'from-cyan-400 to-blue-400' : 
                              'from-pink-400 to-purple-400'
                            } flex items-center justify-center text-white font-bold ${isFirst ? 'text-2xl' : 'text-xl'}`}>
                              {winner.name.charAt(0)}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Winner Name */}
                      <div className="text-center mb-6 relative z-10">
                        <div className={`font-bold ${isFirst ? 'text-yellow-900' : isSecond ? 'text-cyan-900' : 'text-pink-900'} ${isFirst ? 'text-xl' : 'text-lg'} mb-2`}>{winner.name}</div>
                        <div className={`text-sm ${
                          isFirst ? 'text-yellow-800' : 
                          isSecond ? 'text-cyan-800' : 
                          'text-pink-800'
                        } bg-white/20 rounded-full px-3 py-1 inline-block`}>ID: {winner.id.slice(-8)}</div>
                      </div>
                      
                      {/* Divider Line */}
                      <div className={`w-full h-px ${
                        isFirst ? 'bg-yellow-700' : 
                        isSecond ? 'bg-cyan-700' : 
                        'bg-pink-700'
                      } mb-6 relative z-10`}></div>
                      
                      {/* Prize */}
                      {winner.prize && (
                        <div className="text-center mt-auto relative z-10">
                          <div className="flex justify-center mb-4 prize-container">
                            {winner.prize.picture ? (
                              <div className={`${isFirst ? 'w-20 h-20' : 'w-16 h-16'} rounded-xl overflow-hidden border-2 ${
                                isFirst ? 'border-yellow-700' : 
                                isSecond ? 'border-cyan-700' : 
                                'border-pink-700'
                              } shadow-xl bg-white/10`}>
                                <img 
                                  src={winner.prize.picture} 
                                  alt={winner.prize.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className={`${winner.prize.color} ${isFirst ? 'scale-[2.5]' : 'scale-[2]'} drop-shadow-lg`}>
                                {winner.prize.icon}
                              </div>
                            )}
                          </div>
                          <div className={`font-bold ${isFirst ? 'text-yellow-900' : isSecond ? 'text-cyan-900' : 'text-pink-900'} ${isFirst ? 'text-lg' : 'text-base'} mb-3`}>{winner.prize.name}</div>
                          <div className={`${isFirst ? 'text-base' : 'text-sm'} font-semibold rounded-full px-4 py-2 inline-block ${
                            isFirst ? 'text-yellow-100 bg-yellow-700' : 
                            isSecond ? 'text-cyan-100 bg-cyan-700' : 
                            'text-pink-100 bg-pink-700'
                          }`}>{winner.prize.value}</div>
                        </div>
                      )}
                    </div>
                    );
                  })}
                </div>

                {/* All Winners List */}
                {winners.length > 3 && (
                  <div className="mt-12">
                    <h3 className="text-xl font-bold text-center text-white mb-6">Other Prize Winners</h3>
                    <div className="grid grid-cols-1 gap-4 max-w-4xl mx-auto">
                      {winners.slice(3).map((winner, index) => (
                        <div
                          key={winner.id}
                          className="bg-gradient-to-r from-slate-800 to-slate-700 p-4 rounded-lg border-2 border-slate-600 animate-slide-in flex items-center gap-4 shadow-lg"
                          style={{ animationDelay: `${(index + 3) * 0.1}s` }}
                        >
                          <div className="flex items-center gap-2 min-w-[60px]">
                            <span className="text-lg font-bold text-yellow-400">#{winner.position}</span>
                            {getRankIcon(winner.position || 1)}
                          </div>
                          
                          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-current flex-shrink-0">
                            {winner.picture ? (
                              <img 
                                src={winner.picture} 
                                alt={winner.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center text-white font-bold text-sm">
                                {winner.name.charAt(0)}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-white text-base truncate">{winner.name}</div>
                            <div className="text-xs text-white opacity-75 truncate">ID: {winner.id.slice(-8)}</div>
                          </div>
                          
                          {winner.prize && (
                            <div className="flex items-center gap-2 flex-shrink-0">
                              {winner.prize.picture ? (
                                <div className="w-10 h-10 rounded-lg overflow-hidden border border-current">
                                  <img 
                                    src={winner.prize.picture} 
                                    alt={winner.prize.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ) : (
                                <div className={`${winner.prize.color} text-sm`}>
                                  {winner.prize.icon}
                                </div>
                              )}
                              <div className="text-right">
                                <div className="font-bold text-white text-sm">{winner.prize.name}</div>
                                <div className="text-xs text-white">{winner.prize.value}</div>
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

            {/* Remaining Participants - COMMENTED OUT FOR NOW */}
            {/* {remainingParticipants.length > 0 && (
              <div className="section-spacing">
                <h3 className="text-xl font-bold text-center text-cyan-400 mb-6">All Participants</h3>
                <div className="max-h-80 overflow-y-auto bg-black/20 rounded-xl p-4 border border-cyan-400/20">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {remainingParticipants.map((participant, index) => (
                      <div
                        key={participant.id}
                        className="bg-purple-900/30 p-3 rounded-lg border border-purple-400/30 backdrop-blur-sm animate-slide-in hover:bg-purple-900/50 transition-colors"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-purple-300 min-w-[40px]">#{participant.position}</span>
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
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-white text-sm truncate">{participant.name}</div>
                            <div className="text-xs text-gray-400 truncate">ID: {participant.id.slice(-8)}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )} */}

            <div className="text-center pt-8">
              <button
                onClick={resetGame}
                className="px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl border-2 border-pink-400 hover:border-cyan-400 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-pink-500/25"
              >
                🎲 SPIN AGAIN
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Win Celebration Effects */}
      <WinCelebration
        show={showCelebration}
        winnerName={selectedParticipant?.name || ''}
        prizeName={wonPrize?.name || ''}
        onComplete={() => setShowCelebration(false)}
      />
      
      {/* Audio Controls */}
      <AudioControls
        isAudioEnabled={isAudioEnabled}
        currentTrack={currentTrack}
        isLoading={audioLoading}
        onToggleMute={toggleMute}
        onEnableAudio={enableAudio}
      />
    </div>
  );
}

export default App;