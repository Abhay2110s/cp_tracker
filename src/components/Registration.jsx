import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Eye, EyeOff, Lock, Mail, User, Loader2, UserPlus, ArrowLeft } from 'lucide-react';

export default function Registration({ onNavigate }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
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
        setSuccess(true);
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 text-slate-100 font-sans relative overflow-hidden">
      {/* Immersive Dark & Neon Green Glowing Background Blurs */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-emerald-950/20 border border-emerald-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-green-900/15 border border-green-500/5 blur-[120px] pointer-events-none" />

      {/* Main Glassmorphism Card */}
      <div className="w-full max-w-md border border-slate-800 bg-slate-900/60 p-8 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl relative z-10">
        
        {/* Back Button */}
        <button 
          onClick={() => onNavigate('welcome')} 
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 mb-6 transition-colors group bg-transparent border-none p-0 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 transform group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Home</span>
        </button>

        {/* Header Text */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white tracking-tight">Create Account</h2>
          <p className="text-sm text-slate-400 mt-1">Please fill out your details to sign up.</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 mb-4 text-xs font-semibold rounded-xl border border-red-900/50 bg-red-950/30 text-red-400">
            {error}
          </div>
        )}

        {success ? (
          <div className="text-center py-6 space-y-4">
            <div className="p-3.5 text-xs font-semibold rounded-xl border border-emerald-900/50 bg-emerald-950/30 text-emerald-400 shadow-sm">
              Registration Successful!
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Account created. Please check your verification email to confirm your details.
            </p>
            <button
              onClick={() => onNavigate('login')}
              className="mt-2 text-sm font-semibold text-emerald-400 hover:text-emerald-300 bg-transparent border-none p-0 cursor-pointer outline-none hover:underline"
            >
              Go to Sign In &rarr;
            </button>
          </div>
        ) : (
          /* Form layout matching the dynamic inputs setup */
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Abhay"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-sm text-slate-200 placeholder-slate-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all shadow-inner"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-sm text-slate-200 placeholder-slate-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all shadow-inner"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-sm text-slate-200 placeholder-slate-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-300 transition-colors bg-transparent border-none cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-sm text-slate-200 placeholder-slate-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-300 transition-colors bg-transparent border-none cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-800/50 text-slate-950 font-bold text-sm py-2.5 rounded-xl transition-all shadow-[0_4px_20px_rgba(16,185,129,0.2)] hover:shadow-[0_4px_25px_rgba(16,185,129,0.3)] active:scale-[0.98] cursor-pointer mt-4 border-none"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
              Sign Up
            </button>
          </form>
        )}

        {/* Footer Link */}
        {!success && (
          <div className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{' '}
            <button 
              onClick={() => onNavigate('login')} 
              className="text-emerald-400 font-semibold hover:text-emerald-300 bg-transparent border-none p-0 cursor-pointer outline-none hover:underline"
            >
              Sign In
            </button>
          </div>
        )}

      </div>
    </div>
  );
}