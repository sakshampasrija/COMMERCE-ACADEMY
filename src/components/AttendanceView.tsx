import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AttendanceStatus } from '../types';
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  HelpCircle,
  Sparkles,
  Phone,
  MessageSquare,
  Search,
  CheckCheck,
  AlertCircle,
} from 'lucide-react';

export const AttendanceView: React.FC = () => {
  const {
    batches,
    students,
    attendanceRecords,
    selectedBatchId,
    setSelectedBatchId,
    markAttendance,
    markAllBatchAttendance,
  } = useApp();

  // Selected date defaults to today
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-06');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotificationSent, setShowNotificationSent] = useState(false);

  const currentBatch = batches.find((b) => b.id === selectedBatchId) || batches[0];
  const batchStudents = students.filter((s) => s.enrolledBatchIds.includes(currentBatch?.id || ''));

  const filteredStudents = batchStudents.filter((s) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.rollNo.toLowerCase().includes(q);
  });

  // Map student attendance for this batch on selectedDate
  const attendanceMap: Record<string, AttendanceStatus | undefined> = {};
  const notesMap: Record<string, string | undefined> = {};

  attendanceRecords.forEach((r) => {
    if (r.batchId === currentBatch?.id && r.date === selectedDate) {
      attendanceMap[r.studentId] = r.status;
      notesMap[r.studentId] = r.notes;
    }
  });

  // Calculate statistics
  const totalStudents = batchStudents.length;
  let presentCount = 0;
  let absentCount = 0;
  let lateCount = 0;
  let excusedCount = 0;
  let unmarkedCount = 0;

  batchStudents.forEach((s) => {
    const status = attendanceMap[s.id];
    if (status === 'Present') presentCount++;
    else if (status === 'Absent') absentCount++;
    else if (status === 'Late') lateCount++;
    else if (status === 'Excused') excusedCount++;
    else unmarkedCount++;
  });

  const attendancePercentage = totalStudents > 0
    ? Math.round(((presentCount + lateCount) / totalStudents) * 100)
    : 0;

  const handleNotifyAbsentees = () => {
    const absentees = batchStudents.filter((s) => attendanceMap[s.id] === 'Absent');
    if (absentees.length === 0) {
      alert('No students marked absent for this session.');
      return;
    }
    setShowNotificationSent(true);
    setTimeout(() => setShowNotificationSent(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 mb-1">
            <span>RAPID LECTURE LOGGER</span>
            <span>·</span>
            <span className="text-slate-500">{currentBatch?.timeSlot}</span>
          </div>
          <h1 className="text-2xl font-bold font-display text-slate-900 tracking-tight">
            Batch Attendance Registry
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            1-tap rapid verification between classes. Parent notifications sync automatically.
          </p>
        </div>

        {/* Batch & Date Switchers */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-300">
            <Calendar className="w-4 h-4 text-slate-500" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="text-xs font-semibold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
            />
          </div>

          <select
            value={currentBatch?.id}
            onChange={(e) => setSelectedBatchId(e.target.value)}
            className="text-xs font-semibold py-2 px-3 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
          >
            {batches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name} ({b.grade})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <p className="text-xs font-medium text-slate-500">Cohort Strength</p>
          <p className="text-2xl font-bold font-display text-slate-900 tabular-nums">{totalStudents}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-emerald-700">Present (On-Time)</p>
          <p className="text-2xl font-bold font-display text-emerald-600 tabular-nums">{presentCount}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-rose-700">Absent</p>
          <p className="text-2xl font-bold font-display text-rose-600 tabular-nums">{absentCount}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-amber-700">Late Entry</p>
          <p className="text-2xl font-bold font-display text-amber-600 tabular-nums">{lateCount}</p>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <p className="text-xs font-medium text-blue-700">Batch Presence</p>
          <p className="text-2xl font-bold font-display text-blue-700 tabular-nums">{attendancePercentage}%</p>
        </div>
      </div>

      {/* Absentee notification alert */}
      {showNotificationSent && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-3 rounded-xl flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2 text-sm">
            <CheckCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              <strong>SMS / WhatsApp Dispatched:</strong> Automated absentee notifications delivered to {absentCount} parent contacts for {currentBatch?.name}.
            </span>
          </div>
          <button
            onClick={() => setShowNotificationSent(false)}
            className="text-emerald-700 hover:text-emerald-900 text-xs font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Action Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student name or roll no..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Mark All buttons */}
          <button
            onClick={() => markAllBatchAttendance(currentBatch.id, selectedDate, 'Present')}
            className="px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Mark All Present</span>
          </button>

          <button
            onClick={() => markAllBatchAttendance(currentBatch.id, selectedDate, 'Absent')}
            className="px-3 py-1.5 text-xs font-semibold text-rose-800 bg-rose-100 hover:bg-rose-200 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>Mark All Absent</span>
          </button>

          <button
            onClick={handleNotifyAbsentees}
            disabled={absentCount === 0}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              absentCount > 0
                ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-xs'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Notify Absent Parents ({absentCount})</span>
          </button>
        </div>
      </div>

      {/* Attendance Table / Roster */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Roll No</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Parent Contact</th>
                <th className="py-3 px-4 text-center">Streak</th>
                <th className="py-3 px-4 text-center">Attendance %</th>
                <th className="py-3 px-4 text-right">Log Status ({selectedDate})</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-medium text-slate-700">No students enrolled in this cohort matching query</p>
                    <p className="text-xs text-slate-500 mt-1">Select another batch or adjust your search filter.</p>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  const currentStatus = attendanceMap[student.id];

                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      {/* Roll Number */}
                      <td className="py-3 px-4 font-mono-num font-semibold text-xs text-blue-700">
                        {student.rollNo}
                      </td>

                      {/* Student Info */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full ${student.avatarBg} text-white flex items-center justify-center font-bold text-xs shrink-0`}
                          >
                            {student.initials}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 leading-tight">
                              {student.name}
                            </p>
                            <p className="text-xs text-slate-500">{student.phone}</p>
                          </div>
                        </div>
                      </td>

                      {/* Parent Contact */}
                      <td className="py-3 px-4 text-xs text-slate-600">
                        <p className="font-medium text-slate-800">{student.parentName}</p>
                        <a
                          href={`tel:${student.parentPhone}`}
                          className="text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-1 mt-0.5"
                        >
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{student.parentPhone}</span>
                        </a>
                      </td>

                      {/* Streak */}
                      <td className="py-3 px-4 text-center">
                        <span className="font-mono-num font-semibold text-xs text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">
                          🔥 {student.streakDays}d
                        </span>
                      </td>

                      {/* Overall % */}
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`font-mono-num font-bold text-xs ${
                            student.attendanceRate >= 90
                              ? 'text-emerald-700'
                              : student.attendanceRate >= 80
                              ? 'text-amber-700'
                              : 'text-rose-700'
                          }`}
                        >
                          {student.attendanceRate}%
                        </span>
                      </td>

                      {/* 1-Tap Attendance Buttons */}
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                          {/* Present */}
                          <button
                            onClick={() =>
                              markAttendance(currentBatch.id, student.id, selectedDate, 'Present')
                            }
                            title="Mark Present"
                            className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
                              currentStatus === 'Present'
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'text-slate-600 hover:text-emerald-700 hover:bg-white'
                            }`}
                          >
                            P
                          </button>

                          {/* Absent */}
                          <button
                            onClick={() =>
                              markAttendance(currentBatch.id, student.id, selectedDate, 'Absent')
                            }
                            title="Mark Absent"
                            className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
                              currentStatus === 'Absent'
                                ? 'bg-rose-600 text-white shadow-xs'
                                : 'text-slate-600 hover:text-rose-700 hover:bg-white'
                            }`}
                          >
                            A
                          </button>

                          {/* Late */}
                          <button
                            onClick={() =>
                              markAttendance(currentBatch.id, student.id, selectedDate, 'Late')
                            }
                            title="Mark Late"
                            className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
                              currentStatus === 'Late'
                                ? 'bg-amber-500 text-white shadow-xs'
                                : 'text-slate-600 hover:text-amber-700 hover:bg-white'
                            }`}
                          >
                            L
                          </button>

                          {/* Excused */}
                          <button
                            onClick={() =>
                              markAttendance(currentBatch.id, student.id, selectedDate, 'Excused')
                            }
                            title="Mark Excused"
                            className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
                              currentStatus === 'Excused'
                                ? 'bg-indigo-600 text-white shadow-xs'
                                : 'text-slate-600 hover:text-indigo-700 hover:bg-white'
                            }`}
                          >
                            E
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
