/**
 * Lightweight session-level API cache.
 * Prevents the same endpoint from being re-fetched on every page navigation.
 * Data is stored in sessionStorage and expires after `TTL` ms.
 *
 * IMPORTANT: Cache keys for batch-scoped data MUST include the batch year
 * e.g. `batchStats_2025` vs `batchStats_2026` to prevent cross-batch pollution.
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

// Clear ALL cache keys — call on logout or batch change
export const cacheClearAll = () => {
    try {
        Object.keys(sessionStorage)
            .filter(k => k.startsWith('_cache_'))
            .forEach(k => sessionStorage.removeItem(k));
    } catch {}
};
