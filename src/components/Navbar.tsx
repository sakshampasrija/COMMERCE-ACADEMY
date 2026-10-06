import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Calendar,
  CheckCircle2,
  CreditCard,
  GraduationCap,
  Users,
  Database,
  Plus,
  X,
  FileSpreadsheet
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    batches,
    selectedBatchId,
    setSelectedBatchId,
    currentUser,
    supabaseConnected,
    setIsAuthModalOpen,
    setIsCreateBatchOpen,
    realtimeNotification,
    clearNotification,
  } = useApp();

  const selectedBatch = batches.find((b) => b.id === selectedBatchId);

  return (
    <>
      {/* Real-time broadcast flash notification */}
      {realtimeNotification && (
        <div className="bg-[#0037b0] text-white px-4 py-2 text-xs font-medium flex items-center justify-between border-b border-blue-800 transition-all">
          <div className="flex items-center gap-2 max-w-4xl mx-auto w-full">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="font-semibold uppercase tracking-wider text-[10px] bg-blue-900/60 px-1.5 py-0.5 rounded">
              Kinetic Sync
            </span>
            <span className="truncate">{realtimeNotification}</span>
          </div>
          <button
            onClick={clearNotification}
            className="p-1 hover:bg-blue-800 rounded transition-colors text-white/80 hover:text-white"
            aria-label="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Bar Contract: Zone 1 (Single Brand element) - Zone 2 (4-6 Nav links) - Zone 3 (1-2 Primary actions) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('batches')}
              className="text-left group flex items-center gap-2.5 focus:outline-none"
            >
              <div className="w-8 h-8 rounded-lg bg-[#1d4ed8] text-white flex items-center justify-center font-bold text-base shadow-sm">
                CF
              </div>
              <span className="font-display font-bold text-lg sm:text-xl tracking-tight text-slate-900 group-hover:text-[#1d4ed8] transition-colors">
                ClassFlow Kinetic
              </span>
            </button>
          </div>

          {/* Zone 2: 4-6 clean text navigation links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => setActiveTab('batches')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'batches'
                  ? 'bg-blue-50 text-[#1d4ed8] font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Calendar className="w-4 h-4 text-slate-500" />
              <span>Batches</span>
            </button>

            <button
              onClick={() => setActiveTab('attendance')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'attendance'
                  ? 'bg-blue-50 text-[#1d4ed8] font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-slate-500" />
              <span>Attendance</span>
            </button>

            <button
              onClick={() => setActiveTab('fees')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'fees'
                  ? 'bg-blue-50 text-[#1d4ed8] font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <CreditCard className="w-4 h-4 text-slate-500" />
              <span>Fees & Ledgers</span>
            </button>

            <button
              onClick={() => setActiveTab('students')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'students'
                  ? 'bg-blue-50 text-[#1d4ed8] font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Users className="w-4 h-4 text-slate-500" />
              <span>Students</span>
            </button>

            <button
              onClick={() => setActiveTab('tests')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'tests'
                  ? 'bg-blue-50 text-[#1d4ed8] font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-slate-500" />
              <span>Test Series</span>
            </button>
          </nav>

          {/* Zone 3: 1-2 primary actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Active Batch Selector */}
            <div className="relative hidden sm:block max-w-[210px]">
              <select
                value={selectedBatchId}
                onChange={(e) => setSelectedBatchId(e.target.value)}
                aria-label="Active Batch"
                className="w-full text-xs font-semibold py-1.5 pl-2.5 pr-7 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white truncate appearance-none cursor-pointer"
              >
                {batches.map((batch) => (
                  <option key={batch.id} value={batch.id}>
                    {batch.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>

            {/* Supabase backend status trigger */}
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors ${
                supabaseConnected
                  ? 'border-emerald-300 bg-emerald-50/80 text-emerald-800 hover:bg-emerald-100'
                  : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
              }`}
              title="Supabase Backend & Authentication"
            >
              <Database className={`w-3.5 h-3.5 ${supabaseConnected ? 'text-emerald-600' : 'text-slate-500'}`} />
              <span className="hidden xl:inline">Supabase</span>
              <span
                className={`w-2 h-2 rounded-full ${
                  supabaseConnected ? 'bg-emerald-500' : 'bg-slate-400'
                }`}
              />
            </button>

            {/* User Profile / Login */}
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-2 p-1.5 hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200"
              title="Educator Account Settings"
            >
              <div className="w-7 h-7 rounded-md bg-[#1d4ed8] text-white flex items-center justify-center font-bold text-xs">
                {currentUser?.fullName ? currentUser.fullName[0] : 'C'}
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-semibold text-slate-900 leading-none truncate max-w-[110px]">
                  {currentUser?.fullName || 'Educator'}
                </p>
                <p className="text-[10px] text-slate-500 leading-tight">Commerce Lead</p>
              </div>
            </button>
          </div>

        </div>
      </header>
    </>
  );
};
