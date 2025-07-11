import { useEffect, useRef, useState, useCallback } from 'react';

export const useAudio = () => {
  const backgroundMusicRef = useRef<HTMLAudioElement | null>(null);
  const tickerSoundRef = useRef<HTMLAudioElement | null>(null);
  const winningSoundRef = useRef<HTMLAudioElement | null>(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Create optimized audio functions with useCallback to prevent re-renders
  const enableAudio = useCallback(async () => {
    try {
      setIsAudioEnabled(true);
      await playBackgroundMusic();
      return true;
    } catch (error) {
      console.warn('Audio could not be enabled:', error);
      return false;
    }
  }, []);

  const disableAudio = useCallback(() => {
    setIsAudioEnabled(false);
    stopAllAudio();
  }, []);

  const playBackgroundMusic = useCallback(async () => {
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

      // Use generated background music for better performance
      backgroundMusicRef.current.src = createBackgroundMusic();
      setCurrentTrack('background');
      backgroundMusicRef.current.currentTime = 0;
      await backgroundMusicRef.current.play();
    } catch (error) {
      console.warn('Background music could not be played:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isAudioEnabled]);

  const playTickerSound = useCallback(async () => {
    if (!isAudioEnabled || !tickerSoundRef.current) return;

    try {
      setIsLoading(true);
      
      // Stop background music
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.pause();
        backgroundMusicRef.current.currentTime = 0;
      }
      
      // Use generated ticker music for better performance
      tickerSoundRef.current.src = createTickerMusic();
      setCurrentTrack('spinning');
      tickerSoundRef.current.currentTime = 0;
      tickerSoundRef.current.loop = true;
      await tickerSoundRef.current.play();
    } catch (error) {
      console.warn('Ticker music could not be played:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isAudioEnabled]);

  const playWinningSound = useCallback(async () => {
    if (!isAudioEnabled || !winningSoundRef.current) return;

    try {
      setIsLoading(true);
      
      // Stop ticker music
      if (tickerSoundRef.current) {
        tickerSoundRef.current.pause();
        tickerSoundRef.current.currentTime = 0;
      }
      
      // Use generated winning sound for better performance
      winningSoundRef.current.src = createWinningSound();
      winningSoundRef.current.currentTime = 0;
      winningSoundRef.current.loop = false;

      setCurrentTrack('winning');
      await winningSoundRef.current.play();
      
      // Clear current track when sound ends
      winningSoundRef.current.onended = () => {
        setCurrentTrack(null);
        // Auto-start background music after winning sound
        setTimeout(() => {
          playBackgroundMusic();
        }, 500);
      };
    } catch (error) {
      console.warn('Winning sound could not be played:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isAudioEnabled, playBackgroundMusic]);

  const stopAllAudio = useCallback(() => {
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
  }, []);

  const toggleMute = useCallback(() => {
    if (isAudioEnabled) {
      disableAudio();
    } else {
      enableAudio();
    }
  }, [isAudioEnabled, enableAudio, disableAudio]);

  useEffect(() => {
    // Initialize audio elements with optimized settings
    backgroundMusicRef.current = new Audio();
    tickerSoundRef.current = new Audio();
    winningSoundRef.current = new Audio();

    // Set audio properties for better performance
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.loop = true;
      backgroundMusicRef.current.volume = 0.3;
      backgroundMusicRef.current.preload = 'none'; // Don't preload for better performance
    }
    
    if (tickerSoundRef.current) {
      tickerSoundRef.current.loop = true;
      tickerSoundRef.current.volume = 0.4;
      tickerSoundRef.current.preload = 'none';
    }
    
    if (winningSoundRef.current) {
      winningSoundRef.current.loop = false;
      winningSoundRef.current.volume = 0.6;
      winningSoundRef.current.preload = 'none';
    }

    // Auto-start background music with delay for better UX
    const startAutoMusic = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        await playBackgroundMusic();
      } catch (error) {
        console.log('Auto-play prevented by browser');
      }
    };
    
    startAutoMusic();

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
  }, [playBackgroundMusic]);

  return {
    isAudioEnabled,
    currentTrack,
    isLoading,
    enableAudio,
    disableAudio,
    playBackgroundMusic,
    playTickerSound,
    playWinningSound,
    stopAllAudio,
    toggleMute
  };
};

// Optimized audio generation functions
const createBackgroundMusic = (): string => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const sampleRate = audioContext.sampleRate;
    const duration = 8; // Shorter duration for better performance
    const numSamples = sampleRate * duration;
    
    const buffer = audioContext.createBuffer(1, numSamples, sampleRate); // Mono for better performance
    const channelData = buffer.getChannelData(0);
    
    for (let i = 0; i < numSamples; i++) {
      const time = i / sampleRate;
      
      // Optimized background music
      const melody = Math.sin(2 * Math.PI * 261.63 * time) * 0.3;
      const harmony = Math.sin(2 * Math.PI * 329.63 * time) * 0.2;
      const bass = Math.sin(2 * Math.PI * 130.81 * time) * 0.3;
      
      channelData[i] = (melody + harmony + bass) * 0.5;
    }
    
    return bufferToWave(buffer);
  } catch (error) {
    console.warn('Could not create background music:', error);
    return '';
  }
};

const createTickerMusic = (): string => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const sampleRate = audioContext.sampleRate;
    const duration = 3; // Shorter loop for better performance
    const numSamples = sampleRate * duration;
    
    const buffer = audioContext.createBuffer(1, numSamples, sampleRate);
    const channelData = buffer.getChannelData(0);
    
    for (let i = 0; i < numSamples; i++) {
      const time = i / sampleRate;
      
      // Exciting ticker music
      const melody = Math.sin(2 * Math.PI * 523.25 * time) * 0.4;
      const rhythm = Math.sin(2 * Math.PI * 1046.5 * time) * Math.sin(2 * Math.PI * 8 * time) * 0.3;
      const excitement = Math.sin(2 * Math.PI * 1760 * time) * Math.sin(2 * Math.PI * 4 * time) * 0.2;
      
      channelData[i] = (melody + rhythm + excitement) * 0.6;
    }
    
    return bufferToWave(buffer);
  } catch (error) {
    console.warn('Could not create ticker music:', error);
    return '';
  }
};

const createWinningSound = (): string => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const sampleRate = audioContext.sampleRate;
    const duration = 3; // Shorter winning sound
    const numSamples = sampleRate * duration;
    
    const buffer = audioContext.createBuffer(1, numSamples, sampleRate);
    const channelData = buffer.getChannelData(0);
    
    for (let i = 0; i < numSamples; i++) {
      const time = i / sampleRate;
      
      // Victory fanfare
      const fanfare = Math.sin(2 * Math.PI * 523.25 * time) * 0.5;
      const harmony = Math.sin(2 * Math.PI * 659.25 * time) * 0.4;
      const celebration = Math.sin(2 * Math.PI * 1046.5 * time) * Math.sin(2 * Math.PI * 2 * time) * 0.3;
      
      // Fade out envelope
      const envelope = Math.max(0, 1 - (time / duration) * 0.5);
      
      channelData[i] = (fanfare + harmony + celebration) * envelope * 0.7;
    }
    
    return bufferToWave(buffer);
  } catch (error) {
    console.warn('Could not create winning sound:', error);
    return '';
  }
};

// Optimized buffer to wave conversion
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