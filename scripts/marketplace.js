#!/usr/bin/env node
'use strict';
/**
 * validate: every folder of the repository is a plugin that Volath would accept.
 * build:    dist/<id>.zip for each plugin and dist/index.json (what a client can list).
 * Uses the plugin tool of the SDK: ../sdk (a checkout next to this repository), or @volath/sdk when installed.
 */
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = path.resolve(__dirname, '..');

function sdkCli() {
  const candidates = [path.join(root, '..', 'sdk', 'bin', 'volath-plugin.js'), path.join(root, '..', 'volath-sdk', 'bin', 'volath-plugin.js'), path.join(root, 'node_modules', '@volath', 'sdk', 'bin', 'volath-plugin.js')];
  const found = candidates.find((c) => fs.existsSync(c));
  if (!found) throw new Error('The SDK was not found. Clone https://github.com/volath/sdk next to this repository, or npm install @volath/sdk.');
  return found;
}

const plugins = () =>
  fs.readdirSync(root, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith('.') && !['node_modules', 'scripts', 'dist'].includes(d.name))
    .map((d) => d.name)
    .sort();

const run = (...args) => execFileSync('node', [sdkCli(), ...args], { stdio: 'pipe', encoding: 'utf8' });

function validate() {
  let bad = 0;
  for (const id of plugins()) {
    const file = path.join(root, id, 'plugin.json');
    if (!fs.existsSync(file)) { console.error(`FAIL ${id}: no plugin.json`); bad++; continue; }
    const manifest = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (manifest.id !== id) { console.error(`FAIL ${id}: the folder must be named like the plugin id ("${manifest.id}")`); bad++; continue; }
    try { run('validate', path.join(root, id)); console.log(`ok   ${id} ${manifest.version}`); } catch (err) { console.error(`FAIL ${id}: ${(err.stdout || err.message).toString().trim()}`); bad++; }
  }
  if (bad) process.exit(1);
}

function build() {
  validate();
  const dist = path.join(root, 'dist');
  fs.rmSync(dist, { recursive: true, force: true });
  fs.mkdirSync(dist);
  const index = [];
  for (const id of plugins()) {
    const manifest = JSON.parse(fs.readFileSync(path.join(root, id, 'plugin.json'), 'utf8'));
    const zipPath = path.join(dist, `${id}.zip`);
    run('pack', path.join(root, id), zipPath);
    // What Volath lists, and the checksum it verifies the download against before installing
    index.push({ id, name: manifest.name, version: manifest.version, description: manifest.description || '', author: manifest.author || 'Volath', homepage: manifest.homepage || '', permissions: manifest.permissions || {}, sha256: crypto.createHash('sha256').update(fs.readFileSync(zipPath)).digest('hex'), file: `${id}.zip` });
  }
  fs.writeFileSync(path.join(dist, 'index.json'), JSON.stringify({ plugins: index }, null, 2));
  console.log(`built ${index.length} plugins in dist/`);
}

const command = process.argv[2];
if (command === 'validate') validate();
else if (command === 'build') build();
else { console.error('usage: marketplace.js validate | build'); process.exit(2); }
