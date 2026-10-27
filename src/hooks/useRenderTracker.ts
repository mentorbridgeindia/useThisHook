import { useEffect, useRef } from 'react';
import { defaultDevEnabled } from './devEnabled';

export interface UseRenderTrackerOptions {
  enabled?: boolean;
}

export const useRenderTracker = (label: string, options: UseRenderTrackerOptions = {}) => {
  const enabled = options.enabled ?? defaultDevEnabled();
  const countRef = useRef(0);
  countRef.current += 1;
  const renderCount = countRef.current;

  useEffect(() => {
    if (!enabled) return;
    console.debug(`[useRenderTracker] ${label} committed render #${renderCount}`);
  });

  return renderCount;
};
