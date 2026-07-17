import React, { useState } from 'react';
import { CheckCircle2, Link2, Edit3, X } from 'lucide-react';

export default function PlatformConnections({ connections, setConnections }) {
  const [activePlatform, setActivePlatform] = useState(null);
  const [tempName, setTempName] = useState('');

  const confirmUsername = (platform) => {
    setConnections(prev => ({
      ...prev,
      [platform]: { name: tempName, verified: true }
    }));
    setActivePlatform(null);
  };

  return (
    <div className="backdrop-blur-md bg-emerald-950/20 border border-emerald-900/50 p-6 rounded-3xl shadow-2xl relative">
      <h3 className="text-emerald-400 font-bold text-xs uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
        <Link2 size={16} /> Platform Connections
      </h3>

      <div className="flex flex-col gap-3">
        {Object.entries(connections).map(([platform, data]) => (
          <div key={platform} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl border border-emerald-900/30">
            <span className="text-sm font-semibold text-emerald-100">{platform}</span>
            <button 
              onClick={() => setActivePlatform(platform)}
              className={`flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                data.verified ? 'text-emerald-400' : 'text-slate-500 hover:text-emerald-400'
              }`}
            >
              {data.verified ? (<>Verified <CheckCircle2 size={14} /></>) : (<>Connect <Edit3 size={14} /></>)}
            </button>
          </div>
        ))}
      </div>

      {activePlatform && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-sm rounded-3xl p-6">
          <div className="bg-slate-900 border border-emerald-500/50 p-6 rounded-2xl w-full max-w-xs shadow-2xl">
            <h4 className="text-emerald-400 font-bold mb-4">Connect {activePlatform}</h4>
            <input autoFocus className="w-full bg-slate-950 border border-emerald-900 rounded-xl p-3 text-white mb-4 outline-none focus:border-emerald-500" 
                   placeholder="Enter username" onChange={(e) => setTempName(e.target.value)} />
            <div className="flex gap-2">
              <button onClick={() => setActivePlatform(null)} className="flex-1 py-2 text-xs text-slate-400 hover:text-white">Cancel</button>
              <button onClick={() => confirmUsername(activePlatform)} className="flex-1 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}