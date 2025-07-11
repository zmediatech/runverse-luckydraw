import { useEffect, useRef, useState } from 'react';

export const useAudio = () => {
  const backgroundMusicRef = useRef<HTMLAudioElement | null>(null);
  const tickerSoundRef = useRef<HTMLAudioElement | null>(null);
  const winningSoundRef = useRef<HTMLAudioElement | null>(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Initialize audio elements with real music URLs
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

      // Use a royalty-free background music from freesound.org or similar
      // This is an upbeat, casino-style background music
      backgroundMusicRef.current.src = 'https://www.soundjay.com/misc/sounds/casino-ambience-1.mp3';
      
      // Fallback to a different source if first one fails
      backgroundMusicRef.current.onerror = () => {
        if (backgroundMusicRef.current) {
          backgroundMusicRef.current.src = 'https://www.zapsplat.com/wp-content/uploads/2015/sound-effects-one/zapsplat_multimedia_game_sound_bright_positive_win_001_24004.mp3';
        }
      };

      setCurrentTrack('background');
      await backgroundMusicRef.current.play();
      console.log('Background music started');
    } catch (error) {
      console.warn('Background music could not be played:', error);
      // Try with a simpler audio source
      try {
        if (backgroundMusicRef.current) {
          backgroundMusicRef.current.src = createSimpleBackgroundMusic();
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
      }
      
      // Use a ticking/spinning sound effect
      tickerSoundRef.current.src = 'https://www.soundjay.com/misc/sounds/slot-machine-1.mp3';
      
      // Fallback
      tickerSoundRef.current.onerror = () => {
        if (tickerSoundRef.current) {
          tickerSoundRef.current.src = createTickerSound();
        }
      };

      setCurrentTrack('ticker');
      await tickerSoundRef.current.play();
      console.log('Ticker sound started');
    } catch (error) {
      console.warn('Ticker sound could not be played:', error);
      // Fallback to generated sound
      try {
        if (tickerSoundRef.current) {
          tickerSoundRef.current.src = createTickerSound();
          await tickerSoundRef.current.play();
        }
      } catch (fallbackError) {
        console.warn('Fallback ticker sound also failed:', fallbackError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const playWinningSound = async () => {
    if (!isAudioEnabled || !winningSoundRef.current) return;

    try {
      setIsLoading(true);
      
      // Stop ticker sound
      if (tickerSoundRef.current) {
        tickerSoundRef.current.pause();
      }
      
      // Use a victory/winning sound effect
      winningSoundRef.current.src = 'https://www.soundjay.com/misc/sounds/victory-1.mp3';
      
      // Fallback
      winningSoundRef.current.onerror = () => {
        if (winningSoundRef.current) {
          winningSoundRef.current.src = createWinningSound();
        }
      };

      setCurrentTrack('winning');
      await winningSoundRef.current.play();
      console.log('Winning sound started');
    } catch (error) {
      console.warn('Winning sound could not be played:', error);
      // Fallback to generated sound
      try {
        if (winningSoundRef.current) {
          winningSoundRef.current.src = createWinningSound();
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

// Fallback: Create simple background music using Web Audio API
const createSimpleBackgroundMusic = (): string => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const sampleRate = audioContext.sampleRate;
    const duration = 8; // 8 seconds loop
    const numSamples = sampleRate * duration;
    
    const buffer = audioContext.createBuffer(2, numSamples, sampleRate);
    
    for (let channel = 0; channel < 2; channel++) {
      const channelData = buffer.getChannelData(channel);
      
      for (let i = 0; i < numSamples; i++) {
        const time = i / sampleRate;
        // Create upbeat casino-style music
        const bass = Math.sin(2 * Math.PI * 110 * time) * 0.3; // A2
        const melody = Math.sin(2 * Math.PI * 440 * time) * 0.2; // A4
        const harmony = Math.sin(2 * Math.PI * 660 * time) * 0.15; // E5
        const rhythm = Math.sin(2 * Math.PI * 2 * time) * 0.1; // 2Hz rhythm
        
        channelData[i] = (bass + melody + harmony) * (0.5 + rhythm) * 0.4;
      }
    }
    
    return bufferToWave(buffer);
  } catch (error) {
    console.warn('Could not create background music:', error);
    return '';
  }
};

// Create ticker/spinning sound
const createTickerSound = (): string => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const sampleRate = audioContext.sampleRate;
    const duration = 1; // 1 second loop
    const numSamples = sampleRate * duration;
    
    const buffer = audioContext.createBuffer(2, numSamples, sampleRate);
    
    for (let channel = 0; channel < 2; channel++) {
      const channelData = buffer.getChannelData(channel);
      
      for (let i = 0; i < numSamples; i++) {
        const time = i / sampleRate;
        // Create mechanical ticking sound
        const tick = Math.sin(2 * Math.PI * 1000 * time) * Math.exp(-time * 8);
        const click = Math.sin(2 * Math.PI * 2000 * time) * Math.exp(-time * 12);
        const noise = (Math.random() - 0.5) * 0.05;
        
        channelData[i] = (tick + click + noise) * 0.6;
      }
    }
    
    return bufferToWave(buffer);
  } catch (error) {
    console.warn('Could not create ticker sound:', error);
    return '';
  }
};

// Create winning celebration sound
const createWinningSound = (): string => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const sampleRate = audioContext.sampleRate;
    const duration = 4; // 4 seconds
    const numSamples = sampleRate * duration;
    
    const buffer = audioContext.createBuffer(2, numSamples, sampleRate);
    
    for (let channel = 0; channel < 2; channel++) {
      const channelData = buffer.getChannelData(channel);
      
      for (let i = 0; i < numSamples; i++) {
        const time = i / sampleRate;
        // Create triumphant fanfare
        const trumpet1 = Math.sin(2 * Math.PI * 523 * time) * 0.4; // C5
        const trumpet2 = Math.sin(2 * Math.PI * 659 * time) * 0.3; // E5
        const trumpet3 = Math.sin(2 * Math.PI * 784 * time) * 0.25; // G5
        const envelope = Math.max(0, 1 - time / duration);
        const celebration = Math.sin(2 * Math.PI * 1200 * time * (1 + time)) * 0.1;
        
        channelData[i] = (trumpet1 + trumpet2 + trumpet3 + celebration) * envelope * 0.7;
      }
    }
    
    return bufferToWave(buffer);
  } catch (error) {
    console.warn('Could not create winning sound:', error);
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