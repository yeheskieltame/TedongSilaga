"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";

interface AudioContextType {
  isPlaying: boolean;
  togglePlay: () => void;
}

const AudioContext = createContext<AudioContextType>({
  isPlaying: false,
  togglePlay: () => {},
});

export const useAudio = () => useContext(AudioContext);

export default function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const userInteracted = useRef(false);
  const explicitMute = useRef(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    // Attempt autopay, which is often blocked by browsers
    audio.play().then(() => {
      setIsPlaying(true);
    }).catch((err) => {
      console.log("Autoplay blocked, waiting for user interaction:", err);
      setIsPlaying(false);
    });

    const handleInteraction = () => {
      if (!userInteracted.current && audio) {
        userInteracted.current = true;
        // Only start if we are not explicitly paused by a user toggle
        if (!explicitMute.current && audio.paused) {
          audio.play().then(() => {
            setIsPlaying(true);
          }).catch(console.error);
        }
      }
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("keydown", handleInteraction);
    };

    document.addEventListener("click", handleInteraction);
    document.addEventListener("keydown", handleInteraction);

    return () => {
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("keydown", handleInteraction);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
        explicitMute.current = true;
      } else {
        audio.play().then(() => {
          setIsPlaying(true);
          explicitMute.current = false;
        }).catch(console.error);
      }
    }
  };

  return (
    <AudioContext.Provider value={{ isPlaying, togglePlay }}>
      <audio ref={audioRef} src="/song.mp3" loop />
      {children}
    </AudioContext.Provider>
  );
}
