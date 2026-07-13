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

    // Integrity check ensuring security string parity
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-50 via-white to-emerald-50 text-slate-800 font-sans relative overflow-hidden">
      {/* Dynamic Background Accents identical to Welcome UI pattern */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-100/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-green-100/40 blur-3xl pointer-events-none" />

      {/* Structured Card container perfectly mirroring the size and look of the SignIn form layout */}
      <div className="w-full max-w-md border border-white bg-white/85 p-8 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.04)] backdrop-blur-md relative z-10">
        
        <button 
          onClick={() => onNavigate('welcome')} 
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 mb-6 transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 transform group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Home</span>
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Create Account</h2>
          <p className="text-sm text-slate-500 mt-1">Please fill out your details to sign up.</p>
        </div>

        {error && (
          <div className="p-3.5 mb-4 text-xs font-semibold rounded-xl border border-red-200 bg-red-50 text-red-600">
            {error}
          </div>
        )}

        {success ? (
          <div className="text-center py-6 space-y-4">
            <div className="p-3.5 text-xs font-semibold rounded-xl border border-green-200 bg-green-50 text-green-700 shadow-sm">
              Registration Successful!
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Account created. Please check your verification email to confirm your details.
            </p>
            <button
              onClick={() => onNavigate('login')}
              className="mt-2 text-sm font-semibold text-emerald-600 hover:underline bg-transparent border-none p-0 cursor-pointer outline-none"
            >
              Go to Sign In &rarr;
            </button>
          </div>
        ) : (
          <form onSubmit={handleSignUp} className="space-y-4">
            
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Abhay"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all shadow-sm"
                />
              </div>
            </div>

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
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all shadow-sm"
                />
              </div>
            </div>

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
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all shadow-sm"
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

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm py-2.5 rounded-xl transition-all shadow-md active:scale-[0.98] cursor-pointer mt-4"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
              Sign Up
            </button>
          </form>
        )}

        {!success && (
          <div className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <button 
              onClick={() => onNavigate('login')} 
              className="text-emerald-600 font-semibold hover:text-emerald-700 bg-transparent border-none p-0 cursor-pointer outline-none hover:underline"
            >
              Sign In
            </button>
          </div>
        )}

      </div>
    </div>
  );
}