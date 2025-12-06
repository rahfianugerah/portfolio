-- =====================================================
-- SUPABASE ANALYTICS SCHEMA - CLEAN INSTALL
-- Run this entire script in Supabase SQL Editor
-- SQL Editor > New Query > Paste & Run
-- =====================================================

-- STEP 1: Drop existing tables (clean start)
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS daily_stats CASCADE;
DROP TABLE IF EXISTS counters CASCADE;

-- STEP 2: Create counters table
CREATE TABLE counters (
  id BIGSERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  value INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- STEP 3: Create daily_stats table
CREATE TABLE daily_stats (
  id BIGSERIAL PRIMARY KEY,
  date DATE NOT NULL,
  counter_type TEXT NOT NULL DEFAULT 'visits',
  visits INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(date, counter_type)
);

-- STEP 4: Create sessions table
CREATE TABLE sessions (
  id BIGSERIAL PRIMARY KEY,
  session_id TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- STEP 5: Create indexes for faster queries
CREATE INDEX idx_daily_stats_date ON daily_stats(date);
CREATE INDEX idx_sessions_session_id ON sessions(session_id);
CREATE INDEX idx_counters_name ON counters(name);

-- STEP 6: DISABLE Row Level Security (important!)
ALTER TABLE counters DISABLE ROW LEVEL SECURITY;
ALTER TABLE daily_stats DISABLE ROW LEVEL SECURITY;
ALTER TABLE sessions DISABLE ROW LEVEL SECURITY;

-- STEP 7: Grant full permissions to anon role
GRANT ALL ON counters TO anon;
GRANT ALL ON daily_stats TO anon;
GRANT ALL ON sessions TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;

-- STEP 8: Insert initial data
INSERT INTO counters (name, value) VALUES ('visitors', 0);
INSERT INTO counters (name, value) VALUES ('project_views', 0);

-- =====================================================
-- DONE - Verify with: SELECT * FROM counters;
-- =====================================================
