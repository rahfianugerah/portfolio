-- Run this SQL in Supabase SQL Editor to sync the counters with daily_stats
-- This fixes the mismatch between total visitors and daily visits

-- Step 1: Get the sum of all daily visits
-- Step 2: Update the counters table with the correct values

-- Update visitors counter to match sum of daily visits
UPDATE counters 
SET value = (
  SELECT COALESCE(SUM(visits), 0) 
  FROM daily_stats 
  WHERE counter_type = 'visits'
),
updated_at = NOW()
WHERE name = 'visitors';

-- Update project_views counter to match sum of daily project views  
UPDATE counters 
SET value = (
  SELECT COALESCE(SUM(visits), 0) 
  FROM daily_stats 
  WHERE counter_type = 'project_views'
),
updated_at = NOW()
WHERE name = 'project_views';

-- Verify the sync
SELECT * FROM counters;
SELECT date, counter_type, visits FROM daily_stats ORDER BY date DESC;
