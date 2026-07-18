import React, { useState } from 'react';
import { CheckCircle2, Link2, Edit3, Loader2, AlertCircle } from 'lucide-react';
import { fetchPlatformData } from '../platforms';

// Derive the platform handle from either a raw username or a full profile URL.
function extractHandle(platform, input) {
  const raw = (input || '').trim();
  if (!raw) return '';

  // If it doesn't look like a URL, treat it as the handle directly.
  if (!/^https?:\/\//i.test(raw)) return raw;

  try {
    const url = new URL(raw);
    const path = url.pathname.replace(/^\/+|\/+$/g, '');
    const segments = path.split('/').filter(Boolean);

    switch (platform) {
      case 'LeetCode':
        // https://leetcode.com/u/<handle>/  or  /abhay_2110/
        return segments[segments.length - 1] || '';
      case 'Codeforces':
        // https://codeforces.com/profile/<handle>
        return segments[segments.length - 1] || '';
      case 'CodeChef':
        // https://www.codechef.com/users/<handle>
        return segments[segments.length - 1] || '';
      case 'HackerRank':
        // https://www.hackerrank.com/profile/<handle>
        return segments[segments.length - 1] || '';
      case 'GFG':
        // https://www.geeksforgeeks.org/user/<handle>/
        return segments[segments.length - 1] || '';
      default:
        return segments[segments.length - 1] || raw;
    }
  } catch {
    return raw;
  }
}

export default function PlatformConnections({ 
  connections = {}, 
  setConnections, 
  onSelectPlatform, 
  currentFilter 
}) {
  const [activePlatform, setActivePlatform] = useState(null);
  const [tempName, setTempName] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');
  // Per-platform verification errors: { [platform]: 'message' }
  const [errors, setErrors] = useState({});

  const confirmUsername = async (platform) => {
    const handle = extractHandle(platform, tempName);
    if (!handle) return;

    setVerifying(true);
    setError('');
    try {
      const data = await fetchPlatformData(platform, handle);
      const hasData =
        data && (data.solved > 0 || (data.activity && data.activity.some((a) => a.count > 0)));
      if (!hasData) {
        const msg =
          data?.source === 'fallback'
            ? `Could not reach ${platform}. The stats service may be unavailable.`
            : `Could not verify "${handle}" on ${platform}. Check the profile link.`;
        setError(msg);
        setErrors((prev) => ({ ...prev, [platform]: msg }));
        setVerifying(false);
        return;
      }
      setErrors((prev) => {
        const next = { ...prev };
        delete next[platform];
        return next;
      });
      setConnections((prev) => ({
        ...prev,
        [platform]: { name: handle, verified: true },
      }));
      setActivePlatform(null);
      setTempName('');
    } catch {
      const msg = 'Verification failed. Please try again.';
      setError(msg);
      setErrors((prev) => ({ ...prev, [platform]: msg }));
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="backdrop-blur-md bg-emerald-950/20 border border-emerald-900/50 p-6 rounded-3xl shadow-2xl relative">
      <h3 className="text-emerald-400 font-bold text-xs uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
        <Link2 size={16} /> Platform Connections
      </h3>

      <div className="flex flex-col gap-3">
        {/* "All" Toggle — combined data of all verified platforms */}
        <button
          onClick={() => onSelectPlatform('All')}
          className={`p-3 text-center font-bold uppercase rounded-xl border transition-all ${
            currentFilter === 'All' 
              ? 'bg-emerald-900/40 border-emerald-500 text-emerald-400' 
              : 'bg-slate-900/50 border-emerald-900/30 text-slate-400 hover:border-emerald-500/40'
          }`}
        >
          All
        </button>

        {Object.entries(connections || {}).map(([platform, data]) => {
          const hasError = Boolean(errors[platform]);
          return (
          <div key={platform} className={`flex items-center justify-between p-3 bg-slate-900/50 rounded-xl border ${
            hasError ? 'border-rose-900/60' : 'border-emerald-900/30'
          }`}>
            <span className="flex items-center gap-2 text-sm font-semibold">
              {hasError && (
                <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e]" title={errors[platform]} />
              )}
              <span className={data.verified ? 'text-emerald-100' : hasError ? 'text-rose-300' : 'text-slate-600'}>
                {platform}
              </span>
            </span>

            <div className="flex items-center gap-2">
              {/* Only allow selection if verified */}
              {data.verified && (
                <button
                  onClick={() => onSelectPlatform(platform)}
                  className={`px-3 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                    currentFilter === platform
                      ? 'bg-emerald-600 border-emerald-500 text-white'
                      : 'border-emerald-900 text-emerald-500 hover:bg-emerald-900/20'
                  }`}
                >
                  Select
                </button>
              )}

              <button
                onClick={() => {
                  setTempName(data.name || '');
                  setError('');
                  setActivePlatform(platform);
                }}
                className={`flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  data.verified
                    ? 'text-emerald-400'
                    : hasError
                      ? 'text-rose-400 hover:text-rose-300'
                      : 'text-slate-500 hover:text-emerald-400'
                }`}
              >
                {data.verified ? (
                  <CheckCircle2 size={14} />
                ) : hasError ? (
                  <><AlertCircle size={14} /> Retry</>
                ) : (
                  <><Edit3 size={14} /> Connect</>
                )}
              </button>
            </div>
          </div>
          );
        })}
      </div>

      {/* Modal for Username */}
      {activePlatform && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-sm rounded-3xl p-6">
          <div className="bg-slate-900 border border-emerald-500/50 p-6 rounded-2xl w-full max-w-xs shadow-2xl">
            <h4 className="text-emerald-400 font-bold mb-4">Connect {activePlatform}</h4>
            <input 
              autoFocus 
              value={tempName}
              disabled={verifying}
              className="w-full bg-slate-950 border border-emerald-900 rounded-xl p-3 text-white mb-3 outline-none focus:border-emerald-500 disabled:opacity-60" 
              placeholder="Profile URL or username" 
              onChange={(e) => setTempName(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && confirmUsername(activePlatform)}
            />
            {error && (
              <p className="text-[11px] text-rose-400 mb-3">{error}</p>
            )}
            <div className="flex gap-2">
              <button onClick={() => setActivePlatform(null)} disabled={verifying} className="flex-1 py-2 text-xs text-slate-400 hover:text-white disabled:opacity-50">Cancel</button>
              <button onClick={() => confirmUsername(activePlatform)} disabled={verifying || !tempName.trim()} className="flex-1 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold disabled:opacity-50 flex items-center justify-center gap-1.5">
                {verifying ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                {verifying ? 'Verifying' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}