import { useCallback, useEffect, useRef, useState } from 'react';

export interface UseScrollLockOptions {
  autoLock?: boolean;
  widthReflow?: boolean;
}

interface OriginalStyle {
  overflow: string;
  paddingRight: string;
}

export const useScrollLock = (options: UseScrollLockOptions = {}) => {
  const { autoLock = true, widthReflow = true } = options;
  const [isLocked, setIsLocked] = useState(false);
  const originalStyleRef = useRef<OriginalStyle | null>(null);

  const lock = useCallback(() => {
    if (typeof document === 'undefined') return;

    const target = document.body;

    if (!originalStyleRef.current) {
      originalStyleRef.current = {
        overflow: target.style.overflow,
        paddingRight: target.style.paddingRight,
      };
    }

    if (widthReflow) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      target.style.paddingRight = `${scrollbarWidth}px`;
    }

    target.style.overflow = 'hidden';
    setIsLocked(true);
  }, [widthReflow]);

  const unlock = useCallback(() => {
    if (typeof document === 'undefined') return;

    const target = document.body;
    const original = originalStyleRef.current;

    if (original) {
      target.style.overflow = original.overflow;
      if (widthReflow) target.style.paddingRight = original.paddingRight;
      originalStyleRef.current = null;
    }

    setIsLocked(false);
  }, [widthReflow]);

  useEffect(() => {
    if (!autoLock) return;

    lock();
    return () => {
      unlock();
    };
  }, [autoLock, lock, unlock]);

  return { isLocked, lock, unlock };
};
