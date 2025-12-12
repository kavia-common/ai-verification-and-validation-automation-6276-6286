import { useEffect, useRef } from 'react';

/**
 * PUBLIC_INTERFACE
 * usePolling
 * Polls an async function at a given interval and calls onUpdate with results.
 */
export function usePolling(fetchFn, { interval = 2000, enabled = true, onUpdate } = {}) {
  const timerRef = useRef(null);

  useEffect(() => {
    if (!enabled || !fetchFn) return;

    let stopped = false;

    const tick = async () => {
      try {
        const data = await fetchFn();
        if (!stopped && onUpdate) onUpdate(data);
      } catch (e) {
        // Swallow errors to keep polling; consumers handle via onUpdate if needed
        if (!stopped && onUpdate) onUpdate({ error: e });
      } finally {
        if (!stopped) timerRef.current = setTimeout(tick, interval);
      }
    };

    tick();

    return () => {
      stopped = true;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [fetchFn, interval, enabled, onUpdate]);
}
