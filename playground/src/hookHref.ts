const HOOK_ID = /^use[A-Za-z0-9]+$/;

export function hookPageHref(id: string) {
  if (!HOOK_ID.test(id)) return '#/';
  return `#/${id}`;
}
