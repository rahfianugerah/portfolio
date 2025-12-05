"use client";

import { useEffect, useState, useRef } from "react";
import { WidgetFallback } from "@/components/widget-error-boundary";
import { Play, Pause, Volume2, VolumeX, ExternalLink, Music } from "lucide-react";
import { cn } from "@/lib/utils";

type Track = {
  id: string;
  name: string;
  artist: string;
  album: string;
  duration: string;
  previewUrl: string | null;
};

type PlaylistData = {
  id: string;
  name: string;
  description: string;
  image: string;
  externalUrl: string;
  tracks: Track[];
  totalTracks: number;
};

type SpotifyWidgetProps = {
  mini?: boolean;
};

export default function SpotifyWidget({ mini = false }: SpotifyWidgetProps) {
  const [playlist, setPlaylist] = useState<PlaylistData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [musicError, setMusicError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    async function fetchPlaylist() {
      try {
        const res = await fetch("/api/spotify");
        const json = await res.json();
        
        if (!json.success) {
          if (json.musicFallback) {
            setMusicError(true);
          } else {
            throw new Error(json.error);
          }
          return;
        }
        
        if (!json.data || !json.data.tracks || json.data.tracks.length === 0) {
          setMusicError(true);
          return;
        }
        
        setPlaylist(json.data);
      } catch (err) {
        console.error("Failed to fetch playlist:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchPlaylist();
  }, []);

  const handlePlayPause = () => {
    if (!playlist?.tracks?.[currentTrackIndex]?.previewUrl) {
      // No preview available, open in Spotify
      window.open(playlist?.externalUrl, "_blank");
      return;
    }

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Global fallback for widget-level errors
  if (error) {
    if (mini) {
      return (
        <a
          href="https://open.spotify.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-12 h-12 rounded-lg border border-border bg-card/90 backdrop-blur-sm shadow-sm text-muted-foreground hover:text-green-500 transition-colors"
          title="Spotify"
        >
          <Music className="h-5 w-5" />
        </a>
      );
    }
    return <WidgetFallback message="Data Unavailable" />;
  }

  // Music-specific fallback
  if (musicError) {
    if (mini) {
      return (
        <a
          href="https://open.spotify.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-12 h-12 rounded-lg border border-border bg-card/90 backdrop-blur-sm shadow-sm text-muted-foreground hover:text-green-500 transition-colors"
          title="Music not available"
        >
          <Music className="h-5 w-5" />
        </a>
      );
    }
    return (
      <div className="rounded-lg border border-border bg-card p-4 text-card-foreground shadow-sm">
        <div className="flex flex-col items-center justify-center py-4 text-center">
          <Music className="h-8 w-8 text-muted-foreground mb-2" />
          <span className="text-sm text-muted-foreground">music not available</span>
        </div>
      </div>
    );
  }

  if (loading) {
    if (mini) {
      return (
        <div className="flex items-center justify-center w-12 h-12 rounded-lg border border-border bg-card/90 backdrop-blur-sm shadow-sm">
          <div className="h-5 w-5 bg-muted rounded animate-pulse" />
        </div>
      );
    }
    return (
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="animate-pulse space-y-3">
          <div className="h-4 w-24 bg-muted rounded" />
          <div className="flex gap-3">
            <div className="h-16 w-16 bg-muted rounded" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-32 bg-muted rounded" />
              <div className="h-2 w-24 bg-muted rounded" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-8 w-full bg-muted rounded" />
            <div className="h-8 w-full bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!playlist) {
    if (mini) {
      return (
        <a
          href="https://open.spotify.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-12 h-12 rounded-lg border border-border bg-card/90 backdrop-blur-sm shadow-sm text-muted-foreground hover:text-green-500 transition-colors"
          title="Spotify"
        >
          <Music className="h-5 w-5" />
        </a>
      );
    }
    return (
      <div className="rounded-lg border border-border bg-card p-4 text-card-foreground shadow-sm">
        <div className="flex flex-col items-center justify-center py-4 text-center">
          <Music className="h-8 w-8 text-muted-foreground mb-2" />
          <span className="text-sm text-muted-foreground">music not available</span>
        </div>
      </div>
    );
  }

  const currentTrack = playlist.tracks[currentTrackIndex];

  // Mini floating version for outer side rail - Square cards
  if (mini) {
    return (
      <div className="flex flex-col gap-2">
        {/* Hidden audio element */}
        {currentTrack?.previewUrl && (
          <audio
            ref={audioRef}
            src={currentTrack.previewUrl}
            muted={isMuted}
            onEnded={() => {
              setCurrentTrackIndex((prev) => (prev + 1) % playlist.tracks.length);
              setIsPlaying(false);
            }}
          />
        )}

        {/* Play/Pause Button */}
        <button
          onClick={handlePlayPause}
          className="flex items-center justify-center w-12 h-12 rounded-lg border border-border bg-green-500 text-white hover:bg-green-600 transition-colors shadow-sm"
          aria-label={isPlaying ? "Pause" : "Play"}
          title={currentTrack ? `${currentTrack.name} - ${currentTrack.artist}` : "Play"}
        >
          {isPlaying ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5 ml-0.5" />
          )}
        </button>

        {/* Mute/Unmute Button */}
        <button
          onClick={toggleMute}
          className="flex items-center justify-center w-12 h-12 rounded-lg border border-border bg-card/90 backdrop-blur-sm text-muted-foreground hover:text-foreground transition-colors shadow-sm"
          aria-label={isMuted ? "Unmute" : "Mute"}
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? (
            <VolumeX className="h-5 w-5" />
          ) : (
            <Volume2 className="h-5 w-5" />
          )}
        </button>

        {/* Open in Spotify */}
        <a
          href={playlist.externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-12 h-12 rounded-lg border border-border bg-card/90 backdrop-blur-sm text-muted-foreground hover:text-green-500 transition-colors shadow-sm"
          aria-label="Open in Spotify"
          title="Open in Spotify"
        >
          <ExternalLink className="h-5 w-5" />
        </a>
      </div>
    );
  }

  // Full version

  return (
    <div className="rounded-lg border border-border bg-card p-4 text-card-foreground shadow-sm">
      {/* Hidden audio element */}
      {currentTrack?.previewUrl && (
        <audio
          ref={audioRef}
          src={currentTrack.previewUrl}
          muted={isMuted}
          onEnded={() => {
            setCurrentTrackIndex((prev) => (prev + 1) % playlist.tracks.length);
            setIsPlaying(false);
          }}
        />
      )}

      <div className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-3">
        Now Playing
      </div>

      {/* Playlist Header */}
      <div className="flex gap-3 mb-4">
        <div className="h-16 w-16 rounded bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center flex-shrink-0">
          <Music className="h-8 w-8 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold truncate">{playlist.name}</div>
          <div className="text-[10px] text-muted-foreground truncate">
            {playlist.totalTracks} tracks
          </div>
          <div className="text-[10px] text-muted-foreground line-clamp-2 mt-1">
            {playlist.description}
          </div>
        </div>
      </div>

      {/* Track List */}
      <div className="space-y-2 mb-4">
        {playlist.tracks.map((track, i) => (
          <button
            key={track.id}
            onClick={() => setCurrentTrackIndex(i)}
            className={cn(
              "w-full flex items-center gap-2 p-2 rounded text-left transition-colors",
              i === currentTrackIndex ? "bg-primary/10" : "hover:bg-muted/50"
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePlayPause}
            className="flex items-center justify-center h-8 w-8 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4 ml-0.5" />
            )}
          </button>
          <button
            onClick={toggleMute}
            className="p-1.5 rounded hover:bg-muted transition-colors"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </button>
        </div>

        <a
          href={playlist.externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-[10px] text-green-500 hover:text-green-400 transition-colors"
        >
          <span>Open in Spotify</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
}
