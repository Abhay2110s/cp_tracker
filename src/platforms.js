// Real platform data fetchers.
// Each function takes a username and returns a normalized object:
//   { username, solved, activeDays, bestStreak, activity: [{date, count}] }
// Activity is returned as an array of { date: Date, count: number } entries.
//
// All requests are routed through the local Vite dev proxy (see vite.config.js)
// at `/api/proxy?url=...` to avoid browser CORS restrictions. In production you
// should replace this with your own backend / Supabase Edge Function.

const PLATFORM_COLORS = {
  LeetCode: '#f97316',
  CodeChef: '#e11d48',
  Codeforces: '#3b82f6',
  HackerRank: '#10b981',
  GFG: '#8b5cf6',
};

export function getPlatformColor(platform) {
  return PLATFORM_COLORS[platform] || '#10b981';
}

const DAY = 24 * 60 * 60 * 1000;

// Build an empty 365-day activity array ending today.
function emptyActivity() {
  const out = [];
  const today = new Date();
  for (let i = 364; i >= 0; i--) {
    const d = new Date(today.getTime() - i * DAY);
    out.push({ date: d, count: 0 });
  }
  return out;
}

function addActivity(activity, submissions) {
  for (const s of submissions) {
    const key = new Date(s.date).toDateString();
    const found = activity.find((a) => a.date.toDateString() === key);
    if (found) found.count += s.count;
  }
  return activity;
}

// Safe fetch through the dev proxy. Never throws; returns null on failure.
async function proxyFetch(targetUrl) {
  try {
    const res = await fetch(`/api/proxy?url=${encodeURIComponent(targetUrl)}`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

// ----------------------------- LeetCode -----------------------------
async function fetchLeetCode(username) {
  const activity = emptyActivity();
  let solved = 0;
  let activeDays = 0;
  let bestStreak = 0;

  // Working community API (the old herokuapp/calendar endpoints are dead).
  const solvedData = await proxyFetch(
    `https://alfa-leetcode-api.onrender.com/${encodeURIComponent(username)}/solved`
  );
  if (solvedData) {
    solved = solvedData.solvedProblem || solvedData.totalSolved || 0;
  }

  const cal = await proxyFetch(
    `https://alfa-leetcode-api.onrender.com/${encodeURIComponent(username)}/calendar`
  );
  if (cal) {
    bestStreak = cal.streak || 0;
    activeDays = cal.totalActiveDays || 0;
    let calendar = cal.submissionCalendar;
    if (typeof calendar === 'string') {
      try {
        calendar = JSON.parse(calendar);
      } catch {
        calendar = null;
      }
    }
    if (calendar && typeof calendar === 'object') {
      const entries = Object.entries(calendar).map(([ts, count]) => ({
        date: new Date(Number(ts) * 1000),
        count,
      }));
      addActivity(activity, entries);
    }
  }

  return { username, solved, activeDays, bestStreak, activity };
}

// ----------------------------- Codeforces -----------------------------
async function fetchCodeforces(username) {
  const activity = emptyActivity();
  let solved = 0;
  let activeDays = 0;

  const d = await proxyFetch(
    `https://codeforces.com/api/user.status?handle=${encodeURIComponent(
      username
    )}&from=1&count=1000`
  );
  if (d?.status === 'OK' && Array.isArray(d.result)) {
    for (const sub of d.result) {
      if (sub.verdict === 'OK') solved++;
      const dayKey = new Date(sub.creationTimeSeconds * 1000).toDateString();
      activeDays += 1;
      const existing = activity.find((a) => a.date.toDateString() === dayKey);
      if (existing) existing.count += 1;
    }
  }

  return { username, solved, activeDays, bestStreak: 0, activity };
}

// ----------------------------- CodeChef -----------------------------
async function fetchCodeChef(username) {
  const activity = emptyActivity();
  let solved = 0;
  let activeDays = 0;

  const d = await proxyFetch(
    `https://codechef-api.vercel.app/handle/${encodeURIComponent(username)}`
  );
  if (d) {
    solved = d.solved || 0;
    activeDays = d.activity?.fully || 0;
    if (Array.isArray(d.activity?.heatMap)) {
      const entries = d.activity.heatMap.map((h) => ({
        date: new Date(h.date),
        count: h.value || 0,
      }));
      addActivity(activity, entries);
    }
  }

  return { username, solved, activeDays, bestStreak: 0, activity };
}

// ----------------------------- HackerRank -----------------------------
async function fetchHackerRank(username) {
  const activity = emptyActivity();
  let solved = 0;

  const d = await proxyFetch(
    `https://www.hackerrank.com/rest/contests/master/hackers/${encodeURIComponent(
      username
    )}/profile`
  );
  if (d?.models?.current_company_stats) {
    solved = d.models.current_company_stats.total_solved || 0;
  }

  return { username, solved, activeDays: 0, bestStreak: 0, activity };
}

// ----------------------------- GeeksforGeeks -----------------------------
async function fetchGFG(username) {
  const activity = emptyActivity();
  let solved = 0;

  const d = await proxyFetch(
    `https://geeksforgeeks-api.vercel.app/${encodeURIComponent(username)}`
  );
  if (d) {
    solved = d.info?.totalProblemsSolved || 0;
    if (Array.isArray(d.solvedStats?.problemSolved)) {
      const entries = d.solvedStats.problemSolved.map((p) => ({
        date: new Date(p.date),
        count: p.count || 0,
      }));
      addActivity(activity, entries);
    }
  }

  return { username, solved, activeDays: 0, bestStreak: 0, activity };
}

const FETCHERS = {
  LeetCode: fetchLeetCode,
  Codeforces: fetchCodeforces,
  CodeChef: fetchCodeChef,
  HackerRank: fetchHackerRank,
  GFG: fetchGFG,
};

// Fetch a single platform's data by username. Always resolves to a safe shape.
export async function fetchPlatformData(platform, username) {
  const fallback = {
    username: username || '',
    solved: 0,
    activeDays: 0,
    bestStreak: 0,
    activity: emptyActivity(),
  };
  const fetcher = FETCHERS[platform];
  if (!fetcher || !username) return { ...fallback, source: 'fallback' };
  try {
    const result = await fetcher(username);
    return {
      ...fallback,
      ...result,
      activity: Array.isArray(result?.activity) ? result.activity : fallback.activity,
      source: 'live',
    };
  } catch {
    return { ...fallback, source: 'fallback' };
  }
}

// Fetch all given connections in parallel.
// connections: { LeetCode: { name, verified }, ... }
export async function fetchAllPlatforms(connections) {
  const entries = Object.entries(connections).filter(
    ([, data]) => data.verified && data.name
  );
  const results = await Promise.all(
    entries.map(([platform, data]) =>
      fetchPlatformData(platform, data.name).then((stats) => [platform, stats])
    )
  );
  return Object.fromEntries(results);
}
