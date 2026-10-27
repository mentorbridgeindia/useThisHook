import { useCallback, useEffect, useState } from 'react';

export interface StorageQuota {
  usage: number | null;
  quota: number | null;
  usageRatio: number | null;
  isSupported: boolean;
}

const unsupported: StorageQuota = {
  usage: null,
  quota: null,
  usageRatio: null,
  isSupported: false,
};

function hasEstimate() {
  return typeof navigator !== 'undefined' && typeof navigator.storage?.estimate === 'function';
}

export const useStorageQuota = () => {
  const [snapshot, setSnapshot] = useState<StorageQuota>(unsupported);

  const refresh = useCallback(async () => {
    if (!hasEstimate()) {
      setSnapshot(unsupported);
      return;
    }

    try {
      const estimate = await navigator.storage.estimate();
      const usage = estimate.usage ?? null;
      const quota = estimate.quota ?? null;
      const usageRatio = usage != null && quota != null && quota > 0 ? usage / quota : null;
      setSnapshot({ usage, quota, usageRatio, isSupported: true });
    } catch {
      setSnapshot({ ...unsupported, isSupported: true });
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { ...snapshot, refresh } as const;
};
