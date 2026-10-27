const REPO = 'senthilkumar979/useThisHook';

export const FEATURED_SANDBOX_HOOKS = [
  'useConfirm',
  'usePrompt',
  'useOverlay',
  'useStepFlow',
  'useFingerprint',
  'useAmountInput',
] as const;

export function demoSourcePath(hookId: string) {
  return `playground/src/demos/Use${hookId.slice(3)}Demo.tsx`;
}

export function stackBlitzUrl(hookId: string) {
  const file = demoSourcePath(hookId);
  return `https://stackblitz.com/github/${REPO}?file=${encodeURIComponent(file)}`;
}

export function stackBlitzEmbedUrl(hookId: string) {
  return `${stackBlitzUrl(hookId)}&embed=1&hideNavigation=1&view=preview`;
}

export function codeSandboxUrl(hookId: string) {
  const file = demoSourcePath(hookId);
  return `https://codesandbox.io/p/github/${REPO}/main?file=${encodeURIComponent(file)}`;
}

export function isFeaturedSandboxHook(hookId: string) {
  return (FEATURED_SANDBOX_HOOKS as readonly string[]).includes(hookId);
}
