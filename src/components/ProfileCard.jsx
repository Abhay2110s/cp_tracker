import React, { useRef, useState, useEffect } from 'react';
import { User, Mail, Camera, Eye, X } from 'lucide-react';

export default function ProfileCard({ user = {} }) {
  const name = user.name || user.display_name || 'Abhay';
  const email = user.email || 'abhay@example.com';
  const initial = (name || email).charAt(0).toUpperCase();

  const [picture, setPicture] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const fileInputRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    return () => {
      if (picture) URL.revokeObjectURL(picture);
    };
  }, [picture]);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (cardRef.current && !cardRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (picture) URL.revokeObjectURL(picture);
    setPicture(URL.createObjectURL(file));
    setMenuOpen(false);
  };

  const handleAvatarClick = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleView = () => {
    setMenuOpen(false);
    if (picture) {
      setModalOpen(true);
    }
  };

  const handleChange = () => {
    setMenuOpen(false);
    fileInputRef.current?.click();
  };

  return (
    <div
      ref={cardRef}
      className="backdrop-blur-md bg-emerald-950/20 border border-emerald-900/50 p-6 rounded-3xl shadow-2xl flex flex-col items-center text-center relative"
    >
      {/* Avatar / Picture */}
      <div className="relative group">
        <button
          type="button"
          onClick={handleAvatarClick}
          className="relative w-24 h-24 rounded-full flex items-center justify-center overflow-hidden border-2 border-emerald-500/40 bg-emerald-900/40 text-emerald-300 text-4xl font-black shadow-[0_0_25px_rgba(16,185,129,0.15)] hover:border-emerald-400 transition-all active:scale-95"
        >
          {picture ? (
            <img src={picture} alt={name} className="w-full h-full object-cover" />
          ) : (
            <span>{initial}</span>
          )}
          <span className="absolute bottom-1 right-1 bg-emerald-600 rounded-full p-1.5 shadow-lg opacity-90 group-hover:opacity-100 transition-opacity">
            <Camera className="w-3.5 h-3.5 text-white" />
          </span>
        </button>

        {/* View / Change menu */}
        {menuOpen && (
          <div className="absolute left-1/2 -translate-x-1/2 top-28 z-20 w-40 bg-slate-900 border border-emerald-900 rounded-xl shadow-2xl overflow-hidden">
            <button
              type="button"
              onClick={handleView}
              disabled={!picture}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-900/40 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Eye className="w-4 h-4" /> View
            </button>
            <button
              type="button"
              onClick={handleChange}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-900/40 border-t border-emerald-900/50 transition-colors"
            >
              <Camera className="w-4 h-4" /> Change
            </button>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Image popup modal */}
      {modalOpen && picture && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-md"
          onClick={() => setModalOpen(false)}
        >
          <img
            src={picture}
            alt={name}
            className="w-full h-full object-cover"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            type="button"
            onClick={() => setModalOpen(false)}
            className="fixed top-4 right-4 z-50 bg-slate-900/80 hover:bg-slate-800 text-slate-300 rounded-full p-2.5 shadow-lg transition-colors border border-emerald-900"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Name */}
      <h3 className="mt-4 text-lg font-bold text-white flex items-center gap-2">
        <User className="w-4 h-4 text-emerald-400" />
        {name}
      </h3>

      {/* Email */}
      <p className="mt-1 text-xs text-slate-400 flex items-center gap-2 break-all">
        <Mail className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
        {email}
      </p>
    </div>
  );
}
