import { useSyncExternalStore } from 'react';

function subscribe(onStoreChange: () => void) {
  document.addEventListener('visibilitychange', onStoreChange);
  return () => {
    document.removeEventListener('visibilitychange', onStoreChange);
  };
}

function getSnapshot(): DocumentVisibilityState {
  return document.visibilityState;
}

function getServerSnapshot(): DocumentVisibilityState {
  return 'visible';
}

export const useDocumentVisibility = () =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
