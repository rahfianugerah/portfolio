import { NextResponse } from "next/server";

// Simple in-memory counters (reset on server restart)
let visitorCount = 0;
let projectViews = 0;

// Track session IDs that have already been counted for visits
const countedVisitSessions = new Set<string>();

// Clear old sessions every 5 minutes to prevent memory buildup
setInterval(() => {
  countedVisitSessions.clear();
}, 5 * 60 * 1000);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");
    const sessionId = searchParams.get("session");
    
    // Handle visitor increment - only count once per session
    if (action === "visit" && sessionId) {
      const visitKey = `visit_${sessionId}`;
      if (!countedVisitSessions.has(visitKey)) {
        visitorCount += 1;
        countedVisitSessions.add(visitKey);
      }
    }
    
    // Handle project click increment - count every click (no session needed)
    if (action === "project-click") {
      projectViews += 1;
    }

    // Sparkline shows actual visitor progression - each bar represents cumulative visitors
    // Makes the trend visually align with total visitors count
    const sparkline = visitorCount > 0 
      ? Array.from({ length: 7 }, (_, i) => Math.max(1, Math.ceil(visitorCount * (i + 1) / 7)))
      : [0, 0, 0, 0, 0, 0, 0];

    const data = {
      visitors: visitorCount,
      projects: projectViews,
      delta24h: visitorCount, // Show actual visitor count as delta
      delta7d: projectViews,  // Show actual project views as delta
      sparkline,
    };

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Analytics API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch analytics", fallbackMessage: "Data Unavailable" },
      { status: 500 }
    );
  }
}

// POST for incrementing project views (when clicking a project)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type } = body;

    if (type === "project-click") {
      projectViews += 1;
    }

    return NextResponse.json({ 
      success: true, 
      data: {
        visitors: visitorCount,
        projects: projectViews,
      }
    });
  } catch (error) {
    console.error("Analytics POST error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update analytics" },
      { status: 500 }
    );
  }
}
