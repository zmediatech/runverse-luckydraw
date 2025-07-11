import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
    disableAudio,
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

  // Memoize expensive calculations
  const memoizedParticipants = useMemo(() => participants, [participants]);
  const memoizedPrizes = useMemo(() => prizes, [prizes]);

  // Optimized game start function
  const startGame = useCallback(() => {
    if (memoizedParticipants.length === 0) {
      alert('No participants available! Please check your connection and try again.');
      return;
    }
    
    if (memoizedPrizes.length === 0) {
      alert('No prizes available! The game will continue with default prizes.');
    }

    setGameState('ticker');
    
    // Play ticker sound for spinning screen
    playTickerSound();
    
    setTickerSpeed(80);
    
    let participantInterval: NodeJS.Timeout;
    let prizeInterval: NodeJS.Timeout;
    let slowDownInterval: NodeJS.Timeout;
    
    // Fast ticker animation that gradually slows down
    participantInterval = setInterval(() => {
      setCurrentParticipantIndex((prev) => (prev + 1) % memoizedParticipants.length);
    }, tickerSpeed);

    prizeInterval = setInterval(() => {
      setCurrentPrizeIndex((prev) => (prev + 1) % memoizedPrizes.length);
    }, tickerSpeed);

    // Gradually slow down the ticker
    slowDownInterval = setInterval(() => {
      setTickerSpeed(prev => {
        const newSpeed = prev + 15; // Faster slowdown for better UX
        if (newSpeed >= 250) { // Reduced max speed for quicker resolution
          clearInterval(slowDownInterval);
          clearInterval(participantInterval);
          clearInterval(prizeInterval);
          
          // Final reveal of the winner
          setTimeout(() => {
            const finalParticipantIndex = Math.floor(Math.random() * memoizedParticipants.length);
            const finalPrizeIndex = Math.floor(Math.random() * memoizedPrizes.length);
            
            setCurrentParticipantIndex(finalParticipantIndex);
            setCurrentPrizeIndex(finalPrizeIndex);
            setSelectedParticipant(memoizedParticipants[finalParticipantIndex]);
            setWonPrize(memoizedPrizes[finalPrizeIndex]);
            
            // Show celebration effects
            setShowCelebration(true);
            
            // Play winning sound
            playWinningSound();
            
            // Transition to results after short delay
            setTimeout(() => {
              setGameState('leaderboard');
              submitWinnersData();
            }, 1000);
            
            // Hide celebration effects
            setTimeout(() => {
              setShowCelebration(false);
            }, 2000);
          }, 300);
        }
        return newSpeed;
      });
    }, 150); // Faster interval for quicker slowdown

    // Cleanup after maximum time
    setTimeout(() => {
      clearInterval(slowDownInterval);
      clearInterval(participantInterval);
      clearInterval(prizeInterval);
    }, 3000); // Reduced total time
  }, [memoizedParticipants, memoizedPrizes, playTickerSound, playWinningSound]);

  // Optimized winners submission
  const submitWinnersData = useCallback(async () => {
    if (!luckyDrawData || winners.length === 0 || winnersSubmitted) {
      return;
    }

    try {
      setSubmissionError(null);
      
      const winnersData = winners.map(winner => ({
        uid: winner.id,
        reward: winner.prize?.name || 'Unknown Prize',
        position: winner.position?.toString() || '0'
      }));

      await submitWinners(luckyDrawData.eventId, winnersData);
      setWinnersSubmitted(true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit winners data';
      setSubmissionError(errorMessage);
    }
  }, [luckyDrawData, winners, winnersSubmitted]);

  // Optimized reset function
  const resetGame = useCallback(() => {
    setGameState('start');
    setCurrentParticipantIndex(0);
    setCurrentPrizeIndex(0);
    setTickerSpeed(80);
    setWonPrize(null);
    setSelectedParticipant(null);
    setWinnersSubmitted(false);
    setSubmissionError(null);
    setShowCelebration(false);
    
    // Reset audio to background music
    stopAllAudio();
    setTimeout(() => {
      playBackgroundMusic();
    }, 500);
  }, [stopAllAudio, playBackgroundMusic]);

  // Memoized helper functions
  const getRankIcon = useCallback((rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2: return <Trophy className="w-6 h-6 text-cyan-400" />;
      case 3: return <Star className="w-6 h-6 text-pink-400" />;
      default: return <Zap className="w-5 h-5 text-purple-400" />;
    }
  }, []);

  const getRankGlow = useCallback((rank: number) => {
    switch (rank) {
      case 1: return 'rank-1';
      case 2: return 'rank-2';
      case 3: return 'rank-3';
      default: return 'rank-default';
    }
  }, []);

  // Show loading state while API data is being fetched
  if (apiLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-cyan-900 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-20"></div>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-cyan-900 relative overflow-hidden">
      {/* Optimized background elements - reduced for performance */}
      <div className="absolute inset-0 bg-grid opacity-20"></div>
      
      {/* Reduced particles for better performance */}
      <div className="particles">
        {[...Array(10)].map((_, i) => (
          <div key={i} className={`particle particle-${i}`}></div>
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        {gameState === 'start' && (
          <div className="hero-container">
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
                  <div className="stat-number">{memoizedPrizes.length}</div>
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
                  disabled={memoizedParticipants.length === 0}
                  className="play-button"
                >
                  🎲 Play Now
                </button>
                
                {memoizedParticipants.length === 0 && (
                  <div className="mt-4 text-red-400 text-sm font-medium bg-red-900/20 rounded-lg p-3 border border-red-500/30">
                    ⚠️ No participants available. Please check your connection and try again.
                  </div>
                )}
              </div>

              {/* Features */}
              <div className="features-grid">
                <div className="feature-item">
                  <span className="feature-icon">⚡</span>
                  <div className="feature-text">Real-time spinning</div>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🎯</span>
                  <div className="feature-text">Fair & transparent</div>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">💎</span>
                  <div className="feature-text">Multiple prize tiers</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {gameState === 'ticker' && (
          <div className="text-center space-y-8">
            <h2 className="text-3xl md:text-5xl font-bold text-cyan-400 neon-glow-text animate-pulse">
              SPINNING...
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              <ParticipantDisplay 
                participants={memoizedParticipants}
                currentIndex={currentParticipantIndex}
                isSpinning={true}
              />
              <PrizeDisplay 
                prizes={memoizedPrizes}
                currentIndex={currentPrizeIndex}
                isSpinning={true}
              />
            </div>
            <p className="text-lg text-purple-300 opacity-75">
              The wheel is spinning... 🎰
            </p>
          </div>
        )}

        {gameState === 'leaderboard' && (
          <div className="w-full max-w-4xl mx-auto space-y-6">
            <div className="text-center space-y-4 animate-fade-in">
              <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-cyan-400 to-pink-400 neon-glow-text">
                🎉 CONGRATULATIONS! 🎉
              </h1>
              
              {/* Winner Announcement */}
              {selectedParticipant && wonPrize && (
                <div className="bg-gradient-to-r from-yellow-400/20 to-orange-400/20 border-2 border-yellow-400 rounded-xl p-8 mb-8 animate-slide-in">
                  <h2 className="text-3xl font-bold text-yellow-400 mb-4">🏆 {luckyDrawData?.eventId || 'LUCKY DRAW EVENT'} 🏆</h2>
                  <div className="flex items-center justify-center gap-6 mb-4">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-yellow-400">
                      {selectedParticipant.picture ? (
                        <img 
                          src={selectedParticipant.picture} 
                          alt={selectedParticipant.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center text-white font-bold text-2xl">
                          {selectedParticipant.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white mb-2">{selectedParticipant.name}</div>
                      <div className="text-yellow-300">ID: {selectedParticipant.id.slice(-8)}</div>
                    </div>
                  </div>
                  <div className="text-center border-t border-yellow-400/30 pt-4">
                    <div className="text-xl font-bold text-yellow-400 mb-2">Won: {wonPrize.name}</div>
                    <div className="text-lg text-yellow-300">{wonPrize.value}</div>
                  </div>
                </div>
              )}

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
              </div>
            </div>

            {/* Top 3 Winners Podium */}
            {winners.length > 0 && (
              <div className="section-spacing">
                <h2 className="text-3xl font-bold text-center text-yellow-400 mb-8 neon-glow-text">
                  🏆 TOP WINNERS 🏆
                </h2>
                <div className="flex flex-col md:flex-row items-end justify-center gap-6 max-w-5xl mx-auto mb-12">
                  {winners.slice(0, 3).map((winner, index) => {
                    const position = index + 1;
                    const podiumHeight = position === 1 ? 'md:h-80' : position === 2 ? 'md:h-64' : 'md:h-48';
                    const podiumWidth = position === 1 ? 'md:w-80' : position === 2 ? 'md:w-64' : 'md:w-48';
                    const crownIcon = position === 1 ? '👑' : position === 2 ? '🥈' : '🥉';
                    const crownSize = position === 1 ? 'text-6xl' : position === 2 ? 'text-5xl' : 'text-4xl';
                    const bgGradient = position === 1 
                      ? 'from-yellow-400/30 to-orange-400/30 border-yellow-400 shadow-yellow-400/50' 
                      : position === 2 
                      ? 'from-gray-300/30 to-gray-400/30 border-gray-300 shadow-gray-300/50'
                      : 'from-amber-600/30 to-amber-700/30 border-amber-600 shadow-amber-600/50';
                    const textColor = position === 1 ? 'text-yellow-400' : position === 2 ? 'text-gray-300' : 'text-amber-600';
                    const order = position === 1 ? 'md:order-2' : position === 2 ? 'md:order-1' : 'md:order-3';
                    
                    return (
                      <div
                        key={winner.id}
                        className={`${order} podium-card bg-gradient-to-br ${bgGradient} ${podiumHeight} ${podiumWidth} rounded-xl p-6 text-center animate-slide-in shadow-2xl border-4 relative overflow-hidden`}
                        style={{ animationDelay: `${index * 0.2}s` }}
                      >
                        {/* Podium Base */}
                        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/50 to-transparent"></div>
                        
                        {/* Crown/Medal */}
                        <div className={`${crownSize} mb-4 animate-bounce`}>{crownIcon}</div>
                        
                        {/* Position Badge */}
                        <div className={`text-3xl font-black ${textColor} mb-4 neon-glow-text`}>#{position}</div>
                        
                        {/* Winner Avatar */}
                        <div className={`${position === 1 ? 'w-24 h-24' : position === 2 ? 'w-20 h-20' : 'w-16 h-16'} rounded-full overflow-hidden border-4 border-current mx-auto mb-4 shadow-lg`}>
                          {winner.picture ? (
                            <img 
                              src={winner.picture} 
                              alt={winner.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className={`w-full h-full bg-gradient-to-br from-current to-transparent flex items-center justify-center text-white font-bold ${position === 1 ? 'text-2xl' : 'text-xl'}`}>
                              {winner.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        
                        {/* Winner Name */}
                        <div className={`${position === 1 ? 'text-xl' : 'text-lg'} font-bold text-white mb-2 neon-glow-text`}>{winner.name}</div>
                        <div className="text-sm opacity-75 mb-4">ID: {winner.id.slice(-8)}</div>
                        
                        {/* Prize Information */}
                        {winner.prize && (
                          <div className="border-t border-current/30 pt-4">
                            {/* Prize Icon */}
                            <div className={`${textColor} mb-2 flex justify-center`}>
                              {winner.prize.icon}
                            </div>
                            <div className={`text-sm font-bold ${textColor} mb-1`}>Prize Won:</div>
                            <div className="text-sm text-white font-semibold">{winner.prize.name}</div>
                            <div className="text-xs text-white/75 mt-1">{winner.prize.value}</div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Remaining Winners Table */}
            {winners.length > 3 && (
              <div className="section-spacing">
                <h3 className="text-2xl font-bold text-center text-cyan-400 mb-6">
                  🎁 Other Prize Winners
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                  {winners.slice(3).map((winner, index) => (
                    <div
                      key={winner.id}
                      className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border-2 border-purple-400/50 rounded-xl p-6 backdrop-blur-sm hover:border-cyan-400/70 transition-all duration-300 hover:transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
                    >
                      {/* Rank Badge */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="bg-purple-600/80 text-white px-3 py-1 rounded-full text-sm font-bold">
                          #{index + 4}
                        </div>
                        <div className="text-purple-400">
                          <Award className="w-5 h-5" />
                        </div>
                      </div>
                      
                      {/* Winner Info */}
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden border-3 border-purple-400 shadow-lg">
                          {winner.picture ? (
                            <img 
                              src={winner.picture} 
                              alt={winner.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-purple-400 to-cyan-400 flex items-center justify-center text-white font-bold text-lg">
                              {winner.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="text-lg font-bold text-white mb-1">{winner.name}</div>
                          <div className="text-sm text-purple-300">ID: {winner.id.slice(-8)}</div>
                        </div>
                      </div>
                      
                      {/* Prize Info */}
                      {winner.prize && (
                        <div className="border-t border-purple-400/30 pt-4">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="text-purple-400">
                              {winner.prize.icon}
                            </div>
                            <div className="text-sm font-bold text-purple-400">Prize Won:</div>
                          </div>
                          <div className="text-white font-semibold mb-1">{winner.prize.name}</div>
                          <div className="text-sm text-purple-300">{winner.prize.value}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* All Participants */}
            <div className="section-spacing">
              <h3 className="text-2xl font-bold text-center text-purple-400 mb-6">
                👥 All Participants
              </h3>
              <div className="max-h-80 overflow-y-auto bg-black/20 rounded-xl p-4 border border-cyan-400/20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {memoizedParticipants.map((participant, index) => (
                    <div
                      key={participant.id}
                      className={`p-3 rounded-lg border backdrop-blur-sm transition-colors ${
                        winners.some(w => w.id === participant.id)
                          ? 'bg-yellow-900/50 border-yellow-400/50 text-yellow-300' 
                          : 'bg-purple-900/30 border-purple-400/30 hover:bg-purple-900/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold min-w-[40px]">#{index + 1}</span>
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-current flex-shrink-0">
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
                          <div className="text-xs opacity-75 truncate">ID: {participant.id.slice(-8)}</div>
                        </div>
                        {winners.some(w => w.id === participant.id) && (
                          <div className="text-yellow-400 text-xl">👑</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

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