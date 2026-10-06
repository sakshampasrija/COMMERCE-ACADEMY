import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PaymentMode } from '../types';
import { X, CreditCard, Check, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export const RecordPaymentModal: React.FC = () => {
  const {
    students,
    batches,
    recordFeePayment,
    isRecordPaymentOpen,
    setIsRecordPaymentOpen,
    setSelectedReceipt,
  } = useApp();

  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [amount, setAmount] = useState<string>('4500');
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('UPI / QR');
  const [transactionRef, setTransactionRef] = useState<string>('UPI/HDFC/' + Math.floor(100000000 + Math.random() * 900000000));
  const [installmentPeriod, setInstallmentPeriod] = useState<string>('October 2026 Installment');

  if (!isRecordPaymentOpen) return null;

  const currentStudent = students.find((s) => s.id === selectedStudentId) || students[0];
  const primaryBatch = batches.find((b) => currentStudent?.enrolledBatchIds.includes(b.id)) || batches[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      alert('Please enter a valid positive payment amount.');
      return;
    }

    const newTx = recordFeePayment({
      studentId: currentStudent.id,
      studentName: currentStudent.name,
      rollNo: currentStudent.rollNo,
      batchId: primaryBatch.id,
      batchName: primaryBatch.name,
      amount: numAmount,
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMode,
      transactionRef: transactionRef.trim() || `OFFLINE-${Date.now()}`,
      installmentPeriod,
      balanceRemaining: Math.max(0, currentStudent.balance - numAmount),
    });

    // Confetti celebration if fee settled
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch {
      // ignore
    }

    setIsRecordPaymentOpen(false);
    setSelectedReceipt(newTx);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200 animate-scaleIn">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-700" />
            <h3 className="font-bold text-base font-display text-slate-900">
              Record Fee Installment
            </h3>
          </div>
          <button
            onClick={() => setIsRecordPaymentOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Select Student */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Student / Scholar
            </label>
            <select
              value={selectedStudentId}
              onChange={(e) => {
                setSelectedStudentId(e.target.value);
                const s = students.find((stud) => stud.id === e.target.value);
                if (s && s.balance > 0) {
                  setAmount(String(Math.min(s.balance, 4500)));
                }
              }}
              className="w-full text-xs font-medium py-2 px-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
            >
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name} ({student.rollNo}) — Balance: ₹{student.balance.toLocaleString('en-IN')}
                </option>
              ))}
            </select>
          </div>

          {/* Student Status Quick Preview */}
          {currentStudent && (
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs flex items-center justify-between">
              <div>
                <span className="text-slate-500 block">Current Outstanding Balance:</span>
                <span className="font-mono-num font-bold text-base text-rose-700 tabular-nums">
                  ₹{currentStudent.balance.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="text-right">
                <span className="text-slate-500 block">Primary Cohort:</span>
                <span className="font-semibold text-slate-800">{primaryBatch.name}</span>
              </div>
            </div>
          )}

          {/* Payment Amount with fixed ₹ prefix */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Amount Paid (INR)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-sm font-bold text-slate-500 font-mono">
                ₹
              </span>
              <input
                type="number"
                min="1"
                step="50"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="w-full text-sm font-bold pl-8 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono-num"
                placeholder="4500"
              />
            </div>
          </div>

          {/* Payment Mode */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Payment Method / Channel
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['UPI / QR', 'Net Banking', 'Cash', 'Cheque'] as PaymentMode[]).map((mode) => (
                <button
                  type="button"
                  key={mode}
                  onClick={() => setPaymentMode(mode)}
                  className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all text-left flex items-center justify-between ${
                    paymentMode === mode
                      ? 'border-blue-600 bg-blue-50 text-blue-800'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{mode}</span>
                  {paymentMode === mode && <Check className="w-3.5 h-3.5 text-blue-600" />}
                </button>
              ))}
            </div>
          </div>

          {/* Transaction Reference */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Transaction Reference / UTR Number
            </label>
            <input
              type="text"
              value={transactionRef}
              onChange={(e) => setTransactionRef(e.target.value)}
              className="w-full text-xs font-mono py-2 px-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="e.g. UPI/HDFC/93812049182 or Cheque #492810"
            />
          </div>

          {/* Installment Period */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Installment Period / Term Description
            </label>
            <input
              type="text"
              value={installmentPeriod}
              onChange={(e) => setInstallmentPeriod(e.target.value)}
              className="w-full text-xs py-2 px-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="e.g. October 2026 Tuition or Q3 Advance"
            />
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsRecordPaymentOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold bg-[#1d4ed8] hover:bg-[#1e40af] text-white rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Issue Official Receipt</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
