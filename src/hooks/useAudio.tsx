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

      // Vibrant, playful background music sources
      const musicSources = [
        'https://www.soundjay.com/misc/sounds/carnival-music-1.mp3',
        'https://freesound.org/data/previews/316/316847_5123451-lq.mp3',
        'https://www.zapsplat.com/wp-content/uploads/2015/sound-effects-one/zapsplat_multimedia_game_sound_fun_playful_001.mp3'
      ];

      let sourceIndex = 0;
      const tryNextSource = () => {
        if (sourceIndex < musicSources.length && backgroundMusicRef.current) {
          backgroundMusicRef.current.src = musicSources[sourceIndex];
          sourceIndex++;
        } else if (backgroundMusicRef.current) {
          // Fallback to generated playful music
          backgroundMusicRef.current.src = createPlayfulBackgroundMusic();
        }
      };

      backgroundMusicRef.current.onerror = tryNextSource;
      tryNextSource();

      setCurrentTrack('background');
      await backgroundMusicRef.current.play();
      console.log('Playful background music started');
    } catch (error) {
      console.warn('Background music could not be played:', error);
      // Try with generated playful music
      try {
        if (backgroundMusicRef.current) {
          backgroundMusicRef.current.src = createPlayfulBackgroundMusic();
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
      
      // Vibrant, exciting ticker sounds
      const tickerSources = [
        'https://www.soundjay.com/misc/sounds/game-show-buzzer-1.mp3',
        'https://freesound.org/data/previews/270/270324_4388723-lq.mp3',
        'https://www.zapsplat.com/wp-content/uploads/2015/sound-effects-one/zapsplat_multimedia_game_sound_spinning_wheel_001.mp3'
      ];

      let sourceIndex = 0;
      const tryNextSource = () => {
        if (sourceIndex < tickerSources.length && tickerSoundRef.current) {
          tickerSoundRef.current.src = tickerSources[sourceIndex];
          sourceIndex++;
        } else if (tickerSoundRef.current) {
          // Fallback to generated exciting ticker
          tickerSoundRef.current.src = createExcitingTickerSound();
        }
      };

      tickerSoundRef.current.onerror = tryNextSource;
      tryNextSource();

      setCurrentTrack('ticker');
      await tickerSoundRef.current.play();
      console.log('Exciting ticker sound started');
    } catch (error) {
      console.warn('Ticker sound could not be played:', error);
      // Fallback to generated sound
      try {
        if (tickerSoundRef.current) {
          tickerSoundRef.current.src = createExcitingTickerSound();
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
      
      // Vibrant, celebratory winning sounds
      const winningSources = [
        'https://www.soundjay.com/misc/sounds/ta-da-1.mp3',
        'https://freesound.org/data/previews/316/316847_5123451-lq.mp3',
        'https://www.zapsplat.com/wp-content/uploads/2015/sound-effects-one/zapsplat_multimedia_game_sound_win_celebration_001.mp3'
      ];

      let sourceIndex = 0;
      const tryNextSource = () => {
        if (sourceIndex < winningSources.length && winningSoundRef.current) {
          winningSoundRef.current.src = winningSources[sourceIndex];
          sourceIndex++;
        } else if (winningSoundRef.current) {
          // Fallback to generated celebration
          winningSoundRef.current.src = createCelebrationSound();
        }
      };

      winningSoundRef.current.onerror = tryNextSource;
      tryNextSource();

      setCurrentTrack('winning');
      await winningSoundRef.current.play();
      console.log('Celebration sound started');
    } catch (error) {
      console.warn('Winning sound could not be played:', error);
      // Fallback to generated sound
      try {
        if (winningSoundRef.current) {
          winningSoundRef.current.src = createCelebrationSound();
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

// Create vibrant, playful background music
const createPlayfulBackgroundMusic = (): string => {
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
        
        // Create bouncy, carnival-like music
        const melody1 = Math.sin(2 * Math.PI * 523 * time) * 0.3; // C5
        const melody2 = Math.sin(2 * Math.PI * 659 * time) * 0.25; // E5
        const melody3 = Math.sin(2 * Math.PI * 784 * time) * 0.2; // G5
        const bass = Math.sin(2 * Math.PI * 131 * time) * 0.4; // C3
        
        // Add bouncy rhythm
        const bounce = Math.sin(2 * Math.PI * 4 * time) * 0.15;
        const sparkle = Math.sin(2 * Math.PI * 1047 * time) * Math.sin(2 * Math.PI * 0.5 * time) * 0.1;
        
        // Combine for playful sound
        channelData[i] = (melody1 + melody2 + melody3 + bass + bounce + sparkle) * 0.5;
      }
    }
    
    return bufferToWave(buffer);
  } catch (error) {
    console.warn('Could not create playful background music:', error);
    return '';
  }
};

// Create exciting, vibrant ticker sound
const createExcitingTickerSound = (): string => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const sampleRate = audioContext.sampleRate;
    const duration = 0.8; // 0.8 second loop
    const numSamples = sampleRate * duration;
    
    const buffer = audioContext.createBuffer(2, numSamples, sampleRate);
    
    for (let channel = 0; channel < 2; channel++) {
      const channelData = buffer.getChannelData(channel);
      
      for (let i = 0; i < numSamples; i++) {
        const time = i / sampleRate;
        
        // Create exciting spinning wheel sound
        const spin = Math.sin(2 * Math.PI * 800 * time) * Math.exp(-time * 3) * 0.4;
        const click = Math.sin(2 * Math.PI * 1200 * time) * Math.exp(-time * 8) * 0.3;
        const whoosh = Math.sin(2 * Math.PI * 200 * time * (1 + time * 2)) * 0.2;
        const excitement = Math.sin(2 * Math.PI * 1600 * time) * Math.sin(2 * Math.PI * 10 * time) * 0.15;
        
        channelData[i] = (spin + click + whoosh + excitement) * 0.8;
      }
    }
    
    return bufferToWave(buffer);
  } catch (error) {
    console.warn('Could not create exciting ticker sound:', error);
    return '';
  }
};

// Create vibrant celebration sound
const createCelebrationSound = (): string => {
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
        
        // Create joyful celebration fanfare
        const fanfare1 = Math.sin(2 * Math.PI * 523 * time) * 0.4; // C5
        const fanfare2 = Math.sin(2 * Math.PI * 659 * time) * 0.35; // E5
        const fanfare3 = Math.sin(2 * Math.PI * 784 * time) * 0.3; // G5
        const fanfare4 = Math.sin(2 * Math.PI * 1047 * time) * 0.25; // C6
        
        // Add sparkly effects
        const sparkles = Math.sin(2 * Math.PI * 2093 * time * (1 + Math.sin(time * 8))) * 0.2;
        const chimes = Math.sin(2 * Math.PI * 1568 * time) * Math.sin(2 * Math.PI * 3 * time) * 0.15;
        
        // Envelope for natural fade
        const envelope = Math.max(0, 1 - time / duration) * (0.8 + 0.2 * Math.sin(2 * Math.PI * 6 * time));
        
        channelData[i] = (fanfare1 + fanfare2 + fanfare3 + fanfare4 + sparkles + chimes) * envelope * 0.8;
      }
    }
    
    return bufferToWave(buffer);
  } catch (error) {
    console.warn('Could not create celebration sound:', error);
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