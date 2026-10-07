import { site, pages } from './config.js';

export const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

/** Internal page URL, honouring site.basePath. */
export const href = (id) => {
  const p = pages.find((x) => x.id === id);
  return site.basePath + p.path;
};
/** Asset URL, honouring site.basePath. */
export const asset = (p) => site.basePath + p;
export const pageById = (id) => pages.find((p) => p.id === id);
