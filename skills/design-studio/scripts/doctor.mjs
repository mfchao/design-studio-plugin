#!/usr/bin/env node
/* Checks Design Studio dependencies.  node doctor.mjs [--quiet] */
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';
import { AB } from './_ab.mjs';

const quiet = process.argv.includes('--quiet');
const H = homedir();
const run = (cmd, args) => { const r = spawnSync(cmd, args, { encoding: 'utf8', timeout: 20000 }); return r.error ? null : (r.stdout || r.stderr).trim(); };
const checks = [];
const add = (name, ok, detail, fix, required = false) => checks.push({ name, ok, detail, fix, required });

const [maj, min] = process.versions.node.split('.').map(Number);
add('Node >= 22.13', maj > 22 || (maj === 22 && min >= 13), process.version, 'Install Node 22.13+ (awwwards-mcp and tasteskill need it)', true);
const abv = AB && run(AB, ['--version']);
add('agent-browser', !!abv, abv || 'not found', 'npm install --prefix ~/.design-studio/tools agent-browser && ~/.design-studio/tools/node_modules/.bin/agent-browser install', true);
add('npx', !!run('npx', ['--version']), 'npm npx', 'Install npm', true);
const cook = [join(H, '.agents/skills/cook/SKILL.md'), join(H, '.claude/skills/cook/SKILL.md')].find(existsSync);
add('cook skill', !!cook, cook || 'not found', 'npx skills add Leonxlnx/cook (optional: playbooks already embed its loop)');
const taste = [join(H, '.agents/skills/design-taste-frontend/SKILL.md'), join(H, '.claude/skills/design-taste-frontend/SKILL.md')].find(existsSync);
add('tasteskill', !!taste, taste || 'not found', 'Install tasteskill from tasteskill.dev (optional: enables copy-lint and palette/type library)');

async function net(url) { try { const r = await fetch(url, { method: 'GET', signal: AbortSignal.timeout(8000) }); return r.status < 500; } catch { return false; } }
add('Inspo MCP endpoint', await net('https://inspomcp.dev/api/mcp'), 'https://inspomcp.dev/api/mcp', 'Check network; Section 2/4 fall back to web search');
add('cdnjs (axe-core)', await net('https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.2/axe.min.js'), 'axe-core 4.10.2', 'Check network; axe.mjs needs it');
add('awwwards-mcp package', !!run('npm', ['view', 'awwwards-mcp', 'version']), 'npm registry', 'Check network; Section 4 falls back to Inspo + web');

const bad = checks.filter((c) => !c.ok);
for (const c of checks) if (!quiet || !c.ok) console.log(`${c.ok ? 'OK  ' : c.required ? 'FAIL' : 'WARN'}  ${c.name.padEnd(22)} ${c.detail}${c.ok ? '' : `\n      fix: ${c.fix}`}`);
if (quiet && !bad.length) console.log('design-studio doctor: all OK');
process.exit(bad.some((c) => c.required) ? 1 : 0);
