import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, 'data');

function fail(msg){
  console.error(`\n[FAIL] ${msg}`);
  process.exitCode = 1;
}

function ok(msg){
  console.log(`[OK] ${msg}`);
}

function readJSON(p){
  return JSON.parse(readFileSync(p, 'utf8'));
}

function isHttpUrl(s){
  return typeof s === 'string' && /^https?:\/\//i.test(s);
}

function validateDownloads(){
  const p = path.join(DATA_DIR, 'downloads.json');
  if (!existsSync(p)) return ok('downloads.json: not found (skip)');
  const j = readJSON(p);
  const keys = ['client', 'patch'];
  for (const k of keys){
    if (j[k] && j[k].url && !isHttpUrl(j[k].url)) fail(`downloads.json ${k}.url must be http(s)`);
  }
  ok('downloads.json: basic schema ok');
}

function validateCommunity(){
  const p = path.join(DATA_DIR, 'community.json');
  if (!existsSync(p)) return ok('community.json: not found (skip)');
  const j = readJSON(p);
  const keys = ['kakao', 'telegram', 'support'];
  for (const k of keys){
    if (j[k] && j[k].url && !isHttpUrl(j[k].url)) fail(`community.json ${k}.url must be http(s)`);
  }
  ok('community.json: basic schema ok');
}

function normalizeNotices(){
  const p = path.join(DATA_DIR, 'notices.json');
  if (!existsSync(p)) return ok('notices.json: not found (skip)');
  const arr = readJSON(p);
  if (!Array.isArray(arr)) fail('notices.json must be an array');

  const seen = new Set();
  for (const [i, n] of arr.entries()){
    if (!n || typeof n !== 'object') fail(`notices[${i}] must be an object`);
    if (!n.id || typeof n.id !== 'string') fail(`notices[${i}].id required`);
    if (seen.has(n.id)) fail(`duplicate id: ${n.id}`);
    seen.add(n.id);
    if (!n.title || typeof n.title !== 'string') fail(`notices[${i}].title required`);
    if (!n.date || typeof n.date !== 'string') fail(`notices[${i}].date required`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(n.date)) fail(`notices[${i}].date must be YYYY-MM-DD`);
  }

  // Sort newest-first by date, then id (stable across edits)
  const sorted = [...arr].sort((a,b) => {
    if (a.date !== b.date) return a.date < b.date ? 1 : -1;
    return (a.id || '').localeCompare(b.id || '');
  });

  // Only rewrite if order changes
  const changed = JSON.stringify(arr.map(x=>x.id)) !== JSON.stringify(sorted.map(x=>x.id));
  if (changed){
    writeFileSync(p, JSON.stringify(sorted, null, 2) + '\n', 'utf8');
    ok('notices.json: normalized (sorted)');
  } else {
    ok('notices.json: ok');
  }
}

console.log('Validating site data...');
validateDownloads();
validateCommunity();
normalizeNotices();

if (process.exitCode) {
  console.error('\nSome checks failed. Fix the above and re-run.');
} else {
  console.log('\nAll checks passed.');
}
