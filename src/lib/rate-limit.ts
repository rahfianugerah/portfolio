// Simple in-memory rate limiter for contact form
// Limits: 3 submissions per IP per hour

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store (resets on server restart)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  const entries = Array.from(rateLimitStore.entries());
  for (const [key, value] of entries) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 10 * 60 * 1000);

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetTime: number;
}

export async function checkRateLimit(
  identifier: string,
  limit: number = 3,
  windowMs: number = 60 * 60 * 1000 // 1 hour
): Promise<RateLimitResult> {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  // No previous entry or expired
  if (!entry || now > entry.resetTime) {
    const resetTime = now + windowMs;
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime,
    });
    return {
      success: true,
      limit,
      remaining: limit - 1,
      resetTime,
    };
  }

  // Rate limit exceeded
  if (entry.count >= limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }

  // Increment count
  entry.count += 1;
  rateLimitStore.set(identifier, entry);

  return {
    success: true,
    limit,
    remaining: limit - entry.count,
    resetTime: entry.resetTime,
  };
}
