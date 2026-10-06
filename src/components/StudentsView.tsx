import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  Search,
  Plus,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  GraduationCap,
  Award,
  ChevronRight,
  X,
  FileCheck,
} from 'lucide-react';
import { Student } from '../types';

export const StudentsView: React.FC = () => {
  const {
    students,
    batches,
    feeTransactions,
    setIsCreateStudentOpen,
    setIsRecordPaymentOpen,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBatchFilter, setSelectedBatchFilter] = useState('All');
  const [activeStudentDrawer, setActiveStudentDrawer] = useState<Student | null>(null);

  const filteredStudents = students.filter((s) => {
    if (selectedBatchFilter !== 'All' && !s.enrolledBatchIds.includes(selectedBatchFilter)) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = s.name.toLowerCase().includes(q);
      const matchRoll = s.rollNo.toLowerCase().includes(q);
      const matchParent = s.parentName.toLowerCase().includes(q);
      if (!matchName && !matchRoll && !matchParent) return false;
    }
    return true;
  });

  const getStudentBatches = (student: Student) => {
    return batches.filter((b) => student.enrolledBatchIds.includes(b.id));
  };

  const getStudentTransactions = (studentId: string) => {
    return feeTransactions.filter((tx) => tx.studentId === studentId);
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900 tracking-tight">
            Commerce Scholars Directory
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Student dossiers, parental communications, batch allocations, and academic histories.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCreateStudentOpen(true)}
            className="px-4 py-2 bg-[#1d4ed8] hover:bg-[#1e40af] text-white rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Enrol New Student</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student name, roll no, or parent name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Cohort:</span>
          <select
            value={selectedBatchFilter}
            onChange={(e) => setSelectedBatchFilter(e.target.value)}
            className="text-xs py-1.5 px-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-600"
          >
            <option value="All">All Cohorts ({students.length})</option>
            {batches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStudents.map((student) => {
          const studentBatches = getStudentBatches(student);
          const isSettled = student.feeStatus === 'Settled';

          return (
            <div
              key={student.id}
              onClick={() => setActiveStudentDrawer(student)}
              className="bg-white rounded-xl border border-slate-200 hover:border-blue-400 p-4 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                {/* Header with avatar & roll no */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full ${student.avatarBg} text-white flex items-center justify-center font-bold text-sm shadow-xs`}
                    >
                      {student.initials}
                    </div>
                    <div>
                      <h2 className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors leading-tight">
                        {student.name}
                      </h2>
                      <p className="text-xs font-mono text-blue-700 font-semibold">
                        {student.rollNo}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-semibold tabular-nums ${
                      isSettled
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {isSettled ? 'Fee Settled' : `₹${student.balance.toLocaleString('en-IN')} Due`}
                  </span>
                </div>

                {/* Enrolled Batches */}
                <div className="mb-3">
                  <p className="text-[11px] text-slate-400 uppercase font-semibold mb-1">
                    Enrolled Courses:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {studentBatches.map((b) => (
                      <span
                        key={b.id}
                        className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium"
                      >
                        {b.subject}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Attendance & Performance Metrics */}
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-lg text-xs mb-2">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Attendance Rate</span>
                    <span className="font-bold font-mono text-slate-900 tabular-nums">
                      {student.attendanceRate}%
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Active Streak</span>
                    <span className="font-bold text-slate-900 tabular-nums">
                      🔥 {student.streakDays} Days
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Parent: <strong className="text-slate-700">{student.parentName}</strong></span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Student Detail Drawer */}
      {activeStudentDrawer && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-md h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between animate-slideIn">
            <div>
              {/* Drawer Top */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-5">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-full ${activeStudentDrawer.avatarBg} text-white flex items-center justify-center font-bold text-base`}
                  >
                    {activeStudentDrawer.initials}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold font-display text-slate-900">
                      {activeStudentDrawer.name}
                    </h2>
                    <p className="text-xs font-mono font-bold text-blue-700">
                      Roll No: {activeStudentDrawer.rollNo}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveStudentDrawer(null)}
                  className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Contact Information */}
              <div className="space-y-3 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Communications & Guardians
                </h3>
                <div className="text-xs space-y-2 text-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Parent / Guardian:</span>
                    <span className="font-semibold text-slate-900">{activeStudentDrawer.parentName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Parent Phone:</span>
                    <a
                      href={`tel:${activeStudentDrawer.parentPhone}`}
                      className="font-mono font-semibold text-blue-600 hover:underline"
                    >
                      {activeStudentDrawer.parentPhone}
                    </a>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Student Phone:</span>
                    <span className="font-mono">{activeStudentDrawer.phone}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Email:</span>
                    <span className="font-mono truncate max-w-[200px]">{activeStudentDrawer.email}</span>
                  </div>
                </div>
              </div>

              {/* Fee Accounting Summary */}
              <div className="mb-6 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Tuition Ledger Position
                  </h3>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      activeStudentDrawer.feeStatus === 'Settled'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {activeStudentDrawer.feeStatus}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs mb-3">
                  <div className="bg-slate-50 p-2 rounded">
                    <span className="text-slate-400 block text-[10px]">Total Due</span>
                    <span className="font-bold font-mono text-slate-800 tabular-nums">
                      ₹{activeStudentDrawer.totalFeeDue.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="bg-emerald-50 p-2 rounded">
                    <span className="text-emerald-700 block text-[10px]">Total Paid</span>
                    <span className="font-bold font-mono text-emerald-700 tabular-nums">
                      ₹{activeStudentDrawer.totalFeePaid.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="bg-rose-50 p-2 rounded">
                    <span className="text-rose-700 block text-[10px]">Net Balance</span>
                    <span className="font-bold font-mono text-rose-700 tabular-nums">
                      ₹{activeStudentDrawer.balance.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Recent Receipts for this student */}
                <div className="space-y-1.5">
                  <p className="text-[11px] font-semibold text-slate-500 uppercase">
                    Issued Receipts:
                  </p>
                  {getStudentTransactions(activeStudentDrawer.id).length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No receipts recorded yet</p>
                  ) : (
                    getStudentTransactions(activeStudentDrawer.id).map((tx) => (
                      <div
                        key={tx.id}
                        className="flex items-center justify-between text-xs py-1.5 px-2 bg-slate-50 rounded border border-slate-100 font-mono-num"
                      >
                        <span className="font-bold text-blue-700">{tx.receiptNo}</span>
                        <span className="text-slate-500">{tx.paymentDate}</span>
                        <span className="font-bold text-slate-800">
                          ₹{tx.amount.toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Academic Test Scores */}
              <div className="mb-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Recent Board Evaluation Marks
                </h3>
                {activeStudentDrawer.recentMarks.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No evaluated tests logged</p>
                ) : (
                  <div className="space-y-2">
                    {activeStudentDrawer.recentMarks.map((m, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg text-xs border border-slate-200"
                      >
                        <div>
                          <p className="font-semibold text-slate-800">{m.testName}</p>
                          <p className="text-[11px] text-slate-400 font-mono">{m.date}</p>
                        </div>
                        <div className="text-right">
                          <span className="font-mono-num font-bold text-sm text-blue-700">
                            {m.marks}
                          </span>
                          <span className="text-slate-400 text-xs"> / {m.totalMarks}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions at Drawer Bottom */}
            <div className="pt-4 border-t border-slate-200 flex gap-2">
              <button
                onClick={() => {
                  setActiveStudentDrawer(null);
                  setIsRecordPaymentOpen(true);
                }}
                className="flex-1 py-2.5 bg-[#1d4ed8] hover:bg-[#1e40af] text-white rounded-lg text-xs font-semibold text-center transition-colors shadow-xs"
              >
                Record Payment
              </button>
              <button
                onClick={() => setActiveStudentDrawer(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
