import { useState, useEffect, useRef, useCallback } from 'react';

const POLL_INTERVAL_MS = 30000; // 30 seconds

export const useAutoRefresh = (onRefresh) => {
  const [status, setStatus] = useState('idle');
  const [lastCheckTime, setLastCheckTime] = useState(null);
  const intervalRef = useRef(null);

  const performRefresh = useCallback(async () => {
    setStatus('checking');
    try {
      await onRefresh();
      setStatus('updated');
      setLastCheckTime(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Refresh error:', error);
      setStatus('error');
      setLastCheckTime(new Date().toLocaleTimeString());
    }
  }, [onRefresh]);

  const startAutoRefresh = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(performRefresh, POLL_INTERVAL_MS);
    console.log(`Auto-refresh activated: checking every ${POLL_INTERVAL_MS / 1000}s`);
  }, [performRefresh]);

  const stopAutoRefresh = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      console.log('Auto-refresh deactivated');
    }
  }, []);

  useEffect(() => {
    startAutoRefresh();

    // Handle visibility change
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAutoRefresh();
      } else {
        startAutoRefresh();
        performRefresh();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      stopAutoRefresh();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [startAutoRefresh, stopAutoRefresh, performRefresh]);

  return { status, lastCheckTime };
};
