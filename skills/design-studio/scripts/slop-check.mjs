#!/usr/bin/env node
/*
  Anti-slop check for UI files. Merges three detectors:
    1. Impeccable   (npx -y impeccable detect --json)       deterministic design anti-pattern rules
    2. taste copy-lint (tasteskill, if installed)           model-written copy tells
    3. built-in ban list (cook + taste rules, see references/slop.md)
  Usage: node slop-check.mjs <file|dir> [...] [--json] [--no-impeccable] [--no-taste]
  Exit 0 clean (advisories allowed), 2 primary findings, 1 a detector could not run on a target.
*/
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, extname, resolve } from 'node:path';
import { homedir } from 'node:os';
import { spawnSync } from 'node:child_process';

const argv = process.argv.slice(2);
const flag = (f) => argv.includes(f);
const targets = argv.filter((a) => !a.startsWith('--'));
if (!targets.length) { console.error('usage: slop-check.mjs <file|dir> [...] [--json] [--no-impeccable] [--no-taste]'); process.exit(2); }

const EXT = new Set(['.html', '.htm', '.css', '.jsx', '.tsx', '.vue', '.svelte']);
const files = [];
const walk = (p) => {
  const s = statSync(p);
  if (s.isDirectory()) { for (const f of readdirSync(p)) if (!f.startsWith('.') && f !== 'node_modules') walk(join(p, f)); }
  else if (EXT.has(extname(p).toLowerCase())) files.push(resolve(p));
};
for (const t of targets) { if (!existsSync(t)) { console.error(`not found: ${t}`); process.exit(1); } walk(t); }

const findings = []; // {source, file, rule, severity: 'primary'|'advisory', message}
const notes = [];
let hardFail = false;

// 1. Impeccable
if (!flag('--no-impeccable')) {
  const r = spawnSync('npx', ['-y', 'impeccable', 'detect', '--json', ...files], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, timeout: 300000 });
  if (r.error || r.status === 1 || r.status === null) {
    notes.push(`impeccable did not run cleanly (${r.error?.message || (r.stderr || '').split('\n')[0] || 'exit ' + r.status}); ban-list results only`);
    if (r.status === 1) hardFail = true;
  } else {
    try {
      const arr = JSON.parse(r.stdout || '[]');
      for (const f of Array.isArray(arr) ? arr : arr.findings || []) {
        findings.push({
          source: 'impeccable', file: f.file || f.path || f.target || '', line: f.line,
          rule: f.rule || f.id || f.ruleId || 'rule',
          severity: /advis|info|hint/i.test(String(f.severity || f.level || '')) ? 'advisory' : 'primary',
          message: f.message || f.description || f.title || '',
        });
      }
    } catch { notes.push('impeccable output was not JSON; raw: ' + (r.stdout || '').slice(0, 300)); }
  }
}

// 2. taste copy-lint
if (!flag('--no-taste')) {
  const lint = [join(homedir(), '.agents/skills/design-taste-frontend/scripts/copy-lint.mjs'), join(homedir(), '.claude/skills/design-taste-frontend/scripts/copy-lint.mjs')].find(existsSync);
  const htmls = files.filter((f) => /\.html?$/i.test(f));
  if (lint && htmls.length) {
    const r = spawnSync(process.execPath, [lint, ...htmls, '--json'], { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
    try {
      const out = JSON.parse(r.stdout);
      const list = Array.isArray(out) ? out : out.files || out.results || [out];
      for (const fr of list) for (const it of fr.findings || fr.items || fr.results || []) {
        const lvl = String(it.sev || it.level || it.severity || '').toUpperCase();
        if (lvl === 'PASS') continue;
        const msg = [it.msg || it.message || it.text || '', it.fix ? `fix: ${it.fix}` : ''].filter(Boolean).join(' | ');
        findings.push({ source: 'taste-copy', file: fr.file || '', rule: it.id || it.rule || 'copy', severity: lvl === 'FAIL' ? 'primary' : 'advisory', message: msg });
      }
    } catch { if (r.status === 1) findings.push({ source: 'taste-copy', file: htmls.join(','), rule: 'copy-lint', severity: 'primary', message: (r.stdout || '').slice(0, 400) }); }
  } else if (!lint) notes.push('tasteskill copy-lint not found; copy tells checked by ban list only');
}

// 3. Built-in ban list
const SLOP_WORDS = ['elevate', 'unlock', 'seamless', 'seamlessly', 'supercharge', 'revolutionize', 'revolutionise', 'empower', 'effortless', 'effortlessly', 'game-changer', 'game changer', 'cutting-edge', 'next-level', 'unleash', "in today's fast-paced", 'harness the power', 'take your .* to the next level', 'lorem ipsum'];
const rules = [
  { id: 'purple-gradient', sev: 'primary', re: /(linear|radial|conic)-gradient\([^;{}]*?(#(?:7c3aed|8b5cf6|a855f7|9333ea|6d28d9|7e22ce|a78bfa|c084fc|6366f1|818cf8)|\bpurple\b|\bviolet\b|rebeccapurple|indigo)/i, msg: 'purple/violet/indigo gradient' },
  { id: 'gradient-text', sev: 'primary', re: /(-webkit-)?background-clip\s*:\s*text/i, msg: 'gradient text (background-clip:text)' },
  { id: 'transition-all', sev: 'primary', re: /transition(-property)?\s*:\s*all\b/i, msg: 'transition: all' },
  { id: 'bounce-easing', sev: 'primary', re: /cubic-bezier\(\s*[-\d.]+\s*,\s*(-0?\.[3-9]\d*|1\.[1-9]\d*|[2-9](\.\d+)?)\s*,|cubic-bezier\([^)]*,\s*(1\.[1-9]\d*|[2-9](\.\d+)?)\s*\)|\b(bounce|elastic)\w*\b(?=[^{}]*(animation|transition|ease))/i, msg: 'bounce/elastic/overshoot easing' },
  { id: 'glow-orb', sev: 'advisory', re: /filter\s*:\s*blur\(\s*([4-9]\d|\d{3,})px/i, msg: 'large blur (glowing orb / blob background?)' },
  { id: 'glassmorphism', sev: 'advisory', re: /backdrop-filter\s*:\s*blur/i, msg: 'backdrop blur (decorative glassmorphism?)' },
  { id: 'mono-uppercase', sev: 'primary', test: (css) => (css.match(/\{[^{}]*\}/g) || []).some((b) => /text-transform\s*:\s*uppercase/i.test(b) && /font-family\s*:[^;]*mono/i.test(b)), msg: 'monospace uppercase text' },
  { id: 'counter-labels', sev: 'primary', test: (_, txt, raw) => (raw.match(/>\s*0[1-9]\.?\s*</g) || []).length >= 3, msg: '01 / 02 / 03 counters' },
  { id: 'em-dash', sev: 'primary', test: (_, txt) => /—|&mdash;/.test(txt), msg: 'em dash in visible copy' },
];
const strip = (s) => s.replace(/<!--[\s\S]*?-->/g, ' ').replace(/<(script|style|noscript|template)[\s\S]*?<\/\1>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
for (const f of files) {
  const raw = readFileSync(f, 'utf8');
  const isHtml = /\.html?$/i.test(f);
  const css = isHtml ? (raw.match(/<style[\s\S]*?<\/style>/gi) || []).join('\n') + '\n' + (raw.match(/style="[^"]*"/gi) || []).map((s) => `{${s.slice(7, -1)}}`).join('\n') : raw;
  const txt = isHtml ? strip(raw) : '';
  for (const r of rules) {
    const hit = r.re ? r.re.test(css) : r.test(css, txt, raw.replace(/<!--[\s\S]*?-->/g, ''));
    if (hit) findings.push({ source: 'ban-list', file: f, rule: r.id, severity: r.sev, message: r.msg });
  }
  if (txt) for (const w of SLOP_WORDS) {
    const m = txt.match(new RegExp(`\\b${w}\\b`, 'i'));
    if (m) findings.push({ source: 'ban-list', file: f, rule: 'slop-copy', severity: 'primary', message: `slop phrase: "${m[0]}"` });
  }
}

const primary = findings.filter((f) => f.severity === 'primary');
const report = { clean: primary.length === 0 && !hardFail, primary: primary.length, advisory: findings.length - primary.length, files: files.length, notes, findings };
if (flag('--json')) console.log(JSON.stringify(report, null, 2));
else {
  console.log(`slop-check: ${files.length} file(s), ${primary.length} primary, ${report.advisory} advisory${report.clean ? ' -> CLEAN' : ''}`);
  for (const n of notes) console.log(`  note: ${n}`);
  for (const f of findings) console.log(`  [${f.severity === 'primary' ? 'FIX' : 'adv'}] ${f.source}/${f.rule} ${f.file.replace(process.cwd() + '/', '')}${f.line ? ':' + f.line : ''}  ${f.message}`);
}
process.exit(hardFail ? 1 : primary.length ? 2 : 0);
