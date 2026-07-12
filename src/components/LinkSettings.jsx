import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Link2, Save, CheckCircle, Image } from 'lucide-react';

export default function LinkSettings({ user, onUpdateSuccess }) {
  const [lc, setLc] = useState(user.leetcodeUrl || '');
  const [cf, setCf] = useState(user.codeforcesUrl || '');
  const [gfg, setGfg] = useState(user.gfgUrl || '');
  const [avatar, setAvatar] = useState(user.avatarUrl || '');
  
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const handleUpdateProfiles = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg('');

    const { error } = await supabase
      .from('profiles')
      .update({
        leetcode_url: lc || null,
        codeforces_url: cf || null,
        gfg_url: gfg || null,
        avatar_url: avatar || null
      })
      .eq('id', user.id);

    setSaving(false);
    if (!error) {
      setStatusMsg('Metrics and profile settings updated!');
      if (onUpdateSuccess) onUpdateSuccess();
      setTimeout(() => setStatusMsg(''), 3000);
    } else {
      setStatusMsg('Error: ' + error.message);
    }
  };

  return (
    <div className="bg-[#141922] border border-gray-800 rounded-xl p-6 shadow-xl w-full mb-6">
      <div className="flex items-center gap-2 border-b border-gray-800 pb-3 mb-4">
        <Link2 className="w-5 h-5 text-cyan-400" />
        <h3 className="text-base font-semibold text-white">Dashboard Synchronizer & Customization</h3>
      </div>

      <form onSubmit={handleUpdateProfiles} className="space-y-4">
        {/* Cleaned layout containing 4 equal width columns instead of 5 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-[11px] font-mono text-gray-400 mb-1.5">LeetCode URL</label>
            <input type="url" placeholder="https://leetcode.com/u/user" value={lc} onChange={(e) => setLc(e.target.value)} className="w-full bg-[#161b22] text-xs text-gray-200 rounded-lg p-2.5 border border-gray-800 focus:outline-none focus:border-cyan-500" />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-gray-400 mb-1.5">Codeforces URL</label>
            <input type="url" placeholder="https://codeforces.com/profile/user" value={cf} onChange={(e) => setCf(e.target.value)} className="w-full bg-[#161b22] text-xs text-gray-200 rounded-lg p-2.5 border border-gray-800 focus:outline-none focus:border-cyan-500" />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-gray-400 mb-1.5">GeeksforGeeks URL</label>
            <input type="url" placeholder="https://www.geeksforgeeks.org/user/user" value={gfg} onChange={(e) => setGfg(e.target.value)} className="w-full bg-[#161b22] text-xs text-gray-200 rounded-lg p-2.5 border border-gray-800 focus:outline-none focus:border-cyan-500" />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-gray-400 mb-1.5 flex items-center gap-1">
              <Image className="w-3 h-3 text-cyan-400" /> Custom Avatar URL
            </label>
            <input type="url" placeholder="https://images.com/my-pic.jpg" value={avatar} onChange={(e) => setAvatar(e.target.value)} className="w-full bg-[#161b22] text-xs text-gray-200 rounded-lg p-2.5 border border-gray-800 focus:outline-none focus:border-cyan-500" />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-800/40">
          <p className="text-xs text-emerald-400 font-medium">{statusMsg}</p>
          <button type="submit" disabled={saving} className="bg-cyan-600 hover:bg-cyan-500 text-white font-medium px-4 py-2 rounded-lg text-xs transition-all flex items-center gap-1.5 cursor-pointer">
            <Save className="w-3.5 h-3.5" />
            {saving ? 'Syncing...' : 'Save Updates'}
          </button>
        </div>
      </form>
    </div>
  );
}