import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Calendar,
  Users,
  Clock,
  MapPin,
  BookOpen,
  ArrowRight,
  Plus,
  TrendingUp,
  CheckCircle2,
  DollarSign,
  GraduationCap
} from 'lucide-react';
import { Batch } from '../types';

export const BatchesView: React.FC = () => {
  const {
    batches,
    students,
    setSelectedBatchId,
    setActiveTab,
    setIsCreateBatchOpen,
  } = useApp();

  const [gradeFilter, setGradeFilter] = useState<'All' | 'Class 11' | 'Class 12'>('All');
  const [subjectFilter, setSubjectFilter] = useState<string>('All');

  const filteredBatches = batches.filter((b) => {
    if (gradeFilter !== 'All' && b.grade !== gradeFilter) return false;
    if (subjectFilter !== 'All' && b.subject !== subjectFilter) return false;
    return true;
  });

  const totalEnrolled = batches.reduce((sum, b) => sum + b.enrolledCount, 0);
  const totalCapacity = batches.reduce((sum, b) => sum + b.totalSeats, 0);
  const monthlyRevenue = batches.reduce((sum, b) => sum + b.enrolledCount * b.monthlyFee, 0);
  const avgSyllabus = Math.round(
    batches.reduce((sum, b) => sum + b.syllabusCompletion, 0) / (batches.length || 1)
  );

  return (
    <div className="space-y-6">
      {/* Top Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900 tracking-tight">
            Academic Batches & Timetable
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Manage Class 11 & 12 Commerce cohorts, lecture rooms, syllabus velocity, and seat allocations.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCreateBatchOpen(true)}
            className="px-4 py-2 bg-[#1d4ed8] hover:bg-[#1e40af] text-white rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Create Batch</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Cohorts</span>
            <Calendar className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold font-display text-slate-900 tabular-nums">
            {batches.length}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            CBSE & ISC Board streams
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Enrolled Scholars</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold font-display text-slate-900 tabular-nums">
            {totalEnrolled} <span className="text-sm font-normal text-slate-400">/ {totalCapacity}</span>
          </div>
          <div className="text-xs text-emerald-600 font-medium mt-1">
            {Math.round((totalEnrolled / totalCapacity) * 100)}% Capacity filled
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Monthly Run-Rate</span>
            <span className="text-xs font-bold text-emerald-600">₹</span>
          </div>
          <div className="text-2xl font-bold font-display text-slate-900 tabular-nums">
            ₹{monthlyRevenue.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Projected tuition revenue
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Avg Syllabus Done</span>
            <TrendingUp className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-display text-slate-900 tabular-nums">
            {avgSyllabus}%
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Target: 100% by Dec 2026
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(['All', 'Class 12', 'Class 11'] as const).map((grade) => (
            <button
              key={grade}
              onClick={() => setGradeFilter(grade)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                gradeFilter === grade
                  ? 'bg-[#1d4ed8] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {grade}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Subject:</span>
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="text-xs py-1.5 px-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-600"
          >
            <option value="All">All Subjects</option>
            <option value="Accountancy">Accountancy</option>
            <option value="Economics">Economics</option>
            <option value="Business Studies">Business Studies</option>
            <option value="Applied Mathematics">Applied Mathematics</option>
          </select>
        </div>
      </div>

      {/* Batches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredBatches.map((batch) => {
          const occupancy = Math.round((batch.enrolledCount / batch.totalSeats) * 100);

          return (
            <div
              key={batch.id}
              className="bg-white rounded-xl border border-slate-200 hover:border-blue-300 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Header tag and title */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
                      <span className="text-blue-700 font-bold">{batch.grade}</span>
                      <span>·</span>
                      <span className="text-indigo-600 font-medium">{batch.subject}</span>
                    </div>
                    <h2 className="text-lg font-bold font-display text-slate-900 group-hover:text-blue-700 transition-colors">
                      {batch.name}
                    </h2>
                  </div>
                  <span className="px-2.5 py-1 text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 rounded-full shrink-0 tabular-nums">
                    ₹{batch.monthlyFee.toLocaleString('en-IN')}/mo
                  </span>
                </div>

                {/* Batch details */}
                <div className="space-y-2 text-xs text-slate-600 mb-4 bg-slate-50/80 p-3 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-medium text-slate-800">{batch.timeSlot}</span>
                    <span className="text-slate-400">({batch.scheduleDays.join(', ')})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{batch.room}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Faculty: <strong className="text-slate-700">{batch.instructor}</strong></span>
                  </div>
                </div>

                {/* Syllabus Progress */}
                <div className="space-y-1.5 mb-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-medium flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                      Current: <span className="text-slate-800 font-semibold truncate max-w-[220px]">{batch.currentChapter}</span>
                    </span>
                    <span className="font-semibold text-slate-700 tabular-nums">
                      {batch.syllabusCompletion}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${batch.syllabusCompletion}%` }}
                    />
                  </div>
                </div>

                {/* Capacity Bar */}
                <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                  <span>Capacity: <strong className="text-slate-700 tabular-nums">{batch.enrolledCount}</strong> of {batch.totalSeats} seats</span>
                  <span className={`font-semibold tabular-nums ${occupancy >= 90 ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {occupancy}% Filled
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    setSelectedBatchId(batch.id);
                    setActiveTab('attendance');
                  }}
                  className="px-3 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Log Attendance</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedBatchId(batch.id);
                    setActiveTab('fees');
                  }}
                  className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <span>Ledger</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
