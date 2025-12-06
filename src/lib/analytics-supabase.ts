import { supabase } from "./supabase";

// Get today's date string (YYYY-MM-DD)
function getTodayString(): string {
  return new Date().toISOString().split("T")[0];
}

// Check if session has already been counted
export async function isSessionCounted(sessionId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from("sessions")
      .select("id")
      .eq("session_id", sessionId)
      .maybeSingle();
    
    if (error) {
      console.error("Session check error:", error.message);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error("Session check exception:", error);
    return false;
  }
}

// Mark session as counted
export async function markSessionCounted(sessionId: string): Promise<void> {
  try {
    await supabase.from("sessions").insert({ session_id: sessionId });
  } catch (error) {
    console.error("Error marking session:", error);
  }
}

// Increment visitor count
export async function incrementVisitor(): Promise<{
  visitorCount: number;
  todayVisits: number;
}> {
  const today = getTodayString();
  
  try {
    // Get current visitor count
    const { data: counterData } = await supabase
      .from("counters")
      .select("value")
      .eq("name", "visitors")
      .single();
    
    const currentCount = counterData?.value || 0;
    const newCount = currentCount + 1;
    
    // UPDATE visitor counter (not upsert - row already exists)
    const { error: updateError } = await supabase
      .from("counters")
      .update({ value: newCount, updated_at: new Date().toISOString() })
      .eq("name", "visitors");
    
    if (updateError) {
      console.error("Counter update error:", updateError);
    }
    
    // Check if daily record exists
    const { data: dailyData } = await supabase
      .from("daily_stats")
      .select("id, visits")
      .eq("date", today)
      .eq("counter_type", "visits")
      .maybeSingle();
    
    let newDaily = 1;
    
    if (dailyData) {
      // UPDATE existing daily record
      newDaily = (dailyData.visits || 0) + 1;
      await supabase
        .from("daily_stats")
        .update({ visits: newDaily, updated_at: new Date().toISOString() })
        .eq("id", dailyData.id);
    } else {
      // INSERT new daily record
      await supabase
        .from("daily_stats")
        .insert({ date: today, counter_type: "visits", visits: 1 });
    }
    
    return {
      visitorCount: newCount,
      todayVisits: newDaily,
    };
  } catch (error) {
    console.error("Error incrementing visitor:", error);
    return { visitorCount: 0, todayVisits: 0 };
  }
}

// Increment project views
export async function incrementProjectViews(): Promise<{
  projectViews: number;
  todayViews: number;
}> {
  const today = getTodayString();
  
  try {
    // Get current project views count
    const { data: counterData } = await supabase
      .from("counters")
      .select("value")
      .eq("name", "project_views")
      .single();
    
    const currentCount = counterData?.value || 0;
    const newCount = currentCount + 1;
    
    // UPDATE project views counter
    const { error: updateError } = await supabase
      .from("counters")
      .update({ value: newCount, updated_at: new Date().toISOString() })
      .eq("name", "project_views");
    
    if (updateError) {
      console.error("Project views update error:", updateError);
    }
    
    // Check if daily record exists
    const { data: dailyData } = await supabase
      .from("daily_stats")
      .select("id, visits")
      .eq("date", today)
      .eq("counter_type", "project_views")
      .maybeSingle();
    
    let newDaily = 1;
    
    if (dailyData) {
      // UPDATE existing daily record
      newDaily = (dailyData.visits || 0) + 1;
      await supabase
        .from("daily_stats")
        .update({ visits: newDaily, updated_at: new Date().toISOString() })
        .eq("id", dailyData.id);
    } else {
      // INSERT new daily record
      await supabase
        .from("daily_stats")
        .insert({ date: today, counter_type: "project_views", visits: 1 });
    }
    
    return {
      projectViews: newCount,
      todayViews: newDaily,
    };
  } catch (error) {
    console.error("Error incrementing project views:", error);
    return { projectViews: 0, todayViews: 0 };
  }
}

// Get all analytics data
export async function getAnalytics(): Promise<{
  visitorCount: number;
  projectViews: number;
  todayVisits: number;
  weekVisits: number;
  weekProjectViews: number;
}> {
  try {
    const today = getTodayString();
    
    // Get last 7 days date strings
    const last7Days: string[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      last7Days.push(date.toISOString().split("T")[0]);
    }
    
    // Get all daily stats for last 7 days (both visits and project_views)
    const { data: dailyData } = await supabase
      .from("daily_stats")
      .select("date, visits, counter_type")
      .in("date", last7Days);
    
    // Separate visits and project_views
    const visitsMap: Record<string, number> = {};
    const projectViewsMap: Record<string, number> = {};
    
    (dailyData || []).forEach((d) => {
      if (d.counter_type === "visits") {
        visitsMap[d.date] = d.visits;
      } else if (d.counter_type === "project_views") {
        projectViewsMap[d.date] = d.visits;
      }
    });
    
    const todayVisits = visitsMap[today] || 0;
    const weekVisits = last7Days.reduce((sum, date) => sum + (visitsMap[date] || 0), 0);
    const weekProjectViews = last7Days.reduce((sum, date) => sum + (projectViewsMap[date] || 0), 0);
    
    // Calculate totals from ALL daily_stats (not just last 7 days)
    const { data: allVisits } = await supabase
      .from("daily_stats")
      .select("visits")
      .eq("counter_type", "visits");
    
    const { data: allProjectViews } = await supabase
      .from("daily_stats")
      .select("visits")
      .eq("counter_type", "project_views");
    
    const totalVisitors = (allVisits || []).reduce((sum, d) => sum + (d.visits || 0), 0);
    const totalProjectViews = (allProjectViews || []).reduce((sum, d) => sum + (d.visits || 0), 0);
    
    return {
      visitorCount: totalVisitors,
      projectViews: totalProjectViews,
      todayVisits,
      weekVisits,
      weekProjectViews,
    };
  } catch (error) {
    console.error("Error getting analytics:", error);
    return {
      visitorCount: 0,
      projectViews: 0,
      todayVisits: 0,
      weekVisits: 0,
      weekProjectViews: 0,
    };
  }
}

// Get last 7 days of visits for sparkline
export async function getLast7DaysVisits(): Promise<number[]> {
  try {
    const last7Days: string[] = [];
    
    // Build array from 6 days ago to today
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      last7Days.push(date.toISOString().split("T")[0]);
    }
    
    const { data } = await supabase
      .from("daily_stats")
      .select("date, visits")
      .in("date", last7Days);
    
    const dailyMap = (data || []).reduce((acc, d) => {
      acc[d.date] = d.visits;
      return acc;
    }, {} as Record<string, number>);
    
    return last7Days.map((date) => dailyMap[date] || 0);
  } catch (error) {
    console.error("Error getting last 7 days:", error);
    return [0, 0, 0, 0, 0, 0, 0];
  }
}

// Migration helper: Set initial values
export async function setInitialData(
  visitorCount: number,
  projectViews: number,
  dailyVisits: Record<string, number>
): Promise<void> {
  // Set counters
  await supabase.from("counters").upsert([
    { name: "visitors", value: visitorCount },
    { name: "project_views", value: projectViews },
  ]);
  
  // Set daily visits
  const dailyRecords = Object.entries(dailyVisits).map(([date, visits]) => ({
    date,
    visits,
    counter_type: "visits",
  }));
  
  if (dailyRecords.length > 0) {
    await supabase.from("daily_stats").upsert(dailyRecords);
  }
}
