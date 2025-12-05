import { NextResponse } from "next/server";
import { getCache, setCache, CACHE_15_MIN } from "@/lib/cache";

// Spotify API credentials placeholder
// To use real Spotify API:
// 1. Create app at https://developer.spotify.com/dashboard
// 2. Get Client ID and Secret
// 3. Use Client Credentials flow for public playlist data
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID || "YOUR_CLIENT_ID";
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET || "YOUR_CLIENT_SECRET";

// Placeholder playlist data
const PLACEHOLDER_PLAYLIST = {
  id: "37i9dQZF1DXcBWIGoYBM5M",
  name: "Rahfi's Coding Playlist",
  description: "Lo-fi beats and ambient music for deep work",
  image: "/placeholder-playlist.jpg",
  externalUrl: "https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M",
  tracks: [
    {
      id: "1",
      name: "Midnight City",
      artist: "M83",
      album: "Hurry Up, We're Dreaming",
      duration: "4:03",
      previewUrl: null,
    },
    {
      id: "2",
      name: "Intro",
      artist: "The xx",
      album: "xx",
      duration: "2:07",
      previewUrl: null,
    },
    {
      id: "3",
      name: "Strobe",
      artist: "deadmau5",
      album: "For Lack of a Better Name",
      duration: "10:37",
      previewUrl: null,
    },
  ],
  totalTracks: 50,
};

// Get Spotify access token using Client Credentials flow
async function getSpotifyAccessToken(): Promise<string | null> {
  if (SPOTIFY_CLIENT_ID === "YOUR_CLIENT_ID") {
    return null;
  }

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString("base64")}`,
      },
      body: "grant_type=client_credentials",
    });

    if (!response.ok) {
      throw new Error("Failed to get Spotify token");
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Spotify token error:", error);
    return null;
  }
}

// Fetch playlist data from Spotify API
async function fetchSpotifyPlaylist(playlistId: string, accessToken: string) {
  const response = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}?fields=id,name,description,images,external_urls,tracks.items(track(id,name,artists,album,duration_ms,preview_url))`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch playlist");
  }

  const data = await response.json();
  
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    image: data.images?.[0]?.url || "/placeholder-playlist.jpg",
    externalUrl: data.external_urls?.spotify,
    tracks: data.tracks?.items?.slice(0, 3).map((item: any) => ({
      id: item.track?.id,
      name: item.track?.name,
      artist: item.track?.artists?.map((a: any) => a.name).join(", "),
      album: item.track?.album?.name,
      duration: formatDuration(item.track?.duration_ms),
      previewUrl: item.track?.preview_url,
    })) || [],
    totalTracks: data.tracks?.total || 0,
  };
}

function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const playlistId = searchParams.get("playlist") || "37i9dQZF1DXcBWIGoYBM5M";

    // Check cache first
    const cacheKey = `spotify_playlist_${playlistId}`;
    const cached = getCache<typeof PLACEHOLDER_PLAYLIST>(cacheKey);
    
    if (cached) {
      return NextResponse.json({ success: true, data: cached });
    }

    // Try to get real data if credentials are available
    const accessToken = await getSpotifyAccessToken();
    
    if (accessToken) {
      try {
        const playlist = await fetchSpotifyPlaylist(playlistId, accessToken);
        setCache(cacheKey, playlist, CACHE_15_MIN);
        return NextResponse.json({ success: true, data: playlist });
      } catch (error) {
        console.error("Spotify API error:", error);
        // Fall through to placeholder
      }
    }

    // Return placeholder data
    setCache(cacheKey, PLACEHOLDER_PLAYLIST, CACHE_15_MIN);
    
    return NextResponse.json({ 
      success: true, 
      data: PLACEHOLDER_PLAYLIST,
      isPlaceholder: true 
    });
  } catch (error) {
    console.error("Spotify API error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to fetch playlist", 
        fallbackMessage: "Data Unavailable",
        musicFallback: "music not available"
      },
      { status: 500 }
    );
  }
}
