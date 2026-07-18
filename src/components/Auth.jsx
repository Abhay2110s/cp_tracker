import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Eye, EyeOff, Lock, Mail, User, Loader2, LogIn, UserPlus, ArrowLeft } from 'lucide-react';

export default function Auth({ onNavigate }) {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (error) throw error;
        onNavigate('dashboard');
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              display_name: formData.name,
            },
          },
        });
        if (error) throw error;

        if (data?.session) {
          onNavigate('dashboard');
        } else {
          setError('Account created successfully! Please check your email for confirmation.');
          setMode('login');
        }
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 text-slate-800 font-sans relative overflow-hidden">
      
      {/* Decorative background ambient shapes */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-emerald-200/30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-teal-200/30 blur-3xl pointer-events-none" />

      {/* Main Glassmorphism Card Container */}
      <div className="w-full max-w-md border border-white/60 bg-white/70 p-8 rounded-2xl shadow-[0_8px_32px_0_rgba(16,185,129,0.08)] backdrop-blur-xl relative z-10 transition-all duration-300">
        
        {/* Simple navigation back to welcome view */}
        <button 
          onClick={() => onNavigate('welcome')} 
          className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 hover:text-emerald-700 mb-6 group transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 transform group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Home</span>
        </button>

        {/* Header Branding Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {mode === 'login' 
              ? 'Sign in to access your health planner data dashboard.' 
              : 'Sign up to initialize your profile details.'}
          </p>
        </div>

        {/* Interactive Error Alert Banner */}
        {error && (
          <div className="p-3.5 mb-4 text-xs font-semibold rounded-xl border border-red-200 bg-red-50 text-red-600 animate-fade-in">
            {error}
          </div>
        )}

        <form onSubmit={handleAuthSubmit} className="space-y-4">
          
          {/* Form Input Block: Full Operator Name (Rendered exclusively for Register Mode) */}
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  name="name"
                  required={mode === 'register'}
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Abhay"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white/50 text-sm placeholder:text-slate-400 text-slate-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all shadow-sm"
                />
              </div>
            </div>
          )}

          {/* Form Input Block: Account Email Address */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white/50 text-sm placeholder:text-slate-400 text-slate-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all shadow-sm"
              />
            </div>
          </div>

          {/* Form Input Block: Security Account Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-white/50 text-sm placeholder:text-slate-400 text-slate-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all shadow-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Primary Interactive Processing Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm py-2.5 rounded-xl transition-all disabled:opacity-50 tracking-wide shadow-md shadow-emerald-600/10 active:scale-[0.98] cursor-pointer mt-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : mode === 'login' ? (
              <LogIn className="w-4 h-4" />
            ) : (
              <UserPlus className="w-4 h-4" />
            )}
            {mode === 'login' ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        {/* Dynamic Mode Navigation Text Footer */}
        <div className="mt-6 text-center text-sm text-slate-500">
          {mode === 'login' ? (
            <>
              Don't have an account?{' '}
              <button 
                onClick={() => { setMode('register'); setError(''); }} 
                className="text-emerald-600 font-semibold hover:text-emerald-700 bg-transparent border-none p-0 cursor-pointer outline-none hover:underline"
              >
                Sign up now
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button 
                onClick={() => { setMode('login'); setError(''); }} 
                className="text-emerald-600 font-semibold hover:text-emerald-700 bg-transparent border-none p-0 cursor-pointer outline-none hover:underline"
              >
                Sign in instead
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
}