#!/usr/bin/env node
/**
 * 同步三端版本号（frontend / backend / desktop）
 * 用法: node scripts/sync-version.mjs 0.10.0
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const version = process.argv[2];

if (!version || !/^\d+\.\d+\.\d+/.test(version)) {
  console.error('用法: node scripts/sync-version.mjs <版本号>');
  console.error('示例: node scripts/sync-version.mjs 0.10.0');
  process.exit(1);
}

const targets = ['frontend', 'backend', 'desktop'];
const results = [];

for (const dir of targets) {
  const pkgPath = join(root, dir, 'package.json');
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
  pkg.version = version;
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
  results.push(`  ✓ ${dir}/package.json → ${version}`);
}

// desktop tauri.conf.json
try {
  const tauriPath = join(root, 'desktop', 'src-tauri', 'tauri.conf.json');
  const tauri = JSON.parse(readFileSync(tauriPath, 'utf8'));
  tauri.version = version;
  writeFileSync(tauriPath, JSON.stringify(tauri, null, 2) + '\n');
  results.push(`  ✓ desktop/src-tauri/tauri.conf.json → ${version}`);
} catch {}

// desktop Cargo.toml
try {
  const cargoPath = join(root, 'desktop', 'src-tauri', 'Cargo.toml');
  let cargo = readFileSync(cargoPath, 'utf8');
  cargo = cargo.replace(/^version\s*=\s*"[^"]*"/m, `version = "${version}"`);
  writeFileSync(cargoPath, cargo);
  results.push(`  ✓ desktop/src-tauri/Cargo.toml → ${version}`);
} catch {}

console.log(`✅ 版本已同步至 ${version}:`);
results.forEach(r => console.log(r));
console.log('');
console.log('后续步骤:');
console.log('  1. git add -A && git commit -m "chore: bump to ' + version + '"');
console.log('  2. 更新 CHANGELOG.md');
console.log('  3. git tag v' + version);
