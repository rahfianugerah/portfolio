import { supabase } from "./supabase";

// Get today's date string (YYYY-MM-DD)
function getTodayString(): string {
  return new Date().toISOString().split("T")[0];
}

// Check if session has already been counted
export async function isSessionCounted(sessionId: string): Promise<boolean> {
  try {
    const { data } = await supabase
      .from("sessions")
      .select("id")
      .eq("session_id", sessionId)
      .single();
    
    return !!data;
  } catch (error) {
    // Table might not exist yet, return false to allow first count
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
}> {
  try {
    const today = getTodayString();
    
    // Get total counters
    const { data: counters } = await supabase
      .from("counters")
      .select("name, value");
    
    const countersMap = (counters || []).reduce((acc, c) => {
      acc[c.name] = c.value;
      return acc;
    }, {} as Record<string, number>);
    
    // Get last 7 days visits
    const last7Days: string[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      last7Days.push(date.toISOString().split("T")[0]);
    }
    
    const { data: dailyData } = await supabase
      .from("daily_stats")
      .select("date, visits")
      .in("date", last7Days);
    
    const dailyMap = (dailyData || []).reduce((acc, d) => {
      acc[d.date] = d.visits;
      return acc;
    }, {} as Record<string, number>);
    
    const todayVisits = dailyMap[today] || 0;
    const weekVisits = last7Days.reduce((sum, date) => sum + (dailyMap[date] || 0), 0);
    
    return {
      visitorCount: countersMap["visitors"] || 0,
      projectViews: countersMap["project_views"] || 0,
      todayVisits,
      weekVisits,
    };
  } catch (error) {
    console.error("Error getting analytics:", error);
    return {
      visitorCount: 0,
      projectViews: 0,
      todayVisits: 0,
      weekVisits: 0,
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
