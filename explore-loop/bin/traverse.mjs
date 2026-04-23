#!/usr/bin/env node
// explore-loop/bin/traverse.mjs
// 给定种子（arxiv ID 或 DOI），从 OpenAlex 抓取引用图，返回 Top-N 候选（JSON 输出供 Claude 消费）。
//
// 用法：
//   node traverse.mjs --seed <arxiv_id_or_doi> [--direction refs|cites|both] [--top 8] [--year-min 2010]
//
// 输出：stdout 一份 JSON，含 seed 元数据 + 候选列表（含 abstract、OA URL、引用数）。

const EMAIL = 'lcy15986724942@gmail.com';

function parseArgs() {
  const args = { seed: null, direction: 'refs', top: 8, yearMin: 2010, classicThreshold: 3000 };
  for (let i = 2; i < process.argv.length; i++) {
    const k = process.argv[i];
    const v = process.argv[i + 1];
    if (k === '--seed') { args.seed = v; i++; }
    else if (k === '--direction') { args.direction = v; i++; }
    else if (k === '--top') { args.top = parseInt(v, 10); i++; }
    else if (k === '--year-min') { args.yearMin = parseInt(v, 10); i++; }
    else if (k === '--classic-threshold') { args.classicThreshold = parseInt(v, 10); i++; }
  }
  if (!args.seed) { console.error('missing --seed'); process.exit(2); }
  return args;
}

async function fetchJson(url) {
  const res = await fetch(url, { headers: { 'User-Agent': `mailto:${EMAIL}` } });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${url.slice(0, 90)}`);
  return res.json();
}

function normalizeSeed(s) {
  if (/^\d{4}\.\d{4,5}$/.test(s)) return `doi:10.48550/arXiv.${s}`;
  if (s.startsWith('10.')) return `doi:${s}`;
  if (s.startsWith('https://openalex.org/')) return s.replace('https://openalex.org/', '');
  if (/^W\d+$/.test(s)) return s;
  return `doi:${s}`;
}

function reconstructAbstract(inv) {
  if (!inv) return null;
  const positions = [];
  for (const [word, posList] of Object.entries(inv)) {
    for (const p of posList) positions.push([p, word]);
  }
  positions.sort((a, b) => a[0] - b[0]);
  return positions.map(x => x[1]).join(' ');
}

function extractSeed(w) {
  return {
    id: w.id,
    title: w.title,
    doi: w.doi,
    year: w.publication_year,
    citations: w.cited_by_count,
    oa_url: w.open_access?.oa_url || null,
    is_oa: w.open_access?.is_oa || false,
    abstract: reconstructAbstract(w.abstract_inverted_index),
    primary_topic: w.primary_topic?.display_name || null,
    field: w.primary_topic?.field?.display_name || null,
    authors: (w.authorships || []).slice(0, 3).map(a => a.author?.display_name).filter(Boolean),
    referenced_works: w.referenced_works || [],
    cited_by_api_url: w.cited_by_api_url,
  };
}

async function getSeed(normalizedId) {
  const select = 'id,title,cited_by_count,open_access,referenced_works,doi,publication_year,abstract_inverted_index,primary_topic,authorships,cited_by_api_url';
  const isOAId = /^W\d+$/.test(normalizedId);
  const url = isOAId
    ? `https://api.openalex.org/works/${normalizedId}?select=${select}`
    : `https://api.openalex.org/works/${normalizedId}?select=${select}`;
  return fetchJson(url);
}

async function batchFetch(openalexIds, selectFields) {
  const trimmed = openalexIds.map(u => u.replace('https://openalex.org/', ''));
  const chunks = [];
  for (let i = 0; i < trimmed.length; i += 50) chunks.push(trimmed.slice(i, i + 50));
  const all = [];
  for (const c of chunks) {
    const url = `https://api.openalex.org/works?filter=ids.openalex:${c.join('|')}&select=${selectFields}&per_page=50`;
    const r = await fetchJson(url);
    all.push(...(r.results || []));
  }
  return all;
}

async function getCitedBy(citedByApiUrl, top) {
  if (!citedByApiUrl) return [];
  // Fetch the top-cited papers that cite this seed, limited to top*3 for filtering slack
  const select = 'id,title,cited_by_count,open_access,doi,publication_year,abstract_inverted_index,primary_topic,authorships';
  const url = `${citedByApiUrl}&select=${select}&per-page=${Math.min(top * 3, 50)}&sort=cited_by_count:desc`;
  try {
    const r = await fetchJson(url);
    return r.results || [];
  } catch (e) { return []; }
}

function filterAndRank(candidates, args) {
  const passed = candidates.filter(r => {
    if (!r.title) return false;
    const year = r.publication_year;
    const cites = r.cited_by_count || 0;
    if (year && year < args.yearMin && cites < args.classicThreshold) return false;
    return true;
  });
  return passed.sort((a, b) => (b.cited_by_count || 0) - (a.cited_by_count || 0)).slice(0, args.top);
}

function extractCandidate(w) {
  return {
    id: w.id,
    title: w.title,
    doi: w.doi,
    year: w.publication_year,
    citations: w.cited_by_count,
    oa_url: w.open_access?.oa_url || null,
    is_oa: w.open_access?.is_oa || false,
    abstract: reconstructAbstract(w.abstract_inverted_index)?.slice(0, 1200) || null,
    field: w.primary_topic?.field?.display_name || null,
    topic: w.primary_topic?.display_name || null,
    authors: (w.authorships || []).slice(0, 3).map(a => a.author?.display_name).filter(Boolean),
  };
}

(async () => {
  const args = parseArgs();
  const normalizedId = normalizeSeed(args.seed);
  const seedRaw = await getSeed(normalizedId);
  const seed = extractSeed(seedRaw);

  const result = { seed, args, direction_used: null, candidates: [], notes: [] };

  const select = 'id,title,cited_by_count,open_access,doi,publication_year,abstract_inverted_index,primary_topic,authorships';

  const tryRefs = async () => {
    if (!seed.referenced_works.length) return null;
    const full = await batchFetch(seed.referenced_works, select);
    const ranked = filterAndRank(full, args);
    return ranked;
  };

  const tryCites = async () => {
    const full = await getCitedBy(seedRaw.cited_by_api_url, args.top);
    const ranked = filterAndRank(full, args);
    return ranked;
  };

  if (args.direction === 'refs' || args.direction === 'both') {
    const r = await tryRefs();
    if (r && r.length) {
      result.direction_used = 'refs';
      result.candidates = r.map(extractCandidate);
    } else {
      result.notes.push('refs empty or all filtered out');
    }
  }

  if ((args.direction === 'cites' || args.direction === 'both') && !result.candidates.length) {
    const c = await tryCites();
    if (c && c.length) {
      result.direction_used = 'cites';
      result.candidates = c.map(extractCandidate);
    } else {
      result.notes.push('cites empty or all filtered out');
    }
  }

  // Fallback: if still empty and direction was refs-only, auto-try cites
  if (!result.candidates.length && args.direction === 'refs') {
    const c = await tryCites();
    if (c && c.length) {
      result.direction_used = 'cites (auto-fallback)';
      result.candidates = c.map(extractCandidate);
    }
  }

  console.log(JSON.stringify(result, null, 2));
})().catch(e => { console.error(JSON.stringify({ error: e.message, stack: e.stack })); process.exit(1); });
