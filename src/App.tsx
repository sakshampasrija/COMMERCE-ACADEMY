/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { BatchesView } from './components/BatchesView';
import { AttendanceView } from './components/AttendanceView';
import { FeesLedgerView } from './components/FeesLedgerView';
import { StudentsView } from './components/StudentsView';
import { TestSeriesView } from './components/TestSeriesView';
import { ReceiptModal } from './components/ReceiptModal';
import { RecordPaymentModal } from './components/RecordPaymentModal';
import { CreateBatchModal } from './components/CreateBatchModal';
import { CreateStudentModal } from './components/CreateStudentModal';
import { SupabaseAuthModal } from './components/SupabaseAuthModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Database, ShieldCheck, BookOpen } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { activeTab, supabaseConnected, setIsAuthModalOpen } = useApp();

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] flex flex-col justify-between selection:bg-blue-100 selection:text-blue-900 pb-20 md:pb-8">
      {/* Top Bar Navigation */}
      <div>
        <Navbar />

        {/* Content Container */}
        <main className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {activeTab === 'batches' && <BatchesView />}
          {activeTab === 'attendance' && <AttendanceView />}
          {activeTab === 'fees' && <FeesLedgerView />}
          {activeTab === 'students' && <StudentsView />}
          {activeTab === 'tests' && <TestSeriesView />}
        </main>
      </div>

      {/* Global Modals */}
      <ReceiptModal />
      <RecordPaymentModal />
      <CreateBatchModal />
      <CreateStudentModal />
      <SupabaseAuthModal />

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav />

      {/* Clean Institutional Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 print:hidden">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-blue-700 text-white flex items-center justify-center font-bold text-[10px]">
              CF
            </div>
            <span className="font-semibold text-slate-800">ClassFlow Kinetic Commerce</span>
            <span>·</span>
            <span>CBSE & ISC Academic Operations Suite</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="hover:text-blue-700 transition-colors flex items-center gap-1.5"
            >
              <Database className="w-3.5 h-3.5 text-slate-400" />
              <span>
                Supabase Cluster: {supabaseConnected ? 'Online (Realtime Active)' : 'Local-First Mode'}
              </span>
            </button>
            <span className="text-slate-300">|</span>
            <span>Academic Session 2026-2027</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
