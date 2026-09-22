// Chat rate limiting, held in Supabase rather than in memory: a serverless instance
// is replaced constantly, so an in-process counter resets before it ever limits anyone.
// The window and the ceiling live in supabase-chat-rate-limit.sql, because the anon key
// is public and a caller must not be able to choose its own limit.

import { createHash } from "node:crypto";
import { supabase } from "./supabase";

export interface ChatRateLimitResult {
  allowed: boolean;
  remaining: number;
  resetSeconds: number;
  // False when the limiter itself could not be reached, which is a different
  // failure from a caller who has genuinely run out of messages.
  available: boolean;
}

// The raw address never leaves the request: only this digest is stored.
function hashIdentifier(identifier: string): string {
  return createHash("sha256").update(identifier).digest("hex");
}

export async function checkChatRateLimit(identifier: string): Promise<ChatRateLimitResult> {
  const { data, error } = await supabase.rpc("check_chat_rate_limit", {
    p_ip_hash: hashIdentifier(identifier),
  });

  // Fail closed. A missing function or an unreachable database must not become an open door,
  // so the answer is no until supabase-chat-rate-limit.sql has been run.
  if (error || !Array.isArray(data) || data.length === 0) {
    console.error("Chat rate limit unavailable:", error?.message ?? "no row returned");
    return { allowed: false, remaining: 0, resetSeconds: 60, available: false };
  }

  const [row] = data;
  return {
    allowed: row.allowed === true,
    remaining: Number(row.remaining) || 0,
    resetSeconds: Number(row.reset_seconds) || 60,
    available: true,
  };
}
