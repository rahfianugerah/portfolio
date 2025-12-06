import { NextResponse } from "next/server";
import {
  getAnalytics,
  incrementVisitor,
  incrementProjectViews,
  getLast7DaysVisits,
  isSessionCounted,
  markSessionCounted,
} from "@/lib/analytics-supabase";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");
    const sessionId = searchParams.get("session");
    
    let analytics = await getAnalytics();
    
    // Handle visitor increment - only count once per session
    if (action === "visit" && sessionId) {
      const alreadyCounted = await isSessionCounted(sessionId);
      
      if (!alreadyCounted) {
        const result = await incrementVisitor();
        analytics = {
          ...analytics,
          visitorCount: result.visitorCount,
          todayVisits: result.todayVisits,
        };
        // Mark session as counted
        await markSessionCounted(sessionId);
      }
    }
    
    // Handle project click increment - count every click
    if (action === "project-click") {
      const result = await incrementProjectViews();
      analytics = {
        ...analytics,
        projectViews: result.projectViews,
      };
    }

    // Get real sparkline data from last 7 days
    const sparkline = await getLast7DaysVisits();

    const responseData = {
      visitors: analytics.visitorCount,
      projects: analytics.projectViews,
      delta24h: analytics.todayVisits,        // Today's visitors
      delta7d: analytics.weekProjectViews,    // This week's project views
      sparkline,                               // Real daily data for last 7 days
    };

    return NextResponse.json({ success: true, data: responseData });
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
      const result = await incrementProjectViews();
      return NextResponse.json({ 
        success: true, 
        data: {
          visitors: 0, // Not fetched in POST
          projects: result.projectViews,
        }
      });
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
