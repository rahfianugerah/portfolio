-- Enable RLS on all Analytics Tables
ALTER TABLE counters ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- 1. Policies for 'counters' (Read and Update for visitor/project counts)
-- Allow anyone to read the current counts
CREATE POLICY "Public Read Counters" 
ON counters FOR SELECT 
TO anon 
USING (true);

-- Allow anyone to update the counts (incrementing)
CREATE POLICY "Public Update Counters" 
ON counters FOR UPDATE 
TO anon 
USING (true);


-- 2. Policies for 'daily_stats' (Time-series data)
-- Allow anyone to read the stats
CREATE POLICY "Public Read Daily Stats" 
ON daily_stats FOR SELECT 
TO anon 
USING (true);

-- Allow inserting a new day's record
CREATE POLICY "Public Insert Daily Stats" 
ON daily_stats FOR INSERT 
TO anon 
WITH CHECK (true);

-- Allow updating today's record (incrementing)
CREATE POLICY "Public Update Daily Stats" 
ON daily_stats FOR UPDATE 
TO anon 
USING (true);


-- 3. Policies for 'sessions' (Unique visitor tracking)
-- Allow reading to check if a session exists (prevent double counting)
CREATE POLICY "Public Read Sessions" 
ON sessions FOR SELECT 
TO anon 
USING (true);

-- Allow inserting a new session ID
CREATE POLICY "Public Insert Sessions" 
ON sessions FOR INSERT 
TO anon 
WITH CHECK (true);
