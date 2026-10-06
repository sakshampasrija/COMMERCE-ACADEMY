import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  GraduationCap,
  Award,
  Trophy,
  Calendar,
  BookOpen,
  Plus,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { TestSeries } from '../types';

export const TestSeriesView: React.FC = () => {
  const { testSeries, batches, students } = useApp();
  const [selectedTestId, setSelectedTestId] = useState<string>(testSeries[0]?.id || '');
  const [selectedBatchFilter, setSelectedBatchFilter] = useState<string>('All');

  const filteredTests = testSeries.filter((t) => {
    if (selectedBatchFilter !== 'All' && t.batchId !== selectedBatchFilter) return false;
    return true;
  });

  const activeTest = testSeries.find((t) => t.id === selectedTestId) || testSeries[0];
  const testBatch = batches.find((b) => b.id === activeTest?.batchId);

  // Sort scores by rank
  const rankedScores = activeTest?.scores
    ? [...activeTest.scores].sort((a, b) => b.marksObtained - a.marksObtained)
    : [];

  const topperStudentId = rankedScores[0]?.studentId;
  const topperStudent = students.find((s) => s.id === topperStudentId);

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900 tracking-tight">
            CBSE / ISC Board Test Series Matrix
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Unit assessments, full-length pre-board mocks (80 Marks), percentile curves, and rubric remarks.
          </p>
        </div>
      </div>

      {/* Test Selector and Batch Filter */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Active Test Paper:</span>
          <select
            value={selectedTestId}
            onChange={(e) => setSelectedTestId(e.target.value)}
            className="text-xs font-semibold py-1.5 px-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            {filteredTests.map((t) => (
              <option key={t.id} value={t.id}>
                {t.testTitle} ({t.date})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Batch Filter:</span>
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
        </div>
      </div>

      {/* Active Test Card & Key KPIs */}
      {activeTest && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Test Details Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 mb-1">
                  <span>{testBatch?.grade}</span>
                  <span>·</span>
                  <span>{testBatch?.subject}</span>
                </div>
                <h2 className="text-lg font-bold font-display text-slate-900 leading-snug">
                  {activeTest.testTitle}
                </h2>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-2">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Conducted: {activeTest.date}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Max Marks Allowed</span>
                <span className="font-mono-num font-bold text-slate-900">
                  {activeTest.maxMarks} Marks
                </span>
              </div>
            </div>

            {/* Topper Spotlight */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50/40 rounded-xl border border-amber-200 p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-amber-800 text-xs font-bold uppercase tracking-wider mb-2">
                  <span>Batch Topper</span>
                  <Trophy className="w-4 h-4 text-amber-600" />
                </div>
                {topperStudent ? (
                  <div>
                    <h3 className="text-lg font-bold font-display text-slate-900">
                      {topperStudent.name}
                    </h3>
                    <p className="text-xs font-mono text-slate-500 font-semibold">
                      {topperStudent.rollNo}
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">No topper evaluated yet</p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-amber-200/60 flex items-center justify-between">
                <span className="text-xs text-amber-900 font-medium">Top Score</span>
                <span className="font-mono-num font-bold text-xl text-amber-700">
                  {activeTest.highestScore} / {activeTest.maxMarks}
                </span>
              </div>
            </div>

            {/* Batch Average & Curve */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-blue-700 text-xs font-bold uppercase tracking-wider mb-2">
                  <span>Cohort Performance</span>
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-3xl font-bold font-display text-slate-900 tabular-nums">
                  {activeTest.averageScore}
                  <span className="text-sm font-normal text-slate-400"> / {activeTest.maxMarks}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Overall Batch Mean ({Math.round((activeTest.averageScore / activeTest.maxMarks) * 100)}%)
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Evaluated Answer Scripts</span>
                <span className="font-mono-num font-bold text-slate-800">
                  {rankedScores.length} students
                </span>
              </div>
            </div>
          </div>

          {/* Marks Evaluation Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
              <h3 className="font-bold text-sm font-display text-slate-900">
                Score Ledger & Examiner Remarks
              </h3>
              <span className="text-xs text-slate-500 font-mono-num">
                Ranked by Marks Obtained
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4 text-center w-16">Rank</th>
                    <th className="py-3 px-4">Roll No</th>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4 text-right">Score</th>
                    <th className="py-3 px-4 text-right">Percentage</th>
                    <th className="py-3 px-4">Educator Remarks & Review</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {rankedScores.map((score, index) => {
                    const student = students.find((s) => s.id === score.studentId);
                    const pct = Math.round((score.marksObtained / activeTest.maxMarks) * 100);
                    const isTopThree = index < 3;

                    return (
                      <tr
                        key={score.studentId}
                        className="hover:bg-slate-50/80 transition-colors"
                      >
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-mono-num font-bold text-xs ${
                              index === 0
                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                : index === 1
                                ? 'bg-slate-200 text-slate-800'
                                : index === 2
                                ? 'bg-orange-100 text-orange-800'
                                : 'text-slate-500'
                            }`}
                          >
                            #{index + 1}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono-num font-bold text-xs text-blue-700">
                          {student?.rollNo || 'N/A'}
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-semibold text-slate-900 leading-tight">
                            {student?.name || 'Unknown Student'}
                          </p>
                        </td>
                        <td className="py-3 px-4 text-right font-mono-num font-bold text-slate-900">
                          {score.marksObtained} <span className="text-xs text-slate-400">/ {activeTest.maxMarks}</span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span
                            className={`font-mono-num font-bold text-xs ${
                              pct >= 90
                                ? 'text-emerald-700'
                                : pct >= 75
                                ? 'text-blue-700'
                                : 'text-amber-700'
                            }`}
                          >
                            {pct}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-xs text-slate-600">
                          {score.remarks || 'No specific remarks noted.'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
