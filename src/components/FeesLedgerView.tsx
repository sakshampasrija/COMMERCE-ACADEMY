import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CreditCard,
  Plus,
  Search,
  Filter,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Printer,
  Download,
  Send,
  Building,
} from 'lucide-react';
import { FeeTransaction, FeeStatus } from '../types';

export const FeesLedgerView: React.FC = () => {
  const {
    students,
    batches,
    feeTransactions,
    setSelectedReceipt,
    setIsRecordPaymentOpen,
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<'All' | FeeStatus>('All');
  const [selectedBatchFilter, setSelectedBatchFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLedgerTab, setActiveLedgerTab] = useState<'transactions' | 'balances'>('transactions');
  const [reminderSentStudentId, setReminderSentStudentId] = useState<string | null>(null);

  // Financial aggregates
  const totalBilled = students.reduce((sum, s) => sum + s.totalFeeDue, 0);
  const totalCollected = students.reduce((sum, s) => sum + s.totalFeePaid, 0);
  const totalOutstanding = students.reduce((sum, s) => sum + s.balance, 0);
  const recoveryRate = totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 100) : 0;

  // Filtered transactions
  const filteredTransactions = feeTransactions.filter((tx) => {
    if (selectedBatchFilter !== 'All' && tx.batchId !== selectedBatchFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = tx.studentName.toLowerCase().includes(q);
      const matchRoll = tx.rollNo.toLowerCase().includes(q);
      const matchReceipt = tx.receiptNo.toLowerCase().includes(q);
      if (!matchName && !matchRoll && !matchReceipt) return false;
    }
    return true;
  });

  // Filtered student balances
  const filteredStudents = students.filter((s) => {
    if (statusFilter !== 'All' && s.feeStatus !== statusFilter) return false;
    if (selectedBatchFilter !== 'All' && !s.enrolledBatchIds.includes(selectedBatchFilter)) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = s.name.toLowerCase().includes(q);
      const matchRoll = s.rollNo.toLowerCase().includes(q);
      if (!matchName && !matchRoll) return false;
    }
    return true;
  });

  const handleSendReminder = (studentId: string) => {
    setReminderSentStudentId(studentId);
    setTimeout(() => setReminderSentStudentId(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900 tracking-tight">
            Commerce Tuition & Fee Ledgers
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Installment scheduling, GST compliant receipts, bank reconciliation, and real-time ledger records.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsRecordPaymentOpen(true)}
            className="px-4 py-2 bg-[#1d4ed8] hover:bg-[#1e40af] text-white rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Record Installment</span>
          </button>
        </div>
      </div>

      {/* Financial KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total Billed Tuition
          </span>
          <div className="text-2xl font-bold font-display text-slate-900 tabular-nums mt-1">
            ₹{totalBilled.toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-slate-500 mt-1">Academic Year 2026-27</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
            Realized Collections
          </span>
          <div className="text-2xl font-bold font-display text-emerald-600 tabular-nums mt-1">
            ₹{totalCollected.toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-emerald-700 font-medium mt-1">
            {recoveryRate}% Recovery Rate
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-rose-700">
            Overdue Receivables
          </span>
          <div className="text-2xl font-bold font-display text-rose-600 tabular-nums mt-1">
            ₹{totalOutstanding.toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-slate-500 mt-1">Pending student clearance</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-700">
            Recent Receipts
          </span>
          <div className="text-2xl font-bold font-display text-blue-700 tabular-nums mt-1">
            {feeTransactions.length}
          </div>
          <p className="text-xs text-slate-500 mt-1">Reconciled vouchers</p>
        </div>
      </div>

      {/* Main Ledger Tabs & Filters */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Toggle between Receipts Log and Outstanding Student Balances */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveLedgerTab('transactions')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeLedgerTab === 'transactions'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Payment Receipts ({feeTransactions.length})
          </button>
          <button
            onClick={() => setActiveLedgerTab('balances')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeLedgerTab === 'balances'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Student Account Balances ({students.length})
          </button>
        </div>

        {/* Search & Batch Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search name, roll, or receipt..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-xs pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 w-48 sm:w-64"
            />
          </div>

          <select
            value={selectedBatchFilter}
            onChange={(e) => setSelectedBatchFilter(e.target.value)}
            className="text-xs py-1.5 px-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-600"
          >
            <option value="All">All Batches</option>
            {batches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>

          {activeLedgerTab === 'balances' && (
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="text-xs py-1.5 px-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              <option value="All">All Statuses</option>
              <option value="Settled">Settled</option>
              <option value="Partial">Partial</option>
              <option value="Overdue">Overdue</option>
            </select>
          )}
        </div>
      </div>

      {/* Tab 1: Payment Receipts Log Table */}
      {activeLedgerTab === 'transactions' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Receipt No</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Student & Cohort</th>
                  <th className="py-3 px-4">Installment Period</th>
                  <th className="py-3 px-4">Payment Channel</th>
                  <th className="py-3 px-4 text-right">Amount (INR)</th>
                  <th className="py-3 px-4 text-center">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500">
                      <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="font-medium text-slate-700">No payment receipts found</p>
                      <p className="text-xs text-slate-500 mt-1">Record a new fee installment to generate an official receipt.</p>
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((tx) => (
                    <tr
                      key={tx.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="py-3 px-4 font-mono-num font-bold text-xs text-blue-700">
                        {tx.receiptNo}
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-600 font-mono-num">
                        {tx.paymentDate}
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-slate-900 leading-tight">
                          {tx.studentName}
                        </p>
                        <p className="text-xs text-slate-500">
                          {tx.rollNo} · {tx.batchName}
                        </p>
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-700 font-medium">
                        {tx.installmentPeriod}
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-600">
                        <span className="font-medium text-slate-800">{tx.paymentMode}</span>
                        <p className="text-[11px] text-slate-400 font-mono truncate max-w-[150px]">
                          {tx.transactionRef}
                        </p>
                      </td>
                      <td className="py-3 px-4 text-right font-mono-num font-bold text-slate-900">
                        ₹{tx.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => setSelectedReceipt(tx)}
                          className="px-2.5 py-1 text-xs font-semibold text-blue-700 hover:text-blue-900 hover:bg-blue-50 rounded-md transition-colors inline-flex items-center gap-1"
                          title="View and Print Official Tax/Tuition Receipt"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Student Account Balances Table */}
      {activeLedgerTab === 'balances' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Roll No</th>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4 text-right">Total Billed</th>
                  <th className="py-3 px-4 text-right">Paid To Date</th>
                  <th className="py-3 px-4 text-right">Net Balance Due</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500">
                      <CreditCard className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="font-medium text-slate-700">No student balance records found</p>
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => {
                    const isSettled = student.feeStatus === 'Settled';
                    const isOverdue = student.feeStatus === 'Overdue';

                    return (
                      <tr
                        key={student.id}
                        className="hover:bg-slate-50/80 transition-colors"
                      >
                        <td className="py-3 px-4 font-mono-num font-semibold text-xs text-blue-700">
                          {student.rollNo}
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-semibold text-slate-900 leading-tight">
                            {student.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            Parent: {student.parentName} ({student.parentPhone})
                          </p>
                        </td>
                        <td className="py-3 px-4 text-right font-mono-num text-xs text-slate-600">
                          ₹{student.totalFeeDue.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-4 text-right font-mono-num text-xs font-semibold text-emerald-700">
                          ₹{student.totalFeePaid.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-4 text-right font-mono-num font-bold text-sm text-slate-900">
                          <span className={student.balance > 0 ? 'text-rose-700' : 'text-slate-700'}>
                            ₹{student.balance.toLocaleString('en-IN')}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          {isSettled ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                              Settled
                            </span>
                          ) : isOverdue ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
                              Overdue
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                              Partial
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {student.balance > 0 ? (
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => setIsRecordPaymentOpen(true)}
                                className="px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                              >
                                Record
                              </button>
                              <button
                                onClick={() => handleSendReminder(student.id)}
                                title="Send WhatsApp Fee Reminder"
                                className={`p-1 rounded-md transition-colors ${
                                  reminderSentStudentId === student.id
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                                }`}
                              >
                                {reminderSentStudentId === student.id ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                ) : (
                                  <Send className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400 font-medium">Cleared</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
