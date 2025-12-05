import { NextResponse } from "next/server";
import { getCache, setCache, CACHE_5_MIN } from "@/lib/cache";

// In-memory counters (reset on server restart)
// In production, use a database or Redis
let visitorCount = 1247; // Starting seed
let projectViews = 892; // Starting seed
const hourlyVisits: number[] = Array.from({ length: 24 }, () => Math.floor(Math.random() * 50) + 10);

// Increment on each unique visit (simplified - no IP tracking)
function incrementVisitor() {
  visitorCount += 1;
  // Update hourly visits for sparkline
  const currentHour = new Date().getHours();
  hourlyVisits[currentHour] = (hourlyVisits[currentHour] || 0) + 1;
}

function incrementProjectView() {
  projectViews += 1;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");
    
    // Handle increment actions
    if (action === "visit") {
      incrementVisitor();
    } else if (action === "project") {
      incrementProjectView();
    }

    // Check cache first
    const cacheKey = "analytics_data";
    const cached = getCache<{
      visitors: number;
      projects: number;
      delta24h: number;
      delta7d: number;
      sparkline: number[];
    }>(cacheKey);
    
    if (cached && !action) {
      return NextResponse.json({ success: true, data: cached });
    }

    // Calculate deltas (simulated)
    const delta24h = Math.floor(Math.random() * 50) + 20;
    const delta7d = Math.floor(Math.random() * 200) + 100;
    
    // Generate sparkline data (last 7 data points)
    const sparkline = hourlyVisits.slice(-7);

    const data = {
      visitors: visitorCount,
      projects: projectViews,
      delta24h,
      delta7d,
      sparkline,
    };

    // Cache for 5 minutes
    setCache(cacheKey, data, CACHE_5_MIN);

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Analytics API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch analytics", fallbackMessage: "Data Unavailable" },
      { status: 500 }
    );
  }
}

// POST for incrementing counters
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type } = body;

    if (type === "visit") {
      incrementVisitor();
    } else if (type === "project") {
      incrementProjectView();
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Analytics POST error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update analytics" },
      { status: 500 }
    );
  }
}
