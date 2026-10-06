import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, UserPlus, Check } from 'lucide-react';

export const CreateStudentModal: React.FC = () => {
  const { isCreateStudentOpen, setIsCreateStudentOpen, batches, createStudent } = useApp();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+91 98');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('+91 98');
  const [email, setEmail] = useState('');
  const [enrolledBatchIds, setEnrolledBatchIds] = useState<string[]>([batches[0]?.id || '']);

  if (!isCreateStudentOpen) return null;

  const toggleBatch = (batchId: string) => {
    setEnrolledBatchIds((prev) =>
      prev.includes(batchId)
        ? prev.length > 1
          ? prev.filter((id) => id !== batchId)
          : prev
        : [...prev, batchId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !parentName.trim()) {
      alert('Please fill out student name and guardian details.');
      return;
    }

    createStudent({
      name: name.trim(),
      phone: phone.trim(),
      parentName: parentName.trim(),
      parentPhone: parentPhone.trim(),
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '.')}@kineticschool.edu`,
      enrolledBatchIds,
    });

    setIsCreateStudentOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200 animate-scaleIn my-6">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-blue-700" />
            <h3 className="font-bold text-base font-display text-slate-900">
              Enrol Commerce Student
            </h3>
          </div>
          <button
            onClick={() => setIsCreateStudentOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Student Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Yashvardhan Singhal"
              className="w-full text-xs py-2 px-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Student Mobile
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98112 00000"
                className="w-full text-xs font-mono py-2 px-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Student Email (Optional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="yash@kineticschool.edu"
                className="w-full text-xs py-2 px-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Guardian / Parent Communications
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Parent / Guardian Name
                </label>
                <input
                  type="text"
                  required
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  placeholder="e.g. Alok Singhal"
                  className="w-full text-xs py-1.5 px-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Parent Mobile (WhatsApp Alert)
                </label>
                <input
                  type="text"
                  required
                  value={parentPhone}
                  onChange={(e) => setParentPhone(e.target.value)}
                  placeholder="+91 98110 00000"
                  className="w-full text-xs font-mono py-1.5 px-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Select Enrolled Batch Cohorts
            </label>
            <div className="space-y-1.5 max-h-40 overflow-y-auto">
              {batches.map((b) => {
                const isChecked = enrolledBatchIds.includes(b.id);
                return (
                  <div
                    key={b.id}
                    onClick={() => toggleBatch(b.id)}
                    className={`p-2.5 rounded-lg border text-xs cursor-pointer flex items-center justify-between transition-colors ${
                      isChecked
                        ? 'border-blue-600 bg-blue-50/70 text-blue-900'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <p className="font-semibold leading-tight">{b.name}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {b.subject} · {b.timeSlot} · ₹{b.monthlyFee}/mo
                      </p>
                    </div>
                    {isChecked ? (
                      <div className="w-5 h-5 rounded-md bg-blue-600 text-white flex items-center justify-center">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-md border border-slate-300 bg-white" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsCreateStudentOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold bg-[#1d4ed8] hover:bg-[#1e40af] text-white rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Complete Enrollment</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
