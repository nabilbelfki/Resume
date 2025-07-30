// lib/cache.js
const cache = {};
const CACHE_DURATION = 3600 * 1000; // 1 hour in milliseconds

export const setCache = (key, data) => {
  cache[key] = {
    data,
    expiry: Date.now() + CACHE_DURATION,
  };
};

export const getCache = (key) => {
  const cachedData = cache[key];
  if (cachedData && cachedData.expiry > Date.now()) {
    return cachedData.data;
  }
  return null;
};

export const clearCache = (prefix) => {
  let clearedCount = 0;
  const prefixPattern = new RegExp(`^${prefix}`); // Match keys starting with prefix

  for (const key in cache) {
    if (prefixPattern.test(key)) {
      delete cache[key];
      clearedCount++;
    }
  }

  console.log(`Cleared ${clearedCount} cache entries with prefix: ${prefix}`);
  return clearedCount;
};

export const getCacheKeys = () => Object.keys(cache);