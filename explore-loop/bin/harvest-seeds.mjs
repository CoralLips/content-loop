#!/usr/bin/env node
// explore-loop/bin/harvest-seeds.mjs
// 扫 arxiv-loop 的 INDEX.md「已通过评估」区块，把评分 >=19 的论文的 arxiv ID 补进 seeds.md。
// 双源：INDEX.md + publish-queue/unpublished/*.md（后者用于兜底，防止最新终端草稿未入 INDEX）。
//
// 用法: node harvest-seeds.mjs [--threshold 19] [--dry-run]

import { readFile, writeFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = 'D:/Projects/content-loop';
const INDEX_PATH = `${ROOT}/arxiv-loop/queue/INDEX.md`;
const QUEUE_ROOT = `${ROOT}/arxiv-loop/queue`;
const UNPUBLISHED_ROOT = `${ROOT}/publish-queue/unpublished`;
const SEEDS_PATH = `${ROOT}/explore-loop/seeds.md`;

const args = { threshold: 19, dryRun: false };
for (let i = 2; i < process.argv.length; i++) {
  if (process.argv[i] === '--threshold') args.threshold = parseInt(process.argv[++i], 10);
  if (process.argv[i] === '--dry-run') args.dryRun = true;
}

const ARXIV_RE = /https?:\/\/arxiv\.org\/abs\/(\d{4}\.\d{4,5})/;
const SCORE_RE = /评估分[：:]\s*(\d+)/;

async function readExistingSeeds() {
  const content = await readFile(SEEDS_PATH, 'utf8');
  const ids = new Set();
  for (const line of content.split('\n')) {
    const m = line.match(/^\|\s*[⬜✅❄️⚠️]+\s*\|\s*([^|]+?)\s*\|/);
    if (m) ids.add(m[1].trim());
  }
  return { content, ids };
}

function parseBatchToDir(batch) {
  // "04-16 021-040" → "2026-04-16/batch-021-040"
  // "04-10" → "2026-04-10" (no subdir)
  // "04-12" → "2026-04-12"
  const parts = batch.trim().split(/\s+/);
  const date = `2026-${parts[0]}`;
  if (parts.length === 1) return date;
  return `${date}/batch-${parts[1]}`;
}

async function parseIndex() {
  const content = await readFile(INDEX_PATH, 'utf8');
  const lines = content.split('\n');
  const results = [];
  let inApproved = false;
  for (const line of lines) {
    if (line.startsWith('## 已通过评估')) { inApproved = true; continue; }
    if (inApproved && line.startsWith('## ')) { inApproved = false; continue; }
    if (!inApproved) continue;
    const m = line.match(/^\|\s*(\d+)\s*\|\s*([^|]+?)\s*\|\s*(\d+)\s*\|\s*([^|]+?)\s*\|/);
    if (m) {
      const score = parseInt(m[1], 10);
      if (score >= args.threshold) {
        results.push({ score, batch: m[2], num: m[3], title: m[4].trim() });
      }
    }
  }
  return results;
}

async function extractArxivFromQueue(entry) {
  const dir = parseBatchToDir(entry.batch);
  const file = `${QUEUE_ROOT}/${dir}/${entry.num}.md`;
  if (!existsSync(file)) return null;
  const content = await readFile(file, 'utf8');
  const m = content.match(ARXIV_RE);
  return m ? m[1] : null;
}

async function scanUnpublished() {
  if (!existsSync(UNPUBLISHED_ROOT)) return [];
  const files = await readdir(UNPUBLISHED_ROOT);
  const results = [];
  for (const f of files) {
    if (!f.endsWith('.md')) continue;
    const content = await readFile(`${UNPUBLISHED_ROOT}/${f}`, 'utf8');
    const scoreMatch = content.match(SCORE_RE);
    const arxivMatch = content.match(ARXIV_RE);
    if (!arxivMatch) continue;
    const score = scoreMatch ? parseInt(scoreMatch[1], 10) : 0;
    if (score < args.threshold) continue;
    const titleMatch = content.match(/^#\s+(.+)$/m);
    results.push({ score, arxiv: arxivMatch[1], title: titleMatch ? titleMatch[1].trim() : f, source: `unpub:${f}` });
  }
  return results;
}

function formatSeedRow(entry) {
  const { arxiv, score, title, source } = entry;
  const tag = source.startsWith('unpub:') ? `arxiv:score-${score}(unpub)` : `arxiv:score-${score}`;
  const shortTitle = title.length > 40 ? title.slice(0, 40) + '...' : title;
  return `| ⬜ | ${arxiv} | - | 0 | ${tag} | ${shortTitle} |`;
}

async function main() {
  const { content: seedsContent, ids: existing } = await readExistingSeeds();

  // Source 1: INDEX.md 已通过评估
  const indexEntries = await parseIndex();
  const indexWithArxiv = [];
  for (const e of indexEntries) {
    const arxiv = await extractArxivFromQueue(e);
    if (arxiv) indexWithArxiv.push({ arxiv, score: e.score, title: e.title, source: `index:${e.batch}:${e.num}` });
  }

  // Source 2: publish-queue/unpublished/ 兜底
  const unpubEntries = await scanUnpublished();

  // Merge + dedup (prefer higher score)
  const mergedMap = new Map();
  for (const e of [...indexWithArxiv, ...unpubEntries]) {
    const prev = mergedMap.get(e.arxiv);
    if (!prev || e.score > prev.score) mergedMap.set(e.arxiv, e);
  }

  const merged = [...mergedMap.values()];
  const newOnes = merged.filter(e => !existing.has(e.arxiv));

  console.log(`扫 INDEX 找到 ${indexEntries.length} 条 score>=${args.threshold}，${indexWithArxiv.length} 条能提取 arxiv`);
  console.log(`扫 unpublished 找到 ${unpubEntries.length} 条 score>=${args.threshold}`);
  console.log(`合并去重后 ${merged.length} 条，其中 ${newOnes.length} 条是 seeds.md 里没有的`);

  if (!newOnes.length) { console.log('种子池无需补充'); return; }

  if (args.dryRun) {
    console.log('\n[DRY-RUN] 将要追加的行：');
    newOnes.forEach(e => console.log('  ' + formatSeedRow(e)));
    return;
  }

  // Find the last table row in 种子池 section and append before the 自动维护机制 section
  const lines = seedsContent.split('\n');
  let insertAt = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('## 自动维护机制')) { insertAt = i; break; }
  }
  if (insertAt === -1) { console.error('找不到「自动维护机制」区块，seeds.md 结构异常'); process.exit(1); }
  // Back up to last non-empty line before section
  while (insertAt > 0 && lines[insertAt - 1].trim() === '') insertAt--;

  const newRows = newOnes.map(formatSeedRow);
  lines.splice(insertAt, 0, ...newRows, '');
  await writeFile(SEEDS_PATH, lines.join('\n'), 'utf8');

  console.log(`\n已补充 ${newOnes.length} 条种子到 seeds.md:`);
  newOnes.forEach(e => console.log(`  + ${e.arxiv}  [${e.score}]  ${e.title}`));
}

main().catch(e => { console.error('FATAL', e); process.exit(1); });
