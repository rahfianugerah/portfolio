import fs from "fs";
import path from "path";

// Database file path
const DB_PATH = path.join(process.cwd(), "data", "analytics.json");

// Ensure data directory exists
function ensureDataDir() {
  const dataDir = path.dirname(DB_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Analytics data structure
interface AnalyticsData {
  visitorCount: number;
  projectViews: number;
  dailyVisits: { [date: string]: number }; // "YYYY-MM-DD" -> count
  dailyProjectViews: { [date: string]: number };
  lastUpdated: string;
}

// Default data
const DEFAULT_DATA: AnalyticsData = {
  visitorCount: 0,
  projectViews: 0,
  dailyVisits: {},
  dailyProjectViews: {},
  lastUpdated: new Date().toISOString(),
};

// Read database
export function readDB(): AnalyticsData {
  ensureDataDir();
  
  try {
    if (fs.existsSync(DB_PATH)) {
      const data = fs.readFileSync(DB_PATH, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error reading analytics DB:", error);
  }
  
  // Return default and create file
  writeDB(DEFAULT_DATA);
  return DEFAULT_DATA;
}

// Write database
export function writeDB(data: AnalyticsData): void {
  ensureDataDir();
  
  try {
    data.lastUpdated = new Date().toISOString();
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error writing analytics DB:", error);
  }
}

// Get today's date string
function getTodayString(): string {
  return new Date().toISOString().split("T")[0];
}

// Increment visitor count
export function incrementVisitor(): AnalyticsData {
  const data = readDB();
  const today = getTodayString();
  
  data.visitorCount += 1;
  data.dailyVisits[today] = (data.dailyVisits[today] || 0) + 1;
  
  writeDB(data);
  return data;
}

// Increment project views
export function incrementProjectViews(): AnalyticsData {
  const data = readDB();
  const today = getTodayString();
  
  data.projectViews += 1;
  data.dailyProjectViews[today] = (data.dailyProjectViews[today] || 0) + 1;
  
  writeDB(data);
  return data;
}

// Get analytics data
export function getAnalytics(): AnalyticsData {
  return readDB();
}

// Get last 7 days of visits for sparkline
export function getLast7DaysVisits(): number[] {
  const data = readDB();
  const result: number[] = [];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split("T")[0];
    result.push(data.dailyVisits[dateString] || 0);
  }
  
  return result;
}

// Get today's visitor count
export function getTodayVisitors(): number {
  const data = readDB();
  const today = getTodayString();
  return data.dailyVisits[today] || 0;
}

// Get this week's total visitors
export function getWeekVisitors(): number {
  const data = readDB();
  let total = 0;
  
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split("T")[0];
    total += data.dailyVisits[dateString] || 0;
  }
  
  return total;
}
