-- =====================================================
-- CHATBOT RATE LIMITING
-- Run this in Supabase SQL Editor before deploying the chatbot
-- SQL Editor > New Query > Paste & Run
-- =====================================================

-- One row per accepted chat message, keyed by a hash of the caller's IP.
-- The raw IP is never sent here.
CREATE TABLE IF NOT EXISTS chat_requests (
  id BIGSERIAL PRIMARY KEY,
  ip_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_requests_ip_hash_created_at
  ON chat_requests (ip_hash, created_at DESC);

-- The table itself stays closed to the public anon key: the limit is only
-- reachable through the function below, so nobody can read, reset, or delete it.
ALTER TABLE chat_requests ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON chat_requests FROM anon;
REVOKE ALL ON chat_requests FROM authenticated;

-- The limit lives here rather than in the caller, because the anon key is public
-- and a caller could otherwise ask for a limit of its own choosing.
CREATE OR REPLACE FUNCTION check_chat_rate_limit(p_ip_hash TEXT)
RETURNS TABLE (allowed BOOLEAN, remaining INTEGER, reset_seconds INTEGER)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  c_limit CONSTANT INTEGER := 20;
  c_window_seconds CONSTANT INTEGER := 3600;
  v_used INTEGER;
  v_oldest TIMESTAMP WITH TIME ZONE;
BEGIN
  IF p_ip_hash IS NULL OR LENGTH(p_ip_hash) <> 64 THEN
    RETURN QUERY SELECT FALSE, 0, c_window_seconds;
    RETURN;
  END IF;

  -- Keep the table from growing without bound; a day covers every live window.
  DELETE FROM chat_requests WHERE created_at < NOW() - INTERVAL '1 day';

  SELECT COUNT(*), MIN(created_at) INTO v_used, v_oldest
  FROM chat_requests
  WHERE ip_hash = p_ip_hash
    AND created_at >= NOW() - MAKE_INTERVAL(secs => c_window_seconds);

  IF v_used >= c_limit THEN
    RETURN QUERY SELECT
      FALSE,
      0,
      GREATEST(1, CEIL(EXTRACT(EPOCH FROM
        (v_oldest + MAKE_INTERVAL(secs => c_window_seconds)) - NOW()
      ))::INTEGER);
    RETURN;
  END IF;

  INSERT INTO chat_requests (ip_hash) VALUES (p_ip_hash);
  RETURN QUERY SELECT TRUE, c_limit - v_used - 1, c_window_seconds;
END;
$$;

REVOKE ALL ON FUNCTION check_chat_rate_limit(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION check_chat_rate_limit(TEXT) TO anon;

-- =====================================================
-- DONE - Verify with: SELECT * FROM check_chat_rate_limit(repeat('a', 64));
-- =====================================================
