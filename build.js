const { readFileSync, writeFileSync } = require('fs');
const hash = (process.env.VERCEL_GIT_COMMIT_SHA || '0000000').slice(0, 7);
['index.html'].forEach(f => {
  let c = readFileSync(f, 'utf8');
  c = c.replace(/\?v=__HASH__/g, '?v=' + hash);
  writeFileSync(f, c);
});
