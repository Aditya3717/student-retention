/**
 * Lightweight session-level API cache.
 * Prevents the same endpoint from being re-fetched on every page navigation.
 * Data is stored in sessionStorage and expires after `TTL` ms.
 */

const TTL = 3 * 60 * 1000; // 3 minutes

export const cacheGet = (key) => {
    try {
        const raw = sessionStorage.getItem(`_cache_${key}`);
        if (!raw) return null;
        const { data, ts } = JSON.parse(raw);
        if (Date.now() - ts > TTL) {
            sessionStorage.removeItem(`_cache_${key}`);
            return null;
        }
        return data;
    } catch {
        return null;
    }
};

export const cacheSet = (key, data) => {
    try {
        sessionStorage.setItem(`_cache_${key}`, JSON.stringify({ data, ts: Date.now() }));
    } catch {
        // sessionStorage full — silently skip
    }
};

export const cacheClear = (key) => {
    try { sessionStorage.removeItem(`_cache_${key}`); } catch {}
};
