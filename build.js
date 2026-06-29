import { readFileSync, writeFileSync } from 'fs';
const hash = (process.env.VERCEL_GIT_COMMIT_SHA || '0000000').slice(0, 7);
const files = ['index.html'];
files.forEach(f => {
  let c = readFileSync(f, 'utf8');
  c = c.replace(/\?v=__HASH__/g, '?v=' + hash);
  writeFileSync(f, c);
});
