import React from 'react';
import { useApp } from '../context/AppContext';
import { Printer, Download, X, CheckCircle, ShieldCheck } from 'lucide-react';

export const ReceiptModal: React.FC = () => {
  const { selectedReceipt, setSelectedReceipt } = useApp();

  if (!selectedReceipt) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200 animate-scaleIn my-8">
        
        {/* Action Header - Hidden when printing */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <h3 className="font-bold text-sm text-slate-800">
              Official Commerce Tuition Receipt
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-[#1d4ed8] hover:bg-[#1e40af] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={() => setSelectedReceipt(null)}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Body */}
        <div id="printable-receipt" className="p-8 sm:p-10 space-y-6 text-slate-900 bg-white">
          {/* Header Block with Academic Branding */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded bg-[#1d4ed8] text-white flex items-center justify-center font-black text-sm">
                  CF
                </div>
                <h1 className="text-xl font-black font-display tracking-tight text-slate-900">
                  CLASSFLOW KINETIC COMMERCE
                </h1>
              </div>
              <p className="text-xs text-slate-600 font-medium">
                Centre for Advanced Accountancy, Macroeconomics & Business Studies
              </p>
              <p className="text-[11px] text-slate-500">
                Plot 14-B, Knowledge Corridor, New Delhi · +91 98112 00000 · contact@kineticcommerce.edu
              </p>
            </div>

            <div className="text-right">
              <span className="inline-block px-2.5 py-1 text-xs font-bold uppercase tracking-wider bg-slate-900 text-white rounded">
                Fee Receipt
              </span>
              <p className="text-xs font-mono font-bold text-blue-700 mt-2">
                No: {selectedReceipt.receiptNo}
              </p>
              <p className="text-xs text-slate-500 font-mono-num">
                Date: {selectedReceipt.paymentDate}
              </p>
            </div>
          </div>

          {/* Student & Cohort Metadata */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <p className="text-slate-400 uppercase font-bold text-[10px]">Scholar Details</p>
              <p className="text-sm font-bold text-slate-900 mt-0.5">{selectedReceipt.studentName}</p>
              <p className="font-mono text-slate-600 mt-0.5">Roll No: <strong>{selectedReceipt.rollNo}</strong></p>
            </div>
            <div>
              <p className="text-slate-400 uppercase font-bold text-[10px]">Enrolled Course Cohort</p>
              <p className="text-sm font-semibold text-slate-900 mt-0.5">{selectedReceipt.batchName}</p>
              <p className="text-slate-600 mt-0.5">Session: 2026 - 2027 (CBSE / ISC)</p>
            </div>
          </div>

          {/* Transaction Ledger Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-600 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">Item Description</th>
                  <th className="py-2.5 px-4">Installment Period</th>
                  <th className="py-2.5 px-4 text-right">Amount (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    Tuition Fee & Classroom Lectures
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-medium">
                    {selectedReceipt.installmentPeriod}
                  </td>
                  <td className="py-3 px-4 text-right font-mono-num font-bold text-slate-900">
                    ₹{Math.round(selectedReceipt.amount * 0.85).toLocaleString('en-IN')}
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 text-slate-700">
                    Comprehensive Study Modules & Board Test Series Kit
                  </td>
                  <td className="py-2.5 px-4 text-slate-500 font-medium">
                    Annual Licensing
                  </td>
                  <td className="py-2.5 px-4 text-right font-mono-num text-slate-700">
                    ₹{Math.round(selectedReceipt.amount * 0.15).toLocaleString('en-IN')}
                  </td>
                </tr>
              </tbody>
              <tfoot className="bg-slate-50 border-t-2 border-slate-200">
                <tr>
                  <td colSpan={2} className="py-3 px-4 font-bold text-slate-900 text-sm">
                    Total Amount Received
                  </td>
                  <td className="py-3 px-4 text-right font-mono-num font-black text-slate-900 text-base">
                    ₹{selectedReceipt.amount.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Payment Method & Reference */}
          <div className="grid grid-cols-2 gap-4 text-xs py-2 border-b border-slate-200">
            <div>
              <p className="text-slate-500 font-medium">Payment Mode</p>
              <p className="font-bold text-slate-900 mt-0.5">{selectedReceipt.paymentMode}</p>
              <p className="font-mono text-[11px] text-slate-500 mt-0.5 truncate">
                Ref ID: {selectedReceipt.transactionRef}
              </p>
            </div>
            <div>
              <p className="text-slate-500 font-medium">Balance Remaining After This Receipt</p>
              <p className="font-bold font-mono text-sm text-slate-900 mt-0.5 tabular-nums">
                ₹{selectedReceipt.balanceRemaining.toLocaleString('en-IN')}
              </p>
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-semibold mt-0.5">
                <CheckCircle className="w-3 h-3" />
                <span>Verified by Academic Bursar</span>
              </span>
            </div>
          </div>

          {/* Footer & Authorized Signatory */}
          <div className="pt-6 flex items-end justify-between text-xs text-slate-500">
            <div>
              <p className="font-semibold text-slate-700">Notes & Conditions:</p>
              <p className="text-[11px] mt-0.5 text-slate-500">1. Tuition fee once paid is non-refundable and non-transferable.</p>
              <p className="text-[11px] text-slate-500">2. Official electronic voucher generated by ClassFlow Kinetic Commerce System.</p>
            </div>

            <div className="text-center shrink-0">
              <div className="h-10 border-b border-slate-400 w-36 mb-1" />
              <p className="font-bold text-slate-900">CA Vikram Singhania</p>
              <p className="text-[10px] text-slate-500">Head of Commerce & Faculty</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
