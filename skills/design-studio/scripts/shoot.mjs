#!/usr/bin/env node
/*
  Screenshot HTML designs at desktop and mobile widths with agent-browser.
    node shoot.mjs --out <dir> [--states] [--full] [--widths 1440x900,390x844] <file.html|url> [...]
  Writes <dir>/<name>-desktop.png and <name>-mobile.png (one per width; names: desktop, mobile, w<W>).
  --states also writes:
    <name>-focus.png       first focusable element focused (keyboard-style focus ring)
    <name>-<state>.png     for each state listed in <html data-states="empty error loading">;
                           the script sets document.documentElement.dataset.state = '<state>'
*/
import { mkdirSync } from 'node:fs';
import { basename, extname, join } from 'node:path';
import { ab, evalJs, toUrl, die, parseArgs } from './_ab.mjs';

const { opts, pos } = parseArgs(process.argv.slice(2), { states: 'bool', full: 'bool' });
if (!opts.out || !pos.length) die('usage: shoot.mjs --out <dir> [--states] [--full] [--widths 1440x900,390x844] <files...>', 2);
mkdirSync(opts.out, { recursive: true });
const widths = (opts.widths || '1440x900,390x844').split(',').map((s) => s.split('x').map(Number));
const label = ([w]) => (w >= 1024 ? 'desktop' : w <= 480 ? 'mobile' : `w${w}`);
const full = opts.full !== false; // full page by default
const written = [];

for (const f of pos) {
  const name = basename(f, extname(f));
  for (const vp of widths) {
    ab(['set', 'viewport', String(vp[0]), String(vp[1])]);
    ab(['open', toUrl(f)]);
    ab(['wait', '--load', 'networkidle'], { allowFail: true });
    ab(['wait', '400']);
    const out = join(opts.out, `${name}-${label(vp)}.png`);
    ab(['screenshot', ...(full ? ['--full'] : []), out]);
    written.push(out);
    if (opts.states && label(vp) === 'desktop') {
      evalJs(`(()=>{const el=document.querySelector('a[href],button,input,select,textarea,[tabindex]:not([tabindex="-1"])');if(el){el.focus({focusVisible:true});}return !!el})()`);
      const fo = join(opts.out, `${name}-focus.png`);
      ab(['screenshot', fo]); written.push(fo);
      const states = evalJs(`(document.documentElement.dataset.states||'').split(/\\s+/).filter(Boolean)`);
      for (const s of Array.isArray(states) ? states : []) {
        evalJs(`(()=>{document.activeElement&&document.activeElement.blur();document.documentElement.dataset.state=${JSON.stringify(s)};return true})()`);
        ab(['wait', '300']);
        const so = join(opts.out, `${name}-${s}.png`);
        ab(['screenshot', ...(full ? ['--full'] : []), so]); written.push(so);
      }
    }
  }
}
console.log(written.join('\n'));
