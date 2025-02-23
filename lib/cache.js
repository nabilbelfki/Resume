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
