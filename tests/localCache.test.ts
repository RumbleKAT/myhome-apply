import { getCache, setCache, clearCache } from '../server/utils/localCache';

describe('localCache', () => {
  beforeEach(() => {
    clearCache();
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  test('returns cached value within ttl', () => {
    setCache('a', 'foo', 1000);
    expect(getCache('a')).toBe('foo');
  });

  test('expires after ttl', () => {
    setCache('b', 'bar', 1000);
    jest.advanceTimersByTime(1500);
    expect(getCache('b')).toBeUndefined();
  });
});
