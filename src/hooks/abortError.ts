export function abortError() {
  const error = new Error('Aborted');
  error.name = 'AbortError';
  return error;
}
