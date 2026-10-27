import { useEffect, useRef } from 'react';
import { defaultDevEnabled } from './devEnabled';

export interface UseWhyDidYouUpdateOptions {
  enabled?: boolean;
}

export const useWhyDidYouUpdate = (
  label: string,
  props: Record<string, unknown>,
  options: UseWhyDidYouUpdateOptions = {},
) => {
  const enabled = options.enabled ?? defaultDevEnabled();
  const previous = useRef<Record<string, unknown> | undefined>(undefined);

  useEffect(() => {
    if (!enabled) {
      previous.current = props;
      return;
    }

    const prior = previous.current;
    previous.current = props;
    if (!prior) return;

    const keys = new Set([...Object.keys(prior), ...Object.keys(props)]);
    const changes: Record<string, { from: unknown; to: unknown }> = {};

    keys.forEach((key) => {
      if (Object.is(prior[key], props[key])) return;
      changes[key] = { from: prior[key], to: props[key] };
    });

    if (Object.keys(changes).length === 0) return;
    console.debug(`[useWhyDidYouUpdate] ${label}`, changes);
  });
};
