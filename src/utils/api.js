let cachedBase = null;

function candidatesFromWindow() {
  const list = [];
  try {
    const { origin, protocol, hostname } = window.location;
    // 1) Same origin (if reverse proxy exists)
    list.push(origin);
    // 2) Same host, port 8000
    list.push(`${protocol}//${hostname}:8000`);
    // 3) Modal-style "-api" host variant
    if (hostname.includes('.')) {
      const parts = hostname.split('.');
      if (parts[0] && !parts[0].endsWith('-api')) {
        const apiHost = parts[0] + '-api.' + parts.slice(1).join('.');
        list.push(`${protocol}//${apiHost}`);
      }
    }
  } catch (_) {}
  return list;
}

async function tryFetch(base, path, options) {
  const url = `${base}${path.startsWith('/') ? path : '/' + path}`;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), 6000);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const ct = res.headers.get('content-type') || '';
    if (!ct.includes('application/json')) throw new Error('Not JSON');
    const data = await res.json();
    clearTimeout(id);
    return { ok: true, data, base };
  } catch (e) {
    clearTimeout(id);
    return { ok: false, error: e };
  }
}

export async function getBackendBase() {
  if (cachedBase) return cachedBase;
  const env = import.meta.env.VITE_BACKEND_URL;
  const cands = [];
  if (env) cands.push(env.replace(/\/$/, ''));
  cands.push(...candidatesFromWindow());
  // Deduplicate
  const seen = new Set();
  const uniques = cands.filter((u) => {
    if (!u || seen.has(u)) return false;
    seen.add(u);
    return true;
  });
  // Probe root path
  for (const base of uniques) {
    const r = await tryFetch(base, '/', { method: 'GET', headers: { 'Content-Type': 'application/json' } });
    if (r.ok) {
      cachedBase = base;
      return base;
    }
  }
  // Fallback to first candidate or localhost:8000
  cachedBase = env || 'http://localhost:8000';
  return cachedBase;
}

export async function fetchJSON(path, options = {}) {
  const base = await getBackendBase();
  // First try with resolved base
  let r = await tryFetch(base, path, options);
  if (r.ok) return r.data;
  // If failed, try other candidates as fallback
  const env = import.meta.env.VITE_BACKEND_URL;
  const cands = [];
  if (env && env !== base) cands.push(env.replace(/\/$/, ''));
  for (const c of candidatesFromWindow()) {
    if (c && c !== base) cands.push(c);
  }
  const seen = new Set([base]);
  for (const c of cands) {
    if (seen.has(c)) continue;
    seen.add(c);
    r = await tryFetch(c, path, options);
    if (r.ok) {
      cachedBase = c;
      return r.data;
    }
  }
  throw new Error('All backend endpoints unreachable');
}
