#!/usr/bin/env node
/*
  Measured accessibility check of a page: axe-core (WCAG 2.x A/AA + best practice), contrast, target sizes.
    node axe.mjs <file.html|url> [--out result.json] [--mobile 390x844]
  Desktop (1440x900) only by default; targets under 24px fail (WCAG 2.2 AA 2.5.8).
  --mobile also runs at that viewport and uses the 44px touch-target rule.
  Prints a summary; writes full JSON with --out. Exit 0 clean, 2 critical/serious violations or small targets.
*/
import { writeFileSync } from 'node:fs';
import { ab, evalJs, toUrl, die, parseArgs } from './_ab.mjs';

const AXE = 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.2/axe.min.js';
const argv = process.argv.slice(2);
const mi = argv.indexOf('--mobile');
let mobileVp = null;
if (mi >= 0) { mobileVp = /^\d+x\d+$/.test(argv[mi + 1] || '') ? argv[mi + 1] : '390x844'; argv.splice(mi, mobileVp === argv[mi + 1] ? 2 : 1); }
const { opts, pos } = parseArgs(argv);
if (!pos[0]) die('usage: axe.mjs <file.html|url> [--out result.json] [--mobile [WxH]]', 2);
const doMobile = mobileVp !== null;
const [mw, mh] = (mobileVp || '390x844').split('x');
const MIN = doMobile ? 44 : 24;

function runAxe() {
  evalJs(`(()=>{window.__axeResult=null;const go=()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa','best-practice']}}).then(r=>{window.__axeResult=JSON.stringify({violations:r.violations.map(v=>({id:v.id,impact:v.impact,help:v.help,helpUrl:v.helpUrl,count:v.nodes.length,targets:v.nodes.slice(0,8).map(n=>({target:n.target.join(' '),summary:n.failureSummary}))})),passes:r.passes.length,incomplete:r.incomplete.map(i=>({id:i.id,count:i.nodes.length}))})}).catch(e=>{window.__axeResult=JSON.stringify({error:String(e)})});if(window.axe){go()}else{const s=document.createElement('script');s.src=${JSON.stringify(AXE)};s.onload=go;s.onerror=()=>{window.__axeResult=JSON.stringify({error:'could not load axe-core from CDN'})};document.head.appendChild(s)}return true})()`);
  ab(['wait', '--fn', 'window.__axeResult !== null']);
  return evalJs('window.__axeResult');
}

const targetsJs = `JSON.stringify([...document.querySelectorAll('a[href],button,input:not([type=hidden]),select,textarea,[role=button],[role=link],[role=checkbox],[role=tab],[tabindex]:not([tabindex="-1"])')].filter(e=>{const s=getComputedStyle(e);return s.display!=='none'&&s.visibility!=='hidden'&&e.getClientRects().length}).map(e=>{const r=e.getBoundingClientRect();return {el:e.tagName.toLowerCase()+(e.id?'#'+e.id:'')+(e.className&&typeof e.className==='string'?'.'+e.className.trim().split(/\\s+/).slice(0,2).join('.'):''),text:(e.innerText||e.getAttribute('aria-label')||'').trim().slice(0,40),w:Math.round(r.width),h:Math.round(r.height)}}).filter(t=>t.w<${MIN}||t.h<${MIN}))`;

ab(['set', 'viewport', '1440', '900']);
ab(['open', toUrl(pos[0])]);
ab(['wait', '--load', 'networkidle'], { allowFail: true });
const desktop = runAxe();
let mobile = {};
if (doMobile) {
  ab(['set', 'viewport', mw, mh]);
  ab(['open', toUrl(pos[0])]);
  ab(['wait', '--load', 'networkidle'], { allowFail: true });
  mobile = runAxe();
}
const small = evalJs(targetsJs);

const all = [...(desktop.violations || []), ...(mobile.violations || [])];
const byId = new Map(); for (const v of all) if (!byId.has(v.id) || byId.get(v.id).count < v.count) byId.set(v.id, v);
const violations = [...byId.values()];
const count = (imp) => violations.filter((v) => v.impact === imp).reduce((n, v) => n + v.count, 0);
const contrast = violations.find((v) => v.id === 'color-contrast');
const summary = {
  measured: true, page: pos[0], axe: 'axe-core 4.10.2',
  critical: count('critical'), serious: count('serious'), moderate: count('moderate'), minor: count('minor'),
  contrast_failures: contrast ? contrast.count : 0,
  viewports: doMobile ? ['1440x900', `${mw}x${mh}`] : ['1440x900'], target_min_px: MIN,
  small_targets: Array.isArray(small) ? small.length : 'not measured',
  errors: [desktop.error, mobile.error].filter(Boolean),
};
const result = { summary, violations, small_targets: small, desktop_passes: desktop.passes, incomplete: desktop.incomplete };
if (opts.out) writeFileSync(opts.out, JSON.stringify(result, null, 2));
console.log(JSON.stringify(summary, null, 2));
for (const v of violations) console.log(`- [${v.impact}] ${v.id} x${v.count}: ${v.help}`);
if (Array.isArray(small)) for (const t of small.slice(0, 20)) console.log(`- small target ${t.w}x${t.h}: ${t.el} "${t.text}"`);
process.exit(summary.errors.length ? 1 : summary.critical + summary.serious + (Array.isArray(small) ? small.length : 0) > 0 ? 2 : 0);
