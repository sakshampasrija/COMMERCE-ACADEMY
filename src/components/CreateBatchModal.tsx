import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Subject, Grade } from '../types';
import { X, Calendar, Plus } from 'lucide-react';

export const CreateBatchModal: React.FC = () => {
  const { isCreateBatchOpen, setIsCreateBatchOpen, createBatch } = useApp();

  const [name, setName] = useState('');
  const [subject, setSubject] = useState<Subject>('Accountancy');
  const [grade, setGrade] = useState<Grade>('Class 12');
  const [scheduleDays, setScheduleDays] = useState<string[]>(['Mon', 'Wed', 'Fri']);
  const [timeSlot, setTimeSlot] = useState('04:30 PM - 06:00 PM');
  const [room, setRoom] = useState('Hall 2A (Commerce Wing)');
  const [instructor, setInstructor] = useState('CA Vikram Singhania');
  const [totalSeats, setTotalSeats] = useState(35);
  const [monthlyFee, setMonthlyFee] = useState(4500);
  const [currentChapter, setCurrentChapter] = useState('Partnership Accounts: Admission of a Partner');

  if (!isCreateBatchOpen) return null;

  const toggleDay = (day: string) => {
    setScheduleDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter a batch cohort name.');
      return;
    }

    createBatch({
      name: name.trim(),
      subject,
      grade,
      scheduleDays: scheduleDays.length > 0 ? scheduleDays : ['Mon', 'Wed'],
      timeSlot,
      room,
      instructor,
      totalSeats: Number(totalSeats) || 30,
      monthlyFee: Number(monthlyFee) || 4000,
      syllabusCompletion: 0,
      currentChapter,
    });

    setIsCreateBatchOpen(false);
  };

  const daysList = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200 animate-scaleIn my-6">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-700" />
            <h3 className="font-bold text-base font-display text-slate-900">
              Create New Commerce Batch
            </h3>
          </div>
          <button
            onClick={() => setIsCreateBatchOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Batch Title
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Class 12 - Target Accounts 2026 Board Elite"
              className="w-full text-xs py-2 px-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Grade / Class
              </label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value as Grade)}
                className="w-full text-xs py-2 px-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
              >
                <option value="Class 12">Class 12</option>
                <option value="Class 11">Class 11</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Subject
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value as Subject)}
                className="w-full text-xs py-2 px-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
              >
                <option value="Accountancy">Accountancy</option>
                <option value="Economics">Economics</option>
                <option value="Business Studies">Business Studies</option>
                <option value="Applied Mathematics">Applied Mathematics</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Schedule Days
            </label>
            <div className="flex flex-wrap gap-1.5">
              {daysList.map((day) => (
                <button
                  type="button"
                  key={day}
                  onClick={() => toggleDay(day)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md border transition-all ${
                    scheduleDays.includes(day)
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Time Slot
              </label>
              <input
                type="text"
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                placeholder="04:30 PM - 06:00 PM"
                className="w-full text-xs py-2 px-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Lecture Room / Lab
              </label>
              <input
                type="text"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                placeholder="Hall 2A (Commerce Wing)"
                className="w-full text-xs py-2 px-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Max Capacity
              </label>
              <input
                type="number"
                min="5"
                max="100"
                value={totalSeats}
                onChange={(e) => setTotalSeats(Number(e.target.value))}
                className="w-full text-xs py-2 px-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono-num"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Monthly Tuition Fee (₹ INR)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-xs font-bold text-slate-500 font-mono">
                  ₹
                </span>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={monthlyFee}
                  onChange={(e) => setMonthlyFee(Number(e.target.value))}
                  className="w-full text-xs font-bold pl-7 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono-num"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Current Syllabus Chapter
            </label>
            <input
              type="text"
              value={currentChapter}
              onChange={(e) => setCurrentChapter(e.target.value)}
              placeholder="e.g. Accounting for Partnership Firms"
              className="w-full text-xs py-2 px-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsCreateBatchOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold bg-[#1d4ed8] hover:bg-[#1e40af] text-white rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Launch Cohort</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
