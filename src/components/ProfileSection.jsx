import React, { useState, useEffect } from 'react';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Award, TrendingUp } from 'lucide-react';

export default function ProfileSection({ initialHandle }) {
  const [cfData, setCfData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Sample historical rating progression tailored to look exactly like the dashboard graph
  const ratingHistory = [
    { name: 'Jan', rating: 1500 },
    { name: 'Feb', rating: 1650 },
    { name: 'Mar', rating: 1620 },
    { name: 'Apr', rating: 1800 },
    { name: 'May', rating: 1950 },
    { name: 'Jun', rating: 2100 },
    { name: 'Jul', rating: 2350 },
  ];

  useEffect(() => {
    async function fetchCFProfile() {
      try {
        setLoading(true);
        setError('');
        const res = await fetch(`https://codeforces.com/api/user.info?handles=${initialHandle}`);
        const data = await res.json();
        
        if (data.status === 'OK') {
          setCfData(data.result[0]);
        } else {
          setError('Codeforces handle profile not found.');
        }
      } catch (err) {
        setError('Failed to sync live metrics from Codeforces.');
      } finally {
        setLoading(false);
      }
    }
    
    if (initialHandle) fetchCFProfile();
  }, [initialHandle]);

  // Assigns authentic rank colors matching competitive programming standard layouts
  const getRankColor = (rank) => {
    if (!rank) return 'text-gray-400';
    const r = rank.toLowerCase();
    if (r.includes('grandmaster')) return 'text-red-500 border-red-500/20 bg-red-500/10';
    if (r.includes('master')) return 'text-orange-400 border-orange-400/20 bg-orange-400/10';
    if (r.includes('candidate')) return 'text-violet-400 border-violet-400/20 bg-violet-400/10';
    if (r.includes('expert')) return 'text-blue-400 border-blue-400/20 bg-blue-400/10';
    if (r.includes('specialist')) return 'text-cyan-400 border-cyan-400/20 bg-cyan-400/10';
    return 'text-green-400 border-green-400/20 bg-green-400/10';
  };

  if (loading) return <div className="h-72 bg-[#141922] border border-gray-800 rounded-xl flex items-center justify-center text-cyan-400 text-sm font-mono animate-pulse">Syncing Codeforces profile configurations...</div>;
  if (error) return <div className="h-72 bg-[#141922] border border-gray-800 rounded-xl flex items-center justify-center text-red-400 text-sm font-medium px-4 text-center">⚠️ {error}</div>;

  return (
    <div className="bg-[#141922] border border-gray-800/60 rounded-xl p-6 shadow-xl relative overflow-hidden h-full flex flex-col justify-between">
      {/* Background Subtle Accent Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* User Header Stats */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
        <div className="flex items-center gap-4">
          <img 
            src={cfData?.titlePhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'} 
            alt="Profile Avatar" 
            className="w-16 h-16 rounded-xl border-2 border-gray-800 object-cover bg-[#161b22]"
          />
          <div>
            <h2 className="text-xl font-bold tracking-wide text-white">{cfData?.handle || initialHandle}</h2>
            <div className="text-3xl font-black mt-0.5 tracking-tight text-red-500 flex items-baseline gap-1.5">
              {cfData?.rating || 'N/A'}
              <span className="text-[10px] font-semibold text-gray-500 tracking-wider uppercase">Current Rating</span>
            </div>
          </div>
        </div>
        
        <div className="sm:text-right space-y-2">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getRankColor(cfData?.rank)}`}>
            • {cfData?.rank || 'Unrated'}
          </span>
          <div className="text-xs text-gray-400 space-y-0.5">
            <p>Max Rating: <span className="text-gray-200 font-mono font-medium">{cfData?.maxRating || '0'}</span></p>
            <p>Global Position: <span className="text-gray-200 font-mono font-medium">#125</span></p>
          </div>
        </div>
      </div>

      {/* Line Chart Component Area */}
      <div className="h-44 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={ratingHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis dataKey="name" stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} />
            <YAxis stroke="#4b5563" fontSize={10} domain={['dataMin - 100', 'dataMax + 100']} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#161b22', borderColor: '#374151', borderRadius: '8px' }}
              labelStyle={{ color: '#9ca3af', fontSize: '11px' }}
              itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
            />
            <Line 
              type="monotone" 
              dataKey="rating" 
              stroke="#ef4444" 
              strokeWidth={3} 
              activeDot={{ r: 6, stroke: '#0f1319', strokeWidth: 2 }} 
              dot={{ stroke: '#38bdf8', strokeWidth: 2, r: 4, fill: '#141922' }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}