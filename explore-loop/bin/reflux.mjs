#!/usr/bin/env node
// explore-loop/bin/reflux.mjs
// Lineage 合成后，把候选里「引用 > 500 且 prov+1 <= MAX_DEPTH 且不在 seeds.md」的补回 seeds.md。
//
// 用法:
//   node reflux.mjs --parent-prov 0 --source lineage-003 --candidates "W12345,10.1016/xxx,2201.11903"
//
// 退出码 0 = 成功（含「无需回流」），非 0 = 错误

import { readFile, writeFile } from 'node:fs/promises';

const SEEDS_PATH = 'D:/Projects/content-loop/explore-loop/seeds.md';
const EMAIL = 'lcy15986724942@gmail.com';
const CITATION_THRESHOLD = 500;
const MAX_DEPTH = 5;

const args = { parentProv: 0, source: 'unknown', candidates: [], dryRun: false };
for (let i = 2; i < process.argv.length; i++) {
  const k = process.argv[i];
  if (k === '--parent-prov') args.parentProv = parseInt(process.argv[++i], 10);
  else if (k === '--source') args.source = process.argv[++i];
  else if (k === '--candidates') args.candidates = process.argv[++i].split(',').map(s => s.trim()).filter(Boolean);
  else if (k === '--dry-run') args.dryRun = true;
}

if (!args.candidates.length) { console.log('无候选传入，跳过'); process.exit(0); }

const newProv = args.parentProv + 1;
if (newProv > MAX_DEPTH) {
  console.log(`父 prov=${args.parentProv}，回流后 ${newProv} 超过 MAX_DEPTH=${MAX_DEPTH}，跳过`);
  process.exit(0);
}

function normalizeId(s) {
  if (/^\d{4}\.\d{4,5}$/.test(s)) return { type: 'arxiv', api: `doi:10.48550/arXiv.${s}`, display: s };
  if (s.startsWith('10.')) return { type: 'doi', api: `doi:${s}`, display: s };
  if (/^W\d+$/.test(s)) return { type: 'openalex', api: s, display: s };
  if (s.startsWith('https://openalex.org/')) {
    const id = s.replace('https://openalex.org/', '');
    return { type: 'openalex', api: id, display: id };
  }
  return { type: 'unknown', api: s, display: s };
}

async function fetchMeta(normalized) {
  const url = `https://api.openalex.org/works/${normalized.api}?select=id,title,cited_by_count,doi,publication_year,primary_topic`;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': `mailto:${EMAIL}` } });
    if (!res.ok) return null;
    const w = await res.json();
    return {
      display: normalized.display,
      openalex_id: w.id?.replace('https://openalex.org/', '') || null,
      title: w.title,
      citations: w.cited_by_count || 0,
      year: w.publication_year,
      field: w.primary_topic?.field?.display_name || null,
      doi: w.doi?.replace('https://doi.org/', '') || null,
    };
  } catch { return null; }
}

async function readSeedsExisting() {
  const content = await readFile(SEEDS_PATH, 'utf8');
  const ids = new Set();
  for (const line of content.split('\n')) {
    const m = line.match(/^\|\s*[⬜✅❄️⚠️]+\s*\|\s*([^|]+?)\s*\|/);
    if (m) ids.add(m[1].trim());
  }
  return { content, ids };
}

function pickSeedKey(meta, normalized) {
  // Prefer: arxiv-ish DOI → just the arxiv ID; else DOI; else OpenAlex ID
  if (meta.doi?.startsWith('10.48550/arxiv.')) return meta.doi.replace('10.48550/arxiv.', '');
  if (normalized.type === 'arxiv') return normalized.display;
  if (meta.doi) return meta.doi;
  return meta.openalex_id || normalized.display;
}

function formatRow(key, meta) {
  const shortTitle = meta.title && meta.title.length > 40 ? meta.title.slice(0, 40) + '...' : (meta.title || '-');
  return `| ⬜ | ${key} | ${meta.citations} | ${newProv} | ${args.source} | ${shortTitle} |`;
}

async function main() {
  const { content: seedsContent, ids: existing } = await readSeedsExisting();
  const refluxed = [], rejected = [];

  for (const raw of args.candidates) {
    const norm = normalizeId(raw);
    const meta = await fetchMeta(norm);
    if (!meta) { rejected.push({ raw, reason: 'OpenAlex 404' }); continue; }
    if (meta.citations <= CITATION_THRESHOLD) { rejected.push({ raw, reason: `引用 ${meta.citations} <= ${CITATION_THRESHOLD}` }); continue; }
    const key = pickSeedKey(meta, norm);
    if (existing.has(key)) { rejected.push({ raw, reason: '已在 seeds.md' }); continue; }
    refluxed.push({ key, meta });
    existing.add(key);
  }

  console.log(`候选 ${args.candidates.length} 条 → 回流 ${refluxed.length} 条，过滤 ${rejected.length} 条`);
  rejected.forEach(r => console.log(`  - ${r.raw}：${r.reason}`));
  if (!refluxed.length) return;

  console.log(`\n回流到 seeds.md（prov=${newProv}, source=${args.source}）:`);
  refluxed.forEach(r => console.log(`  + ${r.key}  [${r.meta.citations}]  ${r.meta.title}`));
  if (args.dryRun) { console.log('\n[DRY-RUN] 未写入'); return; }

  // Insert before 自动维护机制 section
  const lines = seedsContent.split('\n');
  let insertAt = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('## 自动维护机制')) { insertAt = i; break; }
  }
  if (insertAt === -1) { console.error('找不到「自动维护机制」区块'); process.exit(1); }
  while (insertAt > 0 && lines[insertAt - 1].trim() === '') insertAt--;

  const newRows = refluxed.map(r => formatRow(r.key, r.meta));
  lines.splice(insertAt, 0, ...newRows, '');
  await writeFile(SEEDS_PATH, lines.join('\n'), 'utf8');
  console.log('已写入 seeds.md');
}

main().catch(e => { console.error('FATAL', e); process.exit(1); });
