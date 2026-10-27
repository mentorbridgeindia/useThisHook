import { useInstallPrompt } from 'usethishook';
import { buttonClass } from '../components/styles';

export const UseInstallPromptDemo = () => {
  const { isReady, isInstalled, prompt } = useInstallPrompt();

  return (
    <div className="space-y-3">
      <p>
        {isInstalled
          ? 'Running as an installed app (standalone).'
          : isReady
            ? 'Install prompt is ready.'
            : 'No install prompt yet (Chromium only, after engagement).'}
      </p>
      <button
        type="button"
        className={buttonClass}
        disabled={!isReady}
        onClick={() => void prompt()}
      >
        Install app
      </button>
    </div>
  );
};

export const useInstallPromptExample = `import { useInstallPrompt } from 'usethishook';

export const InstallButton = () => {
  const { isReady, prompt } = useInstallPrompt();
  if (!isReady) return null;
  return (
    <button type="button" onClick={() => void prompt()}>
      Install
    </button>
  );
};`;
