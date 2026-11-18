#!/usr/bin/env node
// Pass-through to agent-browser wherever it is installed (PATH or ~/.design-studio/tools).
//   node ab.mjs <agent-browser args...>     e.g. node ab.mjs open https://example.com
import { spawnSync } from 'node:child_process';
import { AB, die, absolutize } from './_ab.mjs';
if (!AB) die('agent-browser not found; run node doctor.mjs for the install command');
const r = spawnSync(AB, absolutize(process.argv.slice(2)), { stdio: 'inherit' });
process.exit(r.status ?? 1);
