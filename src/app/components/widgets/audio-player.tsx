"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, Music } from "lucide-react";
import { cn } from "@/lib/utils";

type AudioTrack = {
  id: string;
  name: string;
  artist: string;
  duration: string;
  url: string; // Direct link to .mp3 or .wav file (GDrive, cloud, etc.)
};

type AudioPlayerProps = {
  mini?: boolean;
  tracks?: AudioTrack[];
  title?: string;
};

// Default tracks - replace with your own cloud-hosted audio files
// For Google Drive: Use format https://drive.google.com/uc?export=download&id=FILE_ID
const DEFAULT_TRACKS: AudioTrack[] = [
  {
    id: "1",
    name: "Lofi Study Beat",
    artist: "Background Music",
    duration: "3:00",
    url: "", // Add your GDrive/cloud link here
  },
  {
    id: "2", 
    name: "Chill Vibes",
    artist: "Ambient",
    duration: "2:30",
    url: "", // Add your GDrive/cloud link here
  },
  {
    id: "3",
    name: "Focus Mode",
    artist: "Instrumental",
    duration: "4:15",
    url: "", // Add your GDrive/cloud link here
  },
];

export default function AudioPlayer({ 
  mini = false, 
  tracks = DEFAULT_TRACKS,
  title = "Music Player"
}: AudioPlayerProps) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasValidTracks, setHasValidTracks] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Check if we have valid tracks with URLs
  useEffect(() => {
    const validTracks = tracks.filter(t => t.url && t.url.trim() !== "");
    setHasValidTracks(validTracks.length > 0);
    
    // Find first valid track
    if (validTracks.length > 0) {
      const firstValidIndex = tracks.findIndex(t => t.url && t.url.trim() !== "");
      if (firstValidIndex !== -1) {
        setCurrentTrackIndex(firstValidIndex);
      }
    }
  }, [tracks]);

  const currentTrack = tracks[currentTrackIndex];

  // Update audio source when track changes
  useEffect(() => {
    if (audioRef.current && currentTrack?.url) {
      audioRef.current.src = currentTrack.url;
      audioRef.current.load();
      setIsLoaded(false);
    }
  }, [currentTrackIndex, currentTrack?.url]);

  // Update volume/mute when they change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  const handlePlayPause = useCallback(() => {
    if (!currentTrack?.url) return;

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.volume = volume;
        audioRef.current.muted = isMuted;
        audioRef.current.play().catch((err) => {
          console.error("Failed to play audio:", err);
        });
        setIsPlaying(true);
      }
    }
  }, [isPlaying, currentTrack?.url, volume, isMuted]);

  const toggleMute = useCallback(() => {
    if (audioRef.current) {
      const newMuted = !isMuted;
      audioRef.current.muted = newMuted;
      setIsMuted(newMuted);
    }
  }, [isMuted]);

  const handlePrevious = useCallback(() => {
    const prevIndex = currentTrackIndex === 0 ? tracks.length - 1 : currentTrackIndex - 1;
    setCurrentTrackIndex(prevIndex);
    setIsPlaying(false);
  }, [currentTrackIndex, tracks.length]);

  const handleNext = useCallback(() => {
    const nextIndex = (currentTrackIndex + 1) % tracks.length;
    setCurrentTrackIndex(nextIndex);
    setIsPlaying(false);
  }, [currentTrackIndex, tracks.length]);

  const handleTrackEnd = useCallback(() => {
    handleNext();
    // Auto-play next track
    setTimeout(() => {
      if (audioRef.current && tracks[(currentTrackIndex + 1) % tracks.length]?.url) {
        audioRef.current.play().catch(console.error);
        setIsPlaying(true);
      }
    }, 100);
  }, [handleNext, currentTrackIndex, tracks]);

  const selectTrack = useCallback((index: number) => {
    if (!tracks[index]?.url) return;
    
    setCurrentTrackIndex(index);
    setIsPlaying(false);
    
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play().catch(console.error);
        setIsPlaying(true);
      }
    }, 100);
  }, [tracks]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // No valid tracks - show placeholder
  if (!hasValidTracks) {
    if (mini) {
      return (
        <div className="flex items-center justify-center w-12 h-12 rounded-lg border border-border bg-card/90 backdrop-blur-sm shadow-sm text-muted-foreground">
          <Music className="h-5 w-5" />
        </div>
      );
    }
    
    return (
      <div className="rounded-lg border border-border bg-card p-4 text-card-foreground shadow-sm">
        <div className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-3">
          {title}
        </div>
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <Music className="h-8 w-8 text-muted-foreground mb-2" />
          <span className="text-sm text-muted-foreground">No audio tracks configured</span>
          <span className="text-[10px] text-muted-foreground mt-1">Add audio URLs to enable playback</span>
        </div>
      </div>
    );
  }

  // Mini version
  if (mini) {
    return (
      <div className="flex flex-col gap-2">
        <audio
          ref={audioRef}
          preload="auto"
          onEnded={handleTrackEnd}
          onLoadedMetadata={() => {
            setIsLoaded(true);
            if (audioRef.current) {
              setDuration(audioRef.current.duration);
            }
          }}
          onTimeUpdate={() => {
            if (audioRef.current) {
              setCurrentTime(audioRef.current.currentTime);
            }
          }}
        />

        {/* Play/Pause */}
        <button
          onClick={handlePlayPause}
          disabled={!currentTrack?.url}
          className={cn(
            "flex items-center justify-center w-12 h-12 rounded-lg border border-border shadow-sm transition-colors",
            currentTrack?.url 
              ? "bg-primary text-primary-foreground hover:bg-primary/90" 
              : "bg-muted text-muted-foreground cursor-not-allowed"
          )}
          aria-label={isPlaying ? "Pause" : "Play"}
          title={currentTrack ? `${currentTrack.name} - ${currentTrack.artist}` : "No track"}
        >
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
        </button>

        {/* Mute/Unmute */}
        <button
          onClick={toggleMute}
          className={cn(
            "flex items-center justify-center w-12 h-12 rounded-lg border border-border bg-card/90 backdrop-blur-sm shadow-sm transition-colors",
            isMuted ? "text-red-500" : "text-muted-foreground hover:text-foreground"
          )}
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </button>

        {/* Next Track */}
        <button
          onClick={handleNext}
          className="flex items-center justify-center w-12 h-12 rounded-lg border border-border bg-card/90 backdrop-blur-sm text-muted-foreground hover:text-foreground transition-colors shadow-sm"
          aria-label="Next track"
        >
          <SkipForward className="h-5 w-5" />
        </button>
      </div>
    );
  }

  // Full version
  return (
    <div className="rounded-lg border border-border bg-card p-4 text-card-foreground shadow-sm">
      <audio
        ref={audioRef}
        preload="auto"
        onEnded={handleTrackEnd}
        onLoadedMetadata={() => {
          setIsLoaded(true);
          if (audioRef.current) {
            setDuration(audioRef.current.duration);
          }
        }}
        onTimeUpdate={() => {
          if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
          }
        }}
      />

      <div className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-3">
        {title}
      </div>

      {/* Now Playing */}
      <div className="flex gap-3 mb-4">
        <div className="h-16 w-16 rounded bg-gradient-to-br from-primary/40 to-primary flex items-center justify-center flex-shrink-0">
          <Music className="h-8 w-8 text-primary-foreground" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold truncate">{currentTrack?.name || "No track"}</div>
          <div className="text-[10px] text-muted-foreground truncate">{currentTrack?.artist}</div>
          {isLoaded && (
            <div className="text-[10px] text-muted-foreground mt-1">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {isLoaded && duration > 0 && (
        <div className="mb-4">
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Track List */}
      <div className="space-y-2 mb-4 max-h-32 overflow-y-auto">
        {tracks.map((track, i) => (
          <button
            key={track.id}
            onClick={() => selectTrack(i)}
            disabled={!track.url}
            className={cn(
              "w-full flex items-center gap-2 p-2 rounded text-left transition-colors",
              i === currentTrackIndex ? "bg-primary/10" : "hover:bg-muted/50",
              !track.url && "opacity-40 cursor-not-allowed"
            )}
          >
            <div className="w-5 text-center text-[10px] text-muted-foreground">
              {i === currentTrackIndex && isPlaying ? (
                <span className="text-primary">▶</span>
              ) : (
                i + 1
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium truncate">{track.name}</div>
              <div className="text-[10px] text-muted-foreground truncate">{track.artist}</div>
            </div>
            <div className="text-[10px] text-muted-foreground">{track.duration}</div>
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={handlePrevious}
          className="p-2 rounded hover:bg-muted transition-colors"
          aria-label="Previous track"
        >
          <SkipBack className="h-4 w-4" />
        </button>
        
        <button
          onClick={handlePlayPause}
          disabled={!currentTrack?.url}
          className={cn(
            "flex items-center justify-center h-10 w-10 rounded-full transition-colors",
            currentTrack?.url 
              ? "bg-primary text-primary-foreground hover:bg-primary/90" 
              : "bg-muted text-muted-foreground cursor-not-allowed"
          )}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
        </button>
        
        <button
          onClick={handleNext}
          className="p-2 rounded hover:bg-muted transition-colors"
          aria-label="Next track"
        >
          <SkipForward className="h-4 w-4" />
        </button>
        
        <button
          onClick={toggleMute}
          className={cn(
            "p-2 rounded transition-colors hover:bg-muted",
            isMuted && "text-red-500"
          )}
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
