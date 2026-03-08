"use client";

import React from "react";
import { useAudio } from "./AudioProvider";
import { Volume2, VolumeX } from "lucide-react";

export default function MusicToggleButton() {
  const { isPlaying, togglePlay } = useAudio();

  return (
    <button
      onClick={togglePlay}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        background: isPlaying ? "rgba(255, 255, 255, 0.1)" : "rgba(239, 68, 68, 0.1)",
        border: isPlaying ? "1px solid rgba(255, 255, 255, 0.2)" : "1px solid rgba(239, 68, 68, 0.3)",
        color: isPlaying ? "#F9FAFB" : "#EF4444",
        cursor: "pointer",
        transition: "all 0.2s ease",
      }}
      title={isPlaying ? "Mute Music" : "Play Music"}
      onMouseEnter={(e) => {
        if (isPlaying) {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
        } else {
          e.currentTarget.style.background = "rgba(239, 68, 68, 0.15)";
        }
      }}
      onMouseLeave={(e) => {
        if (isPlaying) {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
        } else {
          e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)";
        }
      }}
    >
      {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
    </button>
  );
}
