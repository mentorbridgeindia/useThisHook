import { useEffect, useRef, type DependencyList, type EffectCallback } from 'react';

/**
 * Like `useEffect`, but skips the initial mount. Runs only when dependencies
 * change afterward (state, props, or context values listed in `deps`).
 */
export const useUpdateEffect = (effect: EffectCallback, deps?: DependencyList): void => {
  const isFirstMount = useRef(true);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    return effect();
    // Intentionally mirror useEffect's deps API (caller-controlled).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};
