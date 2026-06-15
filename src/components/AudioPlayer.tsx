import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, Volume2, VolumeX, Music } from "lucide-react";

interface AudioPlayerProps {
  title: string;
  artist: string;
  melodyType: string;
  customAudioUrl?: string;
  forcePlayTrigger?: boolean;
}

export default function AudioPlayer({ title, artist, customAudioUrl, forcePlayTrigger }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const [isMuted, setIsMuted] = useState(false);
  const [visualBars, setVisualBars] = useState<number[]>(new Array(24).fill(4));

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize or update custom audio element
  useEffect(() => {
    if (customAudioUrl) {
      if (!audioRef.current) {
        audioRef.current = new Audio(customAudioUrl);
        audioRef.current.loop = true;
      } else if (audioRef.current.src !== customAudioUrl) {
        audioRef.current.pause();
        audioRef.current = new Audio(customAudioUrl);
        audioRef.current.loop = true;
      }
      
      const targetVol = isMuted ? 0 : volume;
      audioRef.current.volume = targetVol;
      
      if (isPlaying) {
        audioRef.current.play().catch(e => console.warn("Buffered playback error:", e));
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [customAudioUrl]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => {
        console.warn("Autoplay blocked:", e);
        setIsPlaying(false);
      });
    } else if (!isPlaying && audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Handle force play
  useEffect(() => {
    if (forcePlayTrigger) {
      setIsPlaying(true);
    }
  }, [forcePlayTrigger]);

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Subtle natural bar decaying animation
  useEffect(() => {
    if (!isPlaying) {
      setVisualBars(new Array(24).fill(4));
      return;
    }
    
    let animFrame: number;
    let customTimer: any;
    
    const decay = () => {
      setVisualBars(prev => prev.map(bar => Math.max(3, bar - 0.45)));
      animFrame = requestAnimationFrame(decay);
    };
    animFrame = requestAnimationFrame(decay);

    if (customAudioUrl) {
      customTimer = window.setInterval(() => {
        setVisualBars(prev => {
          const next = [...prev];
          const numJumps = Math.floor(Math.random() * 6) + 4;
          for (let i = 0; i < numJumps; i++) {
            const idx = Math.floor(Math.random() * next.length);
            next[idx] = Math.floor(Math.random() * 22) + 6;
          }
          return next;
        });
      }, 140);
    }

    return () => {
      cancelAnimationFrame(animFrame);
      if (customTimer) window.clearInterval(customTimer);
    };
  }, [isPlaying, customAudioUrl]);

  const togglePlayback = () => {
    if (!customAudioUrl && !isPlaying) {
        alert("Sila muat naik/upload fail MP3 kustom anda dari Admin Panel dahulu.");
        return;
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div 
      id="custom-audio-player-card"
      className="bg-cream-card/90 border border-cream-border rounded-2xl p-4 shadow-sm flex flex-col gap-3 w-full max-w-sm sm:max-w-md backdrop-blur-sm relative"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-full ${isPlaying ? "bg-terracotta/20 text-terracotta" : "bg-chocolate/5 text-chocolate"} transition-all duration-500`}>
            <Music className={`w-5 h-5 ${isPlaying ? "animate-spin-slow" : ""}`} />
          </div>
          <div>
            <span className="text-[10px] uppercase font-sans tracking-widest text-chocolate/50 font-semibold block">Now Playing</span>
            <span className="font-serif font-semibold text-chocolate text-[15px] block line-clamp-1">{title}</span>
            <span className="text-xs font-sans text-chocolate/70 font-semibold italic block">{artist}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isPlaying && customAudioUrl && (
            <span className="font-serif text-[11px] bg-terracotta/10 text-terracotta px-2 py-0.5 rounded-full font-bold animate-pulse" style={{ animationDelay: "1s"}}>
              Audio Active
            </span>
          )}
          {!customAudioUrl && (
             <span className="font-serif text-[11px] bg-chocolate/10 text-chocolate px-2 py-0.5 rounded-full font-bold">
               No Audio
             </span>
          )}
          
          <button 
            id="audio-controls-play-pause-btn"
            onClick={togglePlayback}
            disabled={!customAudioUrl}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-md active:scale-95 cursor-pointer ${
              customAudioUrl ? "bg-chocolate text-cream-bg hover:bg-terracotta hover:scale-105" : "bg-chocolate/30 text-cream-bg/50 cursor-not-allowed"
            }`}
            title={isPlaying ? "Pause music" : "Play music"}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current translate-x-0.5" />
            )}
          </button>
        </div>
      </div>

      <div className="h-10 bg-cream-bg/50 border border-cream-border/50 rounded-lg flex items-end justify-between px-3 py-1.5 overflow-hidden">
        {visualBars.map((barHeight, idx) => (
          <div
            key={idx}
            className="w-1.5 rounded-t-full transition-all duration-100 ease-out"
            style={{ 
              height: `${(barHeight / 30) * 100}%`,
              backgroundColor: isPlaying 
                ? idx % 3 === 0 
                  ? "#C27461" 
                  : idx % 2 === 0 
                    ? "#C0982E" 
                    : "#E4D5B9" 
                : "#DFD7C0" 
            }}
          />
        ))}
      </div>

      <div className="flex items-center justify-between gap-3 px-1 text-xs">
        <button 
          id="audio-controls-mute-btn"
          onClick={toggleMute}
          disabled={!customAudioUrl}
          className={`transition-colors ${customAudioUrl ? "text-chocolate/60 hover:text-chocolate" : "text-chocolate/30 cursor-not-allowed"}`}
        >
          {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
        
        <input 
          id="audio-controls-volume-slider"
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={(e) => {
            setVolume(parseFloat(e.target.value));
            if (isMuted) setIsMuted(false);
          }}
          disabled={!customAudioUrl}
          className={`flex-1 h-1 bg-cream-border rounded-lg ${customAudioUrl ? "accent-chocolate cursor-pointer" : "opacity-30 cursor-not-allowed"}`}
        />
        
        <span className="font-sans text-[10px] text-chocolate/50 font-bold uppercase tracking-wider">
          Custom MP3 Output
        </span>
      </div>
    </div>
  );
}
