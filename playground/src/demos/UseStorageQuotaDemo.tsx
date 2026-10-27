import { useStorageQuota } from 'usethishook';
import { buttonClass } from '../components/styles';

function formatBytes(value: number | null) {
  if (value == null) return 'n/a';
  if (value < 1024) return `${value} B`;
  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

export const UseStorageQuotaDemo = () => {
  const { usage, quota, usageRatio, isSupported, refresh } = useStorageQuota();

  if (!isSupported) return <p>Storage estimate is not available in this browser.</p>;

  return (
    <div className="space-y-3">
      <p>
        {formatBytes(usage)} of {formatBytes(quota)}{' '}
        {usageRatio != null ? `(${Math.round(usageRatio * 100)}%)` : ''}
      </p>
      <button type="button" className={buttonClass} onClick={() => void refresh()}>
        Refresh
      </button>
    </div>
  );
};

export const useStorageQuotaExample = `import { useStorageQuota } from 'usethishook';

export const QuotaMeter = () => {
  const { usageRatio, isSupported } = useStorageQuota();
  if (!isSupported || usageRatio == null) return null;
  return <progress value={usageRatio} max={1} />;
};`;
