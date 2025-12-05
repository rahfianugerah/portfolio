/**
 * Simple in-memory cache utility for server-side caching
 * Supports TTL (time-to-live) in milliseconds
 */

type CacheEntry<T> = {
  data: T;
  expiresAt: number;
};

const cache = new Map<string, CacheEntry<unknown>>();

export function getCache<T>(key: string): T | null {
  const entry = cache.get(key) as CacheEntry<T> | undefined;
  if (!entry) return null;
  
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  
  return entry.data;
}

export function setCache<T>(key: string, data: T, ttlMs: number): void {
  cache.set(key, {
    data,
    expiresAt: Date.now() + ttlMs,
  });
}

export function clearCache(key?: string): void {
  if (key) {
    cache.delete(key);
  } else {
    cache.clear();
  }
}

// Convenience: 5 minutes in ms
export const CACHE_5_MIN = 5 * 60 * 1000;
// Convenience: 15 minutes in ms
export const CACHE_15_MIN = 15 * 60 * 1000;
