export function defaultDevEnabled() {
  const nodeEnv = (globalThis as { process?: { env?: { NODE_ENV?: string } } }).process?.env
    ?.NODE_ENV;
  return nodeEnv !== 'production';
}
