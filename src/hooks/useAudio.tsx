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

      // Cool electronic background music sources
      const musicSources = [
        'https://www.soundjay.com/misc/sounds/electronic-music-1.mp3',
        'https://freesound.org/data/previews/316/316738_5123451-lq.mp3',
        'https://www.zapsplat.com/wp-content/uploads/2015/sound-effects-one/zapsplat_music_electronic_ambient_loop_001.mp3'
      ];

      let sourceIndex = 0;
      const tryNextSource = () => {
        if (sourceIndex < musicSources.length && backgroundMusicRef.current) {
          backgroundMusicRef.current.src = musicSources[sourceIndex];
          sourceIndex++;
        } else if (backgroundMusicRef.current) {
          // Fallback to generated cool electronic music
          backgroundMusicRef.current.src = createCoolElectronicMusic();
        }
      };

      backgroundMusicRef.current.onerror = tryNextSource;
      tryNextSource();

      setCurrentTrack('background');
      await backgroundMusicRef.current.play();
      console.log('Cool electronic music started');
    } catch (error) {
      console.warn('Background music could not be played:', error);
      // Try with generated cool music
      try {
        if (backgroundMusicRef.current) {
          backgroundMusicRef.current.src = createCoolElectronicMusic();
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
      
      // Cool electronic ticker sounds
      const tickerSources = [
        'https://www.soundjay.com/misc/sounds/electronic-beep-1.mp3',
        'https://freesound.org/data/previews/270/270324_4388723-lq.mp3',
        'https://www.zapsplat.com/wp-content/uploads/2015/sound-effects-one/zapsplat_multimedia_game_sound_electronic_tension_001.mp3'
      ];

      let sourceIndex = 0;
      const tryNextSource = () => {
        if (sourceIndex < tickerSources.length && tickerSoundRef.current) {
          tickerSoundRef.current.src = tickerSources[sourceIndex];
          sourceIndex++;
        } else if (tickerSoundRef.current) {
          // Fallback to generated cool ticker
          tickerSoundRef.current.src = createCoolTickerSound();
        }
      };

      tickerSoundRef.current.onerror = tryNextSource;
      tryNextSource();

      setCurrentTrack('ticker');
      await tickerSoundRef.current.play();
      console.log('Cool ticker sound started');
    } catch (error) {
      console.warn('Ticker sound could not be played:', error);
      // Fallback to generated sound
      try {
        if (tickerSoundRef.current) {
          tickerSoundRef.current.src = createCoolTickerSound();
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
      
      // Cool electronic winning sounds
      const winningSources = [
        'https://www.soundjay.com/misc/sounds/electronic-victory-1.mp3',
        'https://freesound.org/data/previews/316/316847_5123451-lq.mp3',
        'https://www.zapsplat.com/wp-content/uploads/2015/sound-effects-one/zapsplat_multimedia_game_sound_electronic_win_001.mp3'
      ];

      let sourceIndex = 0;
      const tryNextSource = () => {
        if (sourceIndex < winningSources.length && winningSoundRef.current) {
          winningSoundRef.current.src = winningSources[sourceIndex];
          sourceIndex++;
        } else if (winningSoundRef.current) {
          // Fallback to generated cool victory
          winningSoundRef.current.src = createCoolVictorySound();
        }
      };

      winningSoundRef.current.onerror = tryNextSource;
      tryNextSource();

      setCurrentTrack('winning');
      await winningSoundRef.current.play();
      console.log('Cool victory sound started');
    } catch (error) {
      console.warn('Winning sound could not be played:', error);
      // Fallback to generated sound
      try {
        if (winningSoundRef.current) {
          winningSoundRef.current.src = createCoolVictorySound();
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

// Create cool electronic background music
const createCoolElectronicMusic = (): string => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const sampleRate = audioContext.sampleRate;
    const duration = 12; // 12 seconds loop
    const numSamples = sampleRate * duration;
    
    const buffer = audioContext.createBuffer(2, numSamples, sampleRate);
    
    for (let channel = 0; channel < 2; channel++) {
      const channelData = buffer.getChannelData(channel);
      
      for (let i = 0; i < numSamples; i++) {
        const time = i / sampleRate;
        
        // Create cool electronic ambient music
        const bass = Math.sin(2 * Math.PI * 55 * time) * 0.4; // Deep bass
        const lead = Math.sin(2 * Math.PI * 220 * time * (1 + 0.1 * Math.sin(2 * Math.PI * 0.5 * time))) * 0.3; // Modulated lead
        const pad = Math.sin(2 * Math.PI * 110 * time) * Math.sin(2 * Math.PI * 0.25 * time) * 0.2; // Ambient pad
        const arp = Math.sin(2 * Math.PI * 440 * time) * Math.sin(2 * Math.PI * 4 * time) * 0.15; // Arpeggiated synth
        
        // Add some electronic texture
        const noise = (Math.random() - 0.5) * 0.05;
        const filter = Math.sin(2 * Math.PI * 880 * time * (1 + 0.2 * Math.sin(2 * Math.PI * 0.1 * time))) * 0.1;
        
        // Combine for cool electronic sound
        channelData[i] = (bass + lead + pad + arp + noise + filter) * 0.6;
      }
    }
    
    return bufferToWave(buffer);
  } catch (error) {
    console.warn('Could not create cool electronic music:', error);
    return '';
  }
};

// Create cool electronic ticker sound
const createCoolTickerSound = (): string => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const sampleRate = audioContext.sampleRate;
    const duration = 1.2; // 1.2 second loop
    const numSamples = sampleRate * duration;
    
    const buffer = audioContext.createBuffer(2, numSamples, sampleRate);
    
    for (let channel = 0; channel < 2; channel++) {
      const channelData = buffer.getChannelData(channel);
      
      for (let i = 0; i < numSamples; i++) {
        const time = i / sampleRate;
        
        // Create cool electronic tension sound
        const tension = Math.sin(2 * Math.PI * 150 * time * (1 + time * 3)) * Math.exp(-time * 2) * 0.4;
        const beep = Math.sin(2 * Math.PI * 800 * time) * Math.exp(-time * 5) * 0.3;
        const sweep = Math.sin(2 * Math.PI * 400 * time * (1 + time * 2)) * 0.2;
        const digital = Math.sin(2 * Math.PI * 1600 * time) * Math.sin(2 * Math.PI * 20 * time) * 0.15;
        
        // Add electronic glitch effects
        const glitch = Math.sin(2 * Math.PI * 2400 * time) * Math.sin(2 * Math.PI * 50 * time) * 0.1;
        
        channelData[i] = (tension + beep + sweep + digital + glitch) * 0.8;
      }
    }
    
    return bufferToWave(buffer);
  } catch (error) {
    console.warn('Could not create cool ticker sound:', error);
    return '';
  }
};

// Create cool electronic victory sound
const createCoolVictorySound = (): string => {
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
        
        // Create cool electronic victory sound
        const lead = Math.sin(2 * Math.PI * 440 * time) * 0.4; // A4
        const harmony1 = Math.sin(2 * Math.PI * 554 * time) * 0.3; // C#5
        const harmony2 = Math.sin(2 * Math.PI * 659 * time) * 0.25; // E5
        const bass = Math.sin(2 * Math.PI * 110 * time) * 0.3; // A2
        
        // Add electronic effects
        const synth = Math.sin(2 * Math.PI * 880 * time * (1 + 0.1 * Math.sin(time * 10))) * 0.2;
        const digital = Math.sin(2 * Math.PI * 1760 * time) * Math.sin(2 * Math.PI * 8 * time) * 0.15;
        const sweep = Math.sin(2 * Math.PI * 220 * time * (1 + time)) * 0.1;
        
        // Envelope for natural progression
        const envelope = Math.max(0, 1 - time / duration) * (0.7 + 0.3 * Math.sin(2 * Math.PI * 4 * time));
        
        channelData[i] = (lead + harmony1 + harmony2 + bass + synth + digital + sweep) * envelope * 0.7;
      }
    }
    
    return bufferToWave(buffer);
  } catch (error) {
    console.warn('Could not create cool victory sound:', error);
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