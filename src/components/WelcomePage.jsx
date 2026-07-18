import React from 'react';
import { ArrowRight, Sparkles, LogIn, UserPlus } from 'lucide-react';

export default function WelcomePage({ onNavigate }) {
  // Enforcing the deep black & neon green theme natively
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-[#05070c] text-white selection:bg-emerald-500 selection:text-black">
      
      {/* ========================================================================== */}
      {/* CYBERPUNK DIGITAL BACKGROUND EFFECTS                                       */}
      {/* ========================================================================== */}
      
      {/* 1. Digital Matrix Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-screen"
        style={{
          backgroundImage: `linear-gradient(#22c55e 1px, transparent 1px), 
                            linear-gradient(90deg, #22c55e 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
        }}
      />

      {/* 2. Concentric Tech Radial Vignette */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-[#05070c] pointer-events-none" />

      {/* 3. High-Intensity Neon Green Ambient Glow Orbs */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 md:w-[500px] h-80 md:h-[500px] rounded-full bg-emerald-500/[0.08] blur-[100px] md:blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-10 left-10 w-48 h-48 rounded-full bg-emerald-600/[0.03] blur-[80px] pointer-events-none" />

      {/* ========================================================================== */}
      {/* CONTENT HERO LAYER                                                         */}
      {/* ========================================================================== */}
      <div className="w-full max-w-2xl text-center space-y-8 px-4 relative z-10">
        
        {/* Cyber Neon Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-emerald-500/20 bg-emerald-950/20 text-emerald-400 text-xs font-mono tracking-widest uppercase backdrop-blur-md shadow-[0_0_15px_rgba(16,185,129,0.05)]">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>SYSTEM // CORE_INITIALIZED</span>
        </div>

        {/* Hero Title Block */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-[1.05]">
            Track and Synchronize Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-500 to-green-400 drop-shadow-[0_0_30px_rgba(16,185,129,0.2)]">
              Platform Configurations
            </span>
          </h1>
          

        </div>

        {/* Structural Tech Spacer */}
        <div className="flex items-center justify-center gap-3 max-w-xs mx-auto opacity-30">
          <div className="h-[1px] w-full bg-emerald-950" />
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] shrink-0" />
          <div className="h-[1px] w-full bg-emerald-950" />
        </div>

        {/* Dual CTA Terminal Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-sm mx-auto pt-2">
          
          {/* Sign In / Log In Button (Hollow Cyber Border) */}
          <button
            onClick={() => onNavigate?.('login')}
            className="w-full sm:w-1/2 flex items-center justify-center gap-2.5 font-mono font-bold text-xs uppercase py-3 px-5 rounded-xl border border-emerald-500/20 bg-emerald-950/10 text-emerald-400 transition-all hover:bg-emerald-950/30 hover:border-emerald-500/40 active:scale-[0.98] backdrop-blur-sm"
          >
            <LogIn className="w-4 h-4 text-emerald-500" />
            Sign In
          </button>

          {/* New Account Registration Button (Solid High-Contrast Green) */}
          <button
            onClick={() => onNavigate?.('register')}
            className="w-full sm:w-1/2 flex items-center justify-center gap-2.5 bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] text-black font-mono font-black text-xs uppercase py-3 px-5 rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.25)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] group relative overflow-hidden"
          >
            <UserPlus className="w-4 h-4" />
            <span>Register Account</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
          
        </div>

      </div>


    </div>
  );
}