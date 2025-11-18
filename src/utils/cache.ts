/**
 * Cache utility for storing backend API responses in localStorage
 * Supports TTL (time-to-live) expiration and easy invalidation
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl?: number; // TTL in milliseconds
}

const CACHE_PREFIX = 'app_cache_';
const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes default

/**
 * Get cached data by key
 * Returns null if not found or expired
 */
export const getCached = <T>(key: string): T | null => {
  try {
    const cached = localStorage.getItem(`${CACHE_PREFIX}${key}`);
    if (!cached) return null;

    const entry: CacheEntry<T> = JSON.parse(cached);
    const now = Date.now();
    const ttl = entry.ttl || DEFAULT_TTL;

    // Check if expired
    if (now - entry.timestamp > ttl) {
      localStorage.removeItem(`${CACHE_PREFIX}${key}`);
      return null;
    }

    return entry.data;
  } catch (err) {
    console.error(`[Cache] Error retrieving key "${key}":`, err);
    return null;
  }
};

/**
 * Set cache data with optional TTL
 */
export const setCached = <T>(key: string, data: T, ttl?: number): void => {
  try {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || DEFAULT_TTL,
    };
    localStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(entry));
  } catch (err) {
    console.error(`[Cache] Error setting key "${key}":`, err);
  }
};

/**
 * Clear a specific cache key
 */
export const clearCacheKey = (key: string): void => {
  try {
    localStorage.removeItem(`${CACHE_PREFIX}${key}`);
  } catch (err) {
    console.error(`[Cache] Error clearing key "${key}":`, err);
  }
};

/**
 * Clear all cached data
 */
export const clearAllCache = (): void => {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith(CACHE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
    console.log('[Cache] All cache cleared');
  } catch (err) {
    console.error('[Cache] Error clearing all cache:', err);
  }
};

/**
 * Wrapper function for fetching with automatic caching
 * If data is cached and valid, returns cached data
 * Otherwise fetches from backend, caches result, and returns it
 */
export const fetchWithCache = async <T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttl?: number
): Promise<T> => {
  // Try to get from cache first
  const cached = getCached<T>(key);
  if (cached) {
    console.log(`[Cache] Hit for "${key}"`);
    return cached;
  }

  console.log(`[Cache] Miss for "${key}" - fetching from backend`);
  try {
    const data = await fetchFn();
    setCached(key, data, ttl);
    return data;
  } catch (err) {
    console.error(`[Cache] Error in fetchWithCache for "${key}":`, err);
    throw err;
  }
};

export const cacheManager = {
  get: getCached,
  set: setCached,
  clearKey: clearCacheKey,
  clearAll: clearAllCache,
  fetchWithCache,
};
