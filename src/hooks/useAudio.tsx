import { useEffect, useRef, useState } from 'react';

export const useAudio = () => {
  const backgroundMusicRef = useRef<HTMLAudioElement | null>(null);
  const tickerSoundRef = useRef<HTMLAudioElement | null>(null);
  const winningSoundRef = useRef<HTMLAudioElement | null>(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Initialize audio elements
    backgroundMusicRef.current = new Audio();
    tickerSoundRef.current = new Audio();
    winningSoundRef.current = new Audio();

    // Set audio properties
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.loop = true;
      backgroundMusicRef.current.volume = 0.4;
      backgroundMusicRef.current.preload = 'auto';
    }
    
    if (tickerSoundRef.current) {
      tickerSoundRef.current.loop = true;
      tickerSoundRef.current.volume = 0.5;
      tickerSoundRef.current.preload = 'auto';
    }
    
    if (winningSoundRef.current) {
      winningSoundRef.current.loop = false;
      winningSoundRef.current.volume = 0.7;
      winningSoundRef.current.preload = 'auto';
    }

    return () => {
      // Cleanup audio elements
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.pause();
        backgroundMusicRef.current = null;
      }
      if (tickerSoundRef.current) {
        tickerSoundRef.current.pause();
        tickerSoundRef.current = null;
      }
      if (winningSoundRef.current) {
        winningSoundRef.current.pause();
        winningSoundRef.current = null;
      }
    };
  }, []);

  const enableAudio = async () => {
    try {
      setIsAudioEnabled(true);
      console.log('Audio enabled successfully');
      return true;
    } catch (error) {
      console.warn('Audio could not be enabled:', error);
      return false;
    }
  };

  const playBackgroundMusic = async () => {
    if (!isAudioEnabled || !backgroundMusicRef.current) return;

    try {
      setIsLoading(true);
      
      // Stop other sounds
      if (tickerSoundRef.current) {
        tickerSoundRef.current.pause();
        tickerSoundRef.current.currentTime = 0;
      }
      if (winningSoundRef.current) {
        winningSoundRef.current.pause();
        winningSoundRef.current.currentTime = 0;
      }

      // Lucky draw themed background music sources
      const musicSources = [
        'https://www.soundjay.com/misc/sounds/casino-ambience-1.mp3',
        'https://freesound.org/data/previews/316/316738_5123451-lq.mp3',
        'https://www.zapsplat.com/wp-content/uploads/2015/sound-effects-one/zapsplat_casino_ambience_001.mp3'
      ];

      let sourceIndex = 0;
      const tryNextSource = () => {
        if (sourceIndex < musicSources.length && backgroundMusicRef.current) {
          backgroundMusicRef.current.src = musicSources[sourceIndex];
          sourceIndex++;
        } else if (backgroundMusicRef.current) {
          // Fallback to generated lucky draw music
          backgroundMusicRef.current.src = createLuckyDrawMusic();
        }
      };

      backgroundMusicRef.current.onerror = tryNextSource;
      tryNextSource();

      setCurrentTrack('background');
      await backgroundMusicRef.current.play();
      console.log('Lucky draw music started');
    } catch (error) {
      console.warn('Background music could not be played:', error);
      // Try with generated music
      try {
        if (backgroundMusicRef.current) {
          backgroundMusicRef.current.src = createLuckyDrawMusic();
          await backgroundMusicRef.current.play();
        }
      } catch (fallbackError) {
        console.warn('Fallback audio also failed:', fallbackError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const playTickerSound = async () => {
    if (!isAudioEnabled || !tickerSoundRef.current) return;

    try {
      setIsLoading(true);
      
      // Stop background music
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.pause();
        backgroundMusicRef.current.currentTime = 0;
      }
      
      // Spinning music sources - upbeat music for spinning
      const spinMusicSources = [
        'https://www.soundjay.com/misc/sounds/spinning-wheel-music.mp3',
        'https://freesound.org/data/previews/316/316738_5123451-lq.mp3',
        'https://www.zapsplat.com/wp-content/uploads/2015/sound-effects-one/zapsplat_spinning_music_001.mp3'
      ];

      let sourceIndex = 0;
      const tryNextSource = () => {
        if (sourceIndex < spinMusicSources.length && tickerSoundRef.current) {
          tickerSoundRef.current.src = spinMusicSources[sourceIndex];
          sourceIndex++;
        } else if (tickerSoundRef.current) {
          // Fallback to generated spin music
          tickerSoundRef.current.src = createSpinMusic();
        }
      };

      tickerSoundRef.current.onerror = tryNextSource;
      tickerSoundRef.current.onloadeddata = () => {
        console.log('Spinning music loaded successfully');
      };
      tryNextSource();

      setCurrentTrack('spinning');
      tickerSoundRef.current.currentTime = 0;
      tickerSoundRef.current.loop = true;
      await tickerSoundRef.current.play();
      console.log('Spinning music started');
    } catch (error) {
      console.warn('Spinning music could not be played:', error);
      // Fallback to generated music
      try {
        if (tickerSoundRef.current) {
          tickerSoundRef.current.src = createSpinMusic();
          tickerSoundRef.current.currentTime = 0;
          tickerSoundRef.current.loop = true;
          await tickerSoundRef.current.play();
        }
      } catch (fallbackError) {
        console.warn('Fallback spinning music also failed:', fallbackError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const playWinningSound = async () => {
    if (!isAudioEnabled || !winningSoundRef.current) return;

    try {
      setIsLoading(true);
      
      // Stop spinning music
      if (tickerSoundRef.current) {
        tickerSoundRef.current.pause();
      }
      
      // Decent congratulations sound sources
      const winningSources = [
        'https://www.soundjay.com/misc/sounds/ta-da.mp3',
        'https://freesound.org/data/previews/316/316847_5123451-lq.mp3', 
        'https://www.zapsplat.com/wp-content/uploads/2015/sound-effects-one/zapsplat_ta_da_001.mp3'
      ];

      let sourceIndex = 0;
      const tryNextSource = () => {
        if (sourceIndex < winningSources.length && winningSoundRef.current) {
          winningSoundRef.current.src = winningSources[sourceIndex];
          sourceIndex++;
        } else if (winningSoundRef.current) {
          // Fallback to generated decent congratulations sound
          winningSoundRef.current.src = createDecentCongratsSound();
        }
      };

      winningSoundRef.current.onerror = tryNextSource;
      tryNextSource();

      // Reset to beginning and ensure it plays only once
      winningSoundRef.current.currentTime = 0;
      winningSoundRef.current.loop = false;

      setCurrentTrack('winning');
      await winningSoundRef.current.play();
      console.log('Congratulations sound started (plays once)');
      
      // Clear current track when sound ends
      winningSoundRef.current.onended = () => {
        setCurrentTrack(null);
      };
    } catch (error) {
      console.warn('Winning sound could not be played:', error);
      // Fallback to generated sound
      try {
        if (winningSoundRef.current) {
          winningSoundRef.current.src = createDecentCongratsSound();
          winningSoundRef.current.currentTime = 0;
          winningSoundRef.current.loop = false;
          await winningSoundRef.current.play();
        }
      } catch (fallbackError) {
        console.warn('Fallback winning sound also failed:', fallbackError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const stopAllAudio = () => {
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.pause();
      backgroundMusicRef.current.currentTime = 0;
    }
    if (tickerSoundRef.current) {
      tickerSoundRef.current.pause();
      tickerSoundRef.current.currentTime = 0;
    }
    if (winningSoundRef.current) {
      winningSoundRef.current.pause();
      winningSoundRef.current.currentTime = 0;
    }
    setCurrentTrack(null);
  };

  const toggleMute = () => {
    const newMutedState = !isAudioEnabled;
    setIsAudioEnabled(!newMutedState);
    
    if (newMutedState) {
      stopAllAudio();
    }
  };

  return {
    isAudioEnabled,
    currentTrack,
    isLoading,
    enableAudio,
    playBackgroundMusic,
    playTickerSound,
    playWinningSound,
    stopAllAudio,
    toggleMute
  };
};

// Create lucky draw themed background music
const createLuckyDrawMusic = (): string => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const sampleRate = audioContext.sampleRate;
    const duration = 10; // 10 seconds loop
    const numSamples = sampleRate * duration;
    
    const buffer = audioContext.createBuffer(2, numSamples, sampleRate);
    
    for (let channel = 0; channel < 2; channel++) {
      const channelData = buffer.getChannelData(channel);
      
      for (let i = 0; i < numSamples; i++) {
        const time = i / sampleRate;
        
        // Create lucky draw themed music
        const melody = Math.sin(2 * Math.PI * 261.63 * time) * 0.3; // C4
        const harmony = Math.sin(2 * Math.PI * 329.63 * time) * 0.2; // E4
        const bass = Math.sin(2 * Math.PI * 130.81 * time) * 0.4; // C3
        const rhythm = Math.sin(2 * Math.PI * 523.25 * time) * Math.sin(2 * Math.PI * 2 * time) * 0.15; // C5 rhythm
        
        // Add some sparkle
        const sparkle = Math.sin(2 * Math.PI * 1046.5 * time) * Math.sin(2 * Math.PI * 0.5 * time) * 0.1;
        
        channelData[i] = (melody + harmony + bass + rhythm + sparkle) * 0.6;
      }
    }
    
    return bufferToWave(buffer);
  } catch (error) {
    console.warn('Could not create lucky draw music:', error);
    return '';
  }
};

// Create spinning music
const createSpinMusic = (): string => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const sampleRate = audioContext.sampleRate;
    const duration = 4; // 4 second loop for music
    const numSamples = sampleRate * duration;
    
    const buffer = audioContext.createBuffer(2, numSamples, sampleRate);
    
    for (let channel = 0; channel < 2; channel++) {
      const channelData = buffer.getChannelData(channel);
      
      for (let i = 0; i < numSamples; i++) {
        const time = i / sampleRate;
        
        // Create exciting spinning music with building tension
        const melody = Math.sin(2 * Math.PI * 523.25 * time) * 0.4; // C5
        const harmony = Math.sin(2 * Math.PI * 659.25 * time) * 0.3; // E5
        const bass = Math.sin(2 * Math.PI * 261.63 * time) * 0.5; // C4
        const rhythm = Math.sin(2 * Math.PI * 1046.5 * time) * Math.sin(2 * Math.PI * 8 * time) * 0.2; // C6 rhythm
        
        // Add spinning excitement and tension
        const excitement = Math.sin(2 * Math.PI * 1760 * time) * Math.sin(2 * Math.PI * 4 * time) * 0.15;
        const tension = Math.sin(2 * Math.PI * 880 * time) * Math.sin(2 * Math.PI * 6 * time) * 0.1;
        
        channelData[i] = (melody + harmony + bass + rhythm + excitement + tension) * 0.8;
      }
    }
    
    return bufferToWave(buffer);
  } catch (error) {
    console.warn('Could not create spinning music:', error);
    return '';
  }
};

// Create decent congratulations sound
const createDecentCongratsSound = (): string => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const sampleRate = audioContext.sampleRate;
    const duration = 4; // 4 seconds for full revealing experience
    const numSamples = sampleRate * duration;
    
    const buffer = audioContext.createBuffer(2, numSamples, sampleRate);
    
    for (let channel = 0; channel < 2; channel++) {
      const channelData = buffer.getChannelData(channel);
      
      for (let i = 0; i < numSamples; i++) {
        const time = i / sampleRate;
        
        // Create revealing congratulations sound with multiple phases
        let sample = 0;
        
        // Phase 1: Drum roll build-up (0-1.5s)
        if (time < 1.5) {
          const drumRoll = Math.sin(2 * Math.PI * 80 * time) * Math.sin(2 * Math.PI * 20 * time) * 0.3;
          const buildUp = Math.sin(2 * Math.PI * 220 * time) * (time / 1.5) * 0.2;
          sample += drumRoll + buildUp;
        }
        
        // Phase 2: Big reveal moment (1.5-2s)
        if (time >= 1.5 && time < 2) {
          const revealTime = time - 1.5;
          const bigReveal = Math.sin(2 * Math.PI * 523.25 * revealTime) * 0.8; // C5
          const harmony = Math.sin(2 * Math.PI * 659.25 * revealTime) * 0.6; // E5
          const bass = Math.sin(2 * Math.PI * 261.63 * revealTime) * 0.4; // C4
          sample += bigReveal + harmony + bass;
        }
        
        // Phase 3: Clapping and celebration (2-4s)
        if (time >= 2) {
          const celebrationTime = time - 2;
          
          // Clapping sound (irregular rhythm)
          const clapTiming = Math.floor(celebrationTime * 8) % 4;
          const clapIntensity = clapTiming === 0 || clapTiming === 2 ? 1 : 0;
          const claps = Math.random() * clapIntensity * 0.4;
          
          // Victory melody
          const victoryMelody = Math.sin(2 * Math.PI * 783.99 * celebrationTime) * 0.4; // G5
          const victoryHarmony = Math.sin(2 * Math.PI * 987.77 * celebrationTime) * 0.3; // B5
          
          // Celebration sparkles
          const sparkles = Math.sin(2 * Math.PI * 1567.98 * celebrationTime) * Math.sin(2 * Math.PI * 4 * celebrationTime) * 0.2;
          
          sample += claps + victoryMelody + victoryHarmony + sparkles;
        }
        
        // Natural envelope that fades out gradually
        const envelope = Math.max(0, 1 - (time / duration) * 0.6) * (0.9 + 0.1 * Math.sin(2 * Math.PI * 1 * time));
        
        channelData[i] = sample * envelope * 0.7;
      }
    }
    
    return bufferToWave(buffer);
  } catch (error) {
    console.warn('Could not create revealing congratulations sound:', error);
    return '';
  }
};

// Convert AudioBuffer to WAV data URL
const bufferToWave = (buffer: AudioBuffer): string => {
  try {
    const length = buffer.length;
    const numberOfChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const arrayBuffer = new ArrayBuffer(44 + length * numberOfChannels * 2);
    const view = new DataView(arrayBuffer);
    
    // WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };
    
    writeString(0, 'RIFF');
    view.setUint32(4, 36 + length * numberOfChannels * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numberOfChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numberOfChannels * 2, true);
    view.setUint16(32, numberOfChannels * 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, length * numberOfChannels * 2, true);
    
    // Convert float samples to 16-bit PCM
    let offset = 44;
    for (let i = 0; i < length; i++) {
      for (let channel = 0; channel < numberOfChannels; channel++) {
        const sample = Math.max(-1, Math.min(1, buffer.getChannelData(channel)[i]));
        view.setInt16(offset, sample * 0x7FFF, true);
        offset += 2;
      }
    }
    
    const blob = new Blob([arrayBuffer], { type: 'audio/wav' });
    return URL.createObjectURL(blob);
  } catch (error) {
    console.warn('Could not convert buffer to wave:', error);
    return '';
  }
};