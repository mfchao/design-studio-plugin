#!/usr/bin/env node
/*
  Build a contact sheet (grid) of images as HTML + PNG.
    node contact-sheet.mjs --out <path-without-ext> [--title "Round 1"] [--cols 4] [--labels] [--width 1600] <images...>
  Writes <out>.html and <out>.png (PNG needs agent-browser; the HTML is always written).
*/
import { writeFileSync, mkdirSync } from 'node:fs';
import { basename, dirname, extname } from 'node:path';
import { toUrl, die, parseArgs, ab, AB } from './_ab.mjs';

const { opts, pos } = parseArgs(process.argv.slice(2), { labels: 'bool' });
if (!opts.out || !pos.length) die('usage: contact-sheet.mjs --out <path> [--title T] [--cols N] [--labels] <images...>', 2);
const cols = Number(opts.cols || Math.min(4, pos.length));
const width = Number(opts.width || 1600);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const cells = pos.map((p) => `<figure><img src="${toUrl(p)}" alt="${esc(basename(p))}">${opts.labels ? `<figcaption>${esc(basename(p, extname(p)))}</figcaption>` : ''}</figure>`).join('\n');
const html = `<!doctype html><html><head><meta charset="utf-8"><title>${esc(opts.title || 'Contact sheet')}</title>
<style>
:root{--bg:#f4f3f1;--ink:#1d1d1b;--muted:#6b6a66;--line:#dddbd6}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:14px/1.4 ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;padding:32px}
h1{font-size:20px;font-weight:600;margin:0 0 20px}
.grid{display:grid;grid-template-columns:repeat(${cols},1fr);gap:20px;align-items:start}
figure{margin:0;background:#fff;border:1px solid var(--line);border-radius:8px;overflow:hidden}
img{display:block;width:100%;height:auto}
figcaption{padding:8px 10px;font-weight:600;font-size:13px;border-top:1px solid var(--line)}
</style></head><body>${opts.title ? `<h1>${esc(opts.title)}</h1>` : ''}<div class="grid">${cells}</div></body></html>`;
mkdirSync(dirname(opts.out), { recursive: true });
writeFileSync(`${opts.out}.html`, html);
if (!AB) { console.log(`${opts.out}.html\n(PNG skipped: agent-browser not installed)`); process.exit(0); }
ab(['set', 'viewport', String(width), '1000']);
ab(['open', toUrl(`${opts.out}.html`)]);
ab(['wait', '--load', 'networkidle'], { allowFail: true });
ab(['screenshot', '--full', `${opts.out}.png`]);
console.log(`${opts.out}.html\n${opts.out}.png`);
