import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getSupabaseClient } from '../lib/supabase';
import {
  Database,
  X,
  CheckCircle2,
  AlertCircle,
  Key,
  Shield,
  User,
  LogOut,
  Radio,
  Server,
  Zap
} from 'lucide-react';

export const SupabaseAuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    supabaseConnected,
    supabaseUrl,
    supabaseAnonKey,
    saveSupabaseConfig,
    currentUser,
    loginDemoUser,
    logoutUser,
  } = useApp();

  const [urlInput, setUrlInput] = useState(supabaseUrl);
  const [anonKeyInput, setAnonKeyInput] = useState(supabaseAnonKey);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Auth form states
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedback({ type: 'info', text: 'Testing Supabase connection...' });

    try {
      const res = await saveSupabaseConfig(urlInput, anonKeyInput);
      if (res.success) {
        setFeedback({ type: 'success', text: res.message });
      } else {
        setFeedback({ type: 'error', text: res.message });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', text: err?.message || 'Error configuring Supabase' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const client = getSupabaseClient();

    if (!client) {
      setFeedback({
        type: 'error',
        text: 'Please configure and save your Supabase Anon Key first to authenticate against the remote backend.',
      });
      return;
    }

    setAuthLoading(true);
    setFeedback(null);

    try {
      if (authMode === 'signin') {
        const { data, error } = await client.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        setFeedback({
          type: 'success',
          text: `Signed in as ${data.user?.email}`,
        });
      } else {
        const { data, error } = await client.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });
        if (error) throw error;
        setFeedback({
          type: 'success',
          text: 'Account created! Check your email for confirmation.',
        });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', text: err.message || 'Authentication failed' });
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200 animate-scaleIn my-6">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base font-display text-slate-900 leading-tight">
                Supabase Backend & Real-time
              </h3>
              <p className="text-xs text-slate-500">
                PostgreSQL database & Auth integration
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Connection Status Pill */}
          <div className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
            supabaseConnected
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : 'bg-amber-50 border-amber-300 text-amber-900'
          }`}>
            <div className="flex items-center gap-2">
              <Radio className={`w-4 h-4 ${supabaseConnected ? 'text-emerald-600 animate-pulse' : 'text-amber-600'}`} />
              <div>
                <p className="font-bold">
                  {supabaseConnected ? 'Supabase Cluster Connected' : 'Local-First Offline Fallback Active'}
                </p>
                <p className="text-[11px] opacity-80 truncate max-w-[280px]">
                  {urlInput}
                </p>
              </div>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
              supabaseConnected ? 'bg-emerald-200 text-emerald-800' : 'bg-amber-200 text-amber-800'
            }`}>
              {supabaseConnected ? 'Live' : 'Standby'}
            </span>
          </div>

          {/* Feedback banner */}
          {feedback && (
            <div className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
              feedback.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : feedback.type === 'error'
                ? 'bg-rose-50 text-rose-800 border border-rose-200'
                : 'bg-blue-50 text-blue-800 border border-blue-200'
            }`}>
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              )}
              <span>{feedback.text}</span>
            </div>
          )}

          {/* Current User Session Card */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Active Educator Profile
              </span>
              {currentUser && (
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-100 text-blue-800">
                  {currentUser.role}
                </span>
              )}
            </div>

            {currentUser ? (
              <div className="flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-900 text-sm">{currentUser.fullName}</p>
                  <p className="text-slate-500">{currentUser.email}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{currentUser.institution}</p>
                </div>
                <button
                  onClick={logoutUser}
                  className="px-2.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="text-center py-2">
                <p className="text-xs text-slate-600 mb-2">No user logged in currently.</p>
                <button
                  onClick={loginDemoUser}
                  className="px-3 py-1.5 bg-[#1d4ed8] text-white rounded-lg text-xs font-semibold hover:bg-[#1e40af] transition-colors"
                >
                  Quick Sign-In as CA Vikram Singhania
                </button>
              </div>
            )}
          </div>

          {/* Supabase Endpoint & Key Configuration */}
          <form onSubmit={handleSaveConfig} className="space-y-3 bg-white p-4 rounded-xl border border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-blue-600" />
              <span>Supabase Connection Settings</span>
            </h4>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Project URL
              </label>
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="w-full text-xs font-mono py-2 px-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="https://ffqhnccsayriiymnnsfe.supabase.co"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Supabase Public Anon Key
              </label>
              <input
                type="password"
                value={anonKeyInput}
                onChange={(e) => setAnonKeyInput(e.target.value)}
                className="w-full text-xs font-mono py-2 px-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Found in Supabase Dashboard &gt; Project Settings &gt; API &gt; Project API keys (anon public).
              </p>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <Key className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Connecting...' : 'Save & Connect Supabase'}</span>
            </button>
          </form>

          {/* Supabase Auth Form */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-blue-600" />
                <span>Supabase Cloud Auth</span>
              </h4>
              <div className="flex rounded-md p-0.5 bg-slate-200 text-xs">
                <button
                  type="button"
                  onClick={() => setAuthMode('signin')}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                    authMode === 'signin' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('signup')}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                    authMode === 'signup' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Sign Up
                </button>
              </div>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-2.5">
              {authMode === 'signup' && (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    placeholder="Prof. Anirudh Mehta"
                    className="w-full text-xs py-1.5 px-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              )}

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="educator@kineticcommerce.edu"
                  className="w-full text-xs py-1.5 px-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full text-xs py-1.5 px-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-2 bg-[#1d4ed8] hover:bg-[#1e40af] text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <span>{authLoading ? 'Authenticating...' : authMode === 'signin' ? 'Sign In to Supabase' : 'Create Supabase Account'}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 text-right">
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
