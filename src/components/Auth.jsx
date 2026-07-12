import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Mail, Lock, User } from 'lucide-react';

export default function Auth() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (isSignup) {
      const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
      
      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      if (authData.user) {
        const { error: profileError } = await supabase.from('profiles').insert([
          { 
            id: authData.user.id, 
            name: name,
            leetcode_url: null,
            codeforces_url: null,
            gfg_url: null,
            github_url: null
          }
        ]);
        if (profileError) setError(profileError.message);
      }
    } else {
      const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
      if (loginError) setError(loginError.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0f1319] flex items-center justify-center p-4">
      <form onSubmit={handleAuthSubmit} className="w-full max-w-md bg-[#141922] p-8 rounded-xl border border-gray-800 space-y-4 shadow-2xl">
        <h2 className="text-2xl font-bold text-white text-center">{isSignup ? 'Create Account' : 'Welcome Back'}</h2>
        {error && <p className="text-red-400 text-xs bg-red-500/10 p-2.5 rounded-lg border border-red-500/20">{error}</p>}
        
        {isSignup && (
          <div className="relative">
            <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-[#161b22] text-sm text-gray-200 rounded-lg p-2.5 pl-10 border border-gray-800 focus:outline-none focus:border-cyan-500" required />
            <User className="absolute left-3 top-3 text-gray-500 w-4 h-4" />
          </div>
        )}
        
        <div className="relative">
          <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#161b22] text-sm text-gray-200 rounded-lg p-2.5 pl-10 border border-gray-800 focus:outline-none focus:border-cyan-500" required />
          <Mail className="absolute left-3 top-3 text-gray-500 w-4 h-4" />
        </div>

        <div className="relative">
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-[#161b22] text-sm text-gray-200 rounded-lg p-2.5 pl-10 border border-gray-800 focus:outline-none focus:border-cyan-500" required />
          <Lock className="absolute left-3 top-3 text-gray-500 w-4 h-4" />
        </div>
        
        <button type="submit" disabled={loading} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-medium py-2.5 rounded-lg text-sm transition-all cursor-pointer">
          {loading ? 'Processing...' : isSignup ? 'Register Account' : 'Login'}
        </button>

        <p className="text-xs text-center text-gray-400 mt-4">
          {isSignup ? 'Have an account?' : "Need an account?"} 
          <button type="button" onClick={() => setIsSignup(!isSignup)} className="text-cyan-400 ml-1 hover:underline cursor-pointer">{isSignup ? 'Login' : 'Sign Up'}</button>
        </p>
      </form>
    </div>
  );
}