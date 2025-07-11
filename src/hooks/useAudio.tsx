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
      }
      
      // Ticker spin sound sources
      const tickerSources = [
        'https://www.soundjay.com/misc/sounds/slot-machine-spin.mp3',
        'https://freesound.org/data/previews/270/270324_4388723-lq.mp3',
        'https://www.zapsplat.com/wp-content/uploads/2015/sound-effects-one/zapsplat_slot_machine_spin_001.mp3'
      ];

      let sourceIndex = 0;
      const tryNextSource = () => {
        if (sourceIndex < tickerSources.length && tickerSoundRef.current) {
          tickerSoundRef.current.src = tickerSources[sourceIndex];
          sourceIndex++;
        } else if (tickerSoundRef.current) {
          // Fallback to generated ticker sound
          tickerSoundRef.current.src = createTickerSpinSound();
        }
      };

      tickerSoundRef.current.onerror = tryNextSource;
      tryNextSource();

      setCurrentTrack('ticker');
      await tickerSoundRef.current.play();
      console.log('Ticker spin sound started');
    } catch (error) {
      console.warn('Ticker sound could not be played:', error);
      // Fallback to generated sound
      try {
        if (tickerSoundRef.current) {
          tickerSoundRef.current.src = createTickerSpinSound();
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
      
      // Congratulations sound sources
      const winningSources = [
        'https://www.soundjay.com/misc/sounds/congratulations-1.mp3',
        'https://freesound.org/data/previews/316/316847_5123451-lq.mp3',
        'https://www.zapsplat.com/wp-content/uploads/2015/sound-effects-one/zapsplat_congratulations_001.mp3'
      ];

      let sourceIndex = 0;
      const tryNextSource = () => {
        if (sourceIndex < winningSources.length && winningSoundRef.current) {
          winningSoundRef.current.src = winningSources[sourceIndex];
          sourceIndex++;
        } else if (winningSoundRef.current) {
          // Fallback to generated congratulations sound
          winningSoundRef.current.src = createCongratsSound();
        }
      };

      winningSoundRef.current.onerror = tryNextSource;
      tryNextSource();

      setCurrentTrack('winning');
      await winningSoundRef.current.play();
      console.log('Congratulations sound started');
    } catch (error) {
      console.warn('Winning sound could not be played:', error);
      // Fallback to generated sound
      try {
        if (winningSoundRef.current) {
          winningSoundRef.current.src = createCongratsSound();
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

// Create ticker spin sound
const createTickerSpinSound = (): string => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const sampleRate = audioContext.sampleRate;
    const duration = 1.5; // 1.5 second loop
    const numSamples = sampleRate * duration;
    
    const buffer = audioContext.createBuffer(2, numSamples, sampleRate);
    
    for (let channel = 0; channel < 2; channel++) {
      const channelData = buffer.getChannelData(channel);
      
      for (let i = 0; i < numSamples; i++) {
        const time = i / sampleRate;
        
        // Create ticker spin sound
        const tick = Math.sin(2 * Math.PI * 800 * time) * Math.exp(-time * 3) * 0.5;
        const spin = Math.sin(2 * Math.PI * 200 * time * (1 + time)) * 0.3;
        const whoosh = Math.sin(2 * Math.PI * 100 * time) * Math.sin(2 * Math.PI * 10 * time) * 0.2;
        
        // Add mechanical clicking
        const click = Math.sin(2 * Math.PI * 1200 * time) * Math.sin(2 * Math.PI * 15 * time) * 0.15;
        
        channelData[i] = (tick + spin + whoosh + click) * 0.8;
      }
    }
    
    return bufferToWave(buffer);
  } catch (error) {
    console.warn('Could not create ticker sound:', error);
    return '';
  }
};

// Create congratulations sound
const createCongratsSound = (): string => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const sampleRate = audioContext.sampleRate;
    const duration = 3; // 3 seconds
    const numSamples = sampleRate * duration;
    
    const buffer = audioContext.createBuffer(2, numSamples, sampleRate);
    
    for (let channel = 0; channel < 2; channel++) {
      const channelData = buffer.getChannelData(channel);
      
      for (let i = 0; i < numSamples; i++) {
        const time = i / sampleRate;
        
        // Create congratulations fanfare
        const trumpet1 = Math.sin(2 * Math.PI * 523.25 * time) * 0.4; // C5
        const trumpet2 = Math.sin(2 * Math.PI * 659.25 * time) * 0.3; // E5
        const trumpet3 = Math.sin(2 * Math.PI * 783.99 * time) * 0.25; // G5
        
        // Add celebration effects
        const chimes = Math.sin(2 * Math.PI * 1046.5 * time) * Math.sin(2 * Math.PI * 4 * time) * 0.2;
        const applause = (Math.random() - 0.5) * 0.1 * Math.sin(2 * Math.PI * 2 * time);
        
        // Envelope for natural progression
        const envelope = Math.max(0, 1 - time / duration) * (0.8 + 0.2 * Math.sin(2 * Math.PI * 3 * time));
        
        channelData[i] = (trumpet1 + trumpet2 + trumpet3 + chimes + applause) * envelope * 0.7;
      }
    }
    
    return bufferToWave(buffer);
  } catch (error) {
    console.warn('Could not create congratulations sound:', error);
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