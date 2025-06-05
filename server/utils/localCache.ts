const cache = new Map<string, { value: any, expiresAt: number }>();

export function getCache<T>(key: string): T | undefined {
  const item = cache.get(key);
  if (!item) return undefined;
  if (item.expiresAt < Date.now()) {
    cache.delete(key);
    return undefined;
  }
  return item.value as T;
}

export function setCache(key: string, value: any, ttlMs: number = 5 * 60 * 1000) {
  cache.set(key, { value, expiresAt: Date.now() + ttlMs });
}

export function clearCache() {
  cache.clear();
}
