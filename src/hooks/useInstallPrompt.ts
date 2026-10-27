import { useCallback, useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export type InstallPromptOutcome = 'accepted' | 'dismissed' | 'unavailable';

function isStandalone() {
  if (typeof window === 'undefined') return false;
  const displayMode = window.matchMedia?.('(display-mode: standalone)').matches ?? false;
  const iosStandalone =
    'standalone' in navigator && Boolean((navigator as { standalone?: boolean }).standalone);
  return displayMode || iosStandalone;
}

export const useInstallPrompt = () => {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    setIsInstalled(isStandalone());

    const handlePrompt = (event: Event) => {
      event.preventDefault();
      setDeferred(event as BeforeInstallPromptEvent);
    };

    const handleInstalled = () => {
      setDeferred(null);
      setIsInstalled(true);
    };

    window.addEventListener('beforeinstallprompt', handlePrompt);
    window.addEventListener('appinstalled', handleInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', handlePrompt);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  const promptInstall = useCallback(async (): Promise<InstallPromptOutcome> => {
    if (!deferred) return 'unavailable';

    try {
      await deferred.prompt();
      const choice = await deferred.userChoice;
      setDeferred(null);
      if (choice.outcome === 'accepted') setIsInstalled(true);
      return choice.outcome;
    } catch {
      setDeferred(null);
      return 'unavailable';
    }
  }, [deferred]);

  return {
    isReady: deferred != null,
    isInstalled,
    isSupported: typeof window !== 'undefined',
    prompt: promptInstall,
  } as const;
};
