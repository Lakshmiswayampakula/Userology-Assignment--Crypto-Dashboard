"use client";

import { createContext, useContext, useState, useEffect } from "react";

type SoundContextType = {
  playSound: () => void;
  toggleSound: () => void;
  isSoundEnabled: boolean;
};

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);

  useEffect(() => {
    const savedSoundPreference = localStorage.getItem("soundEnabled");
    if (savedSoundPreference !== null) {
      setIsSoundEnabled(savedSoundPreference === "true");
    }
  }, []);

  const toggleSound = () => {
    setIsSoundEnabled((prev) => {
      const newValue = !prev;
      localStorage.setItem("soundEnabled", String(newValue));
      return newValue;
    });
  };

  const playSound = () => {
    if (!isSoundEnabled) return;

    // Define the AudioContext type with proper type checking
    type AudioContextType = typeof AudioContext;
    type WebkitAudioContextType = {
      new (): AudioContext;
    };

    const AudioContextClass = (window.AudioContext || 
      (window as unknown as { webkitAudioContext: WebkitAudioContextType }).webkitAudioContext) as AudioContextType;
    
    const audioContext = new AudioContextClass();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1);
  };

  return (
    <SoundContext.Provider value={{ playSound, toggleSound, isSoundEnabled }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error("useSound must be used within a SoundProvider");
  }
  return context;
} 