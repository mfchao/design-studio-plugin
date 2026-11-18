// Shared helpers: run agent-browser in an isolated session, parse --json eval output.
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, delimiter } from 'node:path';

// Find agent-browser: $AGENT_BROWSER_BIN, then PATH, then the private install in ~/.design-studio/tools.
export function findAgentBrowser() {
  if (process.env.AGENT_BROWSER_BIN && existsSync(process.env.AGENT_BROWSER_BIN)) return process.env.AGENT_BROWSER_BIN;
  for (const d of (process.env.PATH || '').split(delimiter)) { const p = join(d, 'agent-browser'); if (d && existsSync(p)) return p; }
  const local = join(homedir(), '.design-studio/tools/node_modules/.bin/agent-browser');
  return existsSync(local) ? local : null;
}
export const AB = findAgentBrowser();

export const SESSION = process.env.DS_BROWSER_SESSION || 'design-studio';

// agent-browser runs a background daemon that resolves relative paths against ITS cwd,
// so make screenshot/download output paths absolute.
export function absolutize(args) {
  const a = [...args];
  if (a[0] === 'screenshot') {
    for (let i = 1; i < a.length; i++) {
      if (a[i] === '--screenshot-dir') { if (a[i + 1]) a[i + 1] = resolve(a[i + 1]); i++; continue; }
      if (!a[i].startsWith('-') && /\.(png|jpe?g|webp)$/i.test(a[i])) a[i] = resolve(a[i]);
    }
  }
  return a;
}

export function ab(args, { json = false, allowFail = false } = {}) {
  args = absolutize(args);
  const full = ['--session', SESSION, ...(json ? ['--json'] : []), ...args];
  if (!AB) die('agent-browser not found. Install: npm install --prefix ~/.design-studio/tools agent-browser && ~/.design-studio/tools/node_modules/.bin/agent-browser install');
  const r = spawnSync(AB, full, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  if (r.error) {
    if (r.error.code === 'ENOENT') die('agent-browser not found. Install: npm i -g agent-browser && agent-browser install');
    throw r.error;
  }
  if (r.status !== 0 && !allowFail) die(`agent-browser ${args.join(' ')} failed:\n${r.stderr || r.stdout}`);
  return r.stdout.trim();
}

export function evalJs(js) {
  const out = ab(['eval', js], { json: true });
  try {
    const parsed = JSON.parse(out);
    const v = parsed?.data?.result ?? parsed?.result ?? parsed;
    return typeof v === 'string' ? tryParse(v) : v;
  } catch { return tryParse(out); }
}

function tryParse(s) { try { return JSON.parse(s); } catch { return s; } }

export const toUrl = (p) => (/^https?:\/\//.test(p) ? p : pathToFileURL(resolve(p)).href);

export function die(msg, code = 1) { process.stderr.write(msg + '\n'); process.exit(code); }

export function parseArgs(argv, flags = {}) {
  const opts = {}, pos = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const k = a.slice(2);
      if (flags[k] === 'bool') opts[k] = true; else opts[k] = argv[++i];
    } else pos.push(a);
  }
  return { opts, pos };
}
