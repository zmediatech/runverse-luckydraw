import { useEffect, useRef, useState } from 'react';

export const useAudio = () => {
  const backgroundMusicRef = useRef<HTMLAudioElement | null>(null);
  const tickerSoundRef = useRef<HTMLAudioElement | null>(null);
  const winningSoundRef = useRef<HTMLAudioElement | null>(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);

  useEffect(() => {
    // Initialize audio elements
    backgroundMusicRef.current = new Audio();
    tickerSoundRef.current = new Audio();
    winningSoundRef.current = new Audio();

    // Set audio properties
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.loop = true;
      backgroundMusicRef.current.volume = 0.3;
    }
    
    if (tickerSoundRef.current) {
      tickerSoundRef.current.loop = true;
      tickerSoundRef.current.volume = 0.4;
    }
    
    if (winningSoundRef.current) {
      winningSoundRef.current.loop = false;
      winningSoundRef.current.volume = 0.6;
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
      // Create a silent audio context to enable audio
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      await audioContext.resume();
      setIsAudioEnabled(true);
      return true;
    } catch (error) {
      console.warn('Audio could not be enabled:', error);
      return false;
    }
  };

  const playBackgroundMusic = async () => {
    if (!isAudioEnabled || !backgroundMusicRef.current) return;

    try {
      // Use a royalty-free background music URL or create a simple tone
      backgroundMusicRef.current.src = createBackgroundMusicDataURL();
      setCurrentTrack('background');
      await backgroundMusicRef.current.play();
    } catch (error) {
      console.warn('Background music could not be played:', error);
    }
  };

  const playTickerSound = async () => {
    if (!isAudioEnabled || !tickerSoundRef.current) return;

    try {
      // Stop background music
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.pause();
      }
      
      // Play ticker sound
      tickerSoundRef.current.src = createTickerSoundDataURL();
      setCurrentTrack('ticker');
      await tickerSoundRef.current.play();
    } catch (error) {
      console.warn('Ticker sound could not be played:', error);
    }
  };

  const playWinningSound = async () => {
    if (!isAudioEnabled || !winningSoundRef.current) return;

    try {
      // Stop ticker sound
      if (tickerSoundRef.current) {
        tickerSoundRef.current.pause();
      }
      
      // Play winning sound
      winningSoundRef.current.src = createWinningSoundDataURL();
      setCurrentTrack('winning');
      await winningSoundRef.current.play();
    } catch (error) {
      console.warn('Winning sound could not be played:', error);
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
    enableAudio,
    playBackgroundMusic,
    playTickerSound,
    playWinningSound,
    stopAllAudio,
    toggleMute
  };
};

// Create background music using Web Audio API
const createBackgroundMusicDataURL = (): string => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const sampleRate = audioContext.sampleRate;
  const duration = 10; // 10 seconds loop
  const numSamples = sampleRate * duration;
  
  const buffer = audioContext.createBuffer(2, numSamples, sampleRate);
  
  for (let channel = 0; channel < 2; channel++) {
    const channelData = buffer.getChannelData(channel);
    
    for (let i = 0; i < numSamples; i++) {
      const time = i / sampleRate;
      // Create a pleasant ambient background music
      const note1 = Math.sin(2 * Math.PI * 220 * time) * 0.1; // A3
      const note2 = Math.sin(2 * Math.PI * 330 * time) * 0.08; // E4
      const note3 = Math.sin(2 * Math.PI * 440 * time) * 0.06; // A4
      const envelope = Math.sin(2 * Math.PI * 0.1 * time) * 0.5 + 0.5;
      
      channelData[i] = (note1 + note2 + note3) * envelope * 0.3;
    }
  }
  
  return bufferToWave(buffer);
};

// Create ticker/spinning sound
const createTickerSoundDataURL = (): string => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const sampleRate = audioContext.sampleRate;
  const duration = 2; // 2 seconds loop
  const numSamples = sampleRate * duration;
  
  const buffer = audioContext.createBuffer(2, numSamples, sampleRate);
  
  for (let channel = 0; channel < 2; channel++) {
    const channelData = buffer.getChannelData(channel);
    
    for (let i = 0; i < numSamples; i++) {
      const time = i / sampleRate;
      // Create a ticking/spinning sound with increasing tension
      const tick = Math.sin(2 * Math.PI * 800 * time) * Math.exp(-time * 5);
      const tension = Math.sin(2 * Math.PI * 200 * time) * 0.3;
      const noise = (Math.random() - 0.5) * 0.1;
      
      channelData[i] = (tick + tension + noise) * 0.4;
    }
  }
  
  return bufferToWave(buffer);
};

// Create winning celebration sound
const createWinningSoundDataURL = (): string => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const sampleRate = audioContext.sampleRate;
  const duration = 3; // 3 seconds
  const numSamples = sampleRate * duration;
  
  const buffer = audioContext.createBuffer(2, numSamples, sampleRate);
  
  for (let channel = 0; channel < 2; channel++) {
    const channelData = buffer.getChannelData(channel);
    
    for (let i = 0; i < numSamples; i++) {
      const time = i / sampleRate;
      // Create a triumphant winning sound
      const fanfare1 = Math.sin(2 * Math.PI * 523 * time) * 0.3; // C5
      const fanfare2 = Math.sin(2 * Math.PI * 659 * time) * 0.25; // E5
      const fanfare3 = Math.sin(2 * Math.PI * 784 * time) * 0.2; // G5
      const envelope = Math.max(0, 1 - time / duration);
      const celebration = Math.sin(2 * Math.PI * 1000 * time * time) * 0.1;
      
      channelData[i] = (fanfare1 + fanfare2 + fanfare3 + celebration) * envelope * 0.5;
    }
  }
  
  return bufferToWave(buffer);
};

// Convert AudioBuffer to WAV data URL
const bufferToWave = (buffer: AudioBuffer): string => {
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
};