import React, { useState } from 'react';
import { Language } from '../../types';
import { Plus, Trash2, RotateCcw, Copy, Check, Award } from 'lucide-react';

interface Props {
  language: Language;
}

interface Course {
  id: string;
  name: string;
  credits: number;
  grade: string;
}

const GRADE_POINTS: Record<string, number> = {
  'A': 4.0,
  'A-': 3.7,
  'B+': 3.3,
  'B': 3.0,
  'B-': 2.7,
  'C+': 2.3,
  'C': 2.0,
  'C-': 1.7,
  'D+': 1.3,
  'D': 1.0,
  'F': 0.0,
};

export const GpaCalculator: React.FC<Props> = ({ language }) => {
  const isSo = language === 'so';

  const [courses, setCourses] = useState<Course[]>([
    { id: '1', name: isSo ? 'Xisaab Guud (Calculus I)' : 'Calculus I', credits: 3, grade: 'A' },
    { id: '2', name: isSo ? 'Barnaamijaynta Kombiyuutarka' : 'Intro to Programming', credits: 4, grade: 'A-' },
    { id: '3', name: isSo ? 'Dhaqaalaha Guud (Economics)' : 'Microeconomics', credits: 3, grade: 'B+' },
    { id: '4', name: isSo ? 'Xirfadaha Xiriirka' : 'Communication Skills', credits: 2, grade: 'A' },
  ]);

  const [copied, setCopied] = useState(false);

  const addCourse = () => {
    setCourses((prev) => [
      ...prev,
      { id: Date.now().toString(), name: '', credits: 3, grade: 'B' },
    ]);
  };

  const removeCourse = (id: string) => {
    if (courses.length > 1) {
      setCourses((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const updateCourse = (id: string, field: keyof Course, value: any) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const totalCredits = courses.reduce((sum, c) => sum + (c.credits || 0), 0);
  const totalPoints = courses.reduce(
    (sum, c) => sum + (c.credits || 0) * (GRADE_POINTS[c.grade] ?? 0),
    0
  );
  const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0;

  const getStanding = (val: number) => {
    if (val >= 3.7) return isSo ? 'Derejada Koowaad (First Class / Distinction)' : 'First Class Honours';
    if (val >= 3.0) return isSo ? 'Derejo Sare (Second Class Upper)' : 'Second Class Honours (Upper)';
    if (val >= 2.5) return isSo ? 'Derejo Dhexe (Second Class Lower)' : 'Second Class Honours (Lower)';
    if (val >= 2.0) return isSo ? 'Gudbay (Pass)' : 'Pass';
    return isSo ? 'Digniin Tacliimeed (Probation)' : 'Academic Warning';
  };

  const handleCopy = () => {
    const summary = `${isSo ? 'Celceliska GPA' : 'GPA'}: ${gpa.toFixed(2)} / 4.00 (${getStanding(gpa)}) | ${isSo ? 'Koorsooyinka' : 'Courses'}: ${courses.length} | ${isSo ? 'Saacadaha' : 'Credits'}: ${totalCredits}`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setCourses([
      { id: '1', name: '', credits: 3, grade: 'A' },
      { id: '2', name: '', credits: 3, grade: 'B' },
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Course List Table */}
      <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
            <tr>
              <th className="py-2.5 px-3">{isSo ? 'Magaca Maaddada / Koorsada' : 'Course Name'}</th>
              <th className="py-2.5 px-3 w-28 text-center">{isSo ? 'Saacadaha (Credits)' : 'Credit Hours'}</th>
              <th className="py-2.5 px-3 w-32 text-center">{isSo ? 'Buundada (Grade)' : 'Grade'}</th>
              <th className="py-2.5 px-3 w-24 text-right">{isSo ? 'Dhibcaha' : 'Points'}</th>
              <th className="py-2.5 px-2 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {courses.map((course) => (
              <tr key={course.id} className="hover:bg-slate-50">
                <td className="py-2 px-3">
                  <input
                    type="text"
                    value={course.name}
                    onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
                    placeholder={isSo ? 'Tusaale: Xisaab, Ingiriisi...' : 'e.g. Physics, History...'}
                    className="w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:border-[#1E88E5] focus:outline-none text-xs text-slate-800 py-1"
                  />
                </td>
                <td className="py-2 px-3 text-center">
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={course.credits}
                    onChange={(e) => updateCourse(course.id, 'credits', parseFloat(e.target.value) || 0)}
                    className="w-16 text-center font-mono tabular-nums border border-slate-200 rounded px-1 py-1 focus:outline-none focus:border-[#1E88E5]"
                  />
                </td>
                <td className="py-2 px-3 text-center">
                  <select
                    value={course.grade}
                    onChange={(e) => updateCourse(course.id, 'grade', e.target.value)}
                    className="w-24 text-center font-semibold text-xs border border-slate-200 rounded px-2 py-1 bg-white focus:outline-none focus:border-[#1E88E5]"
                  >
                    {Object.keys(GRADE_POINTS).map((g) => (
                      <option key={g} value={g}>
                        {g} ({GRADE_POINTS[g].toFixed(1)})
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-2 px-3 text-right font-mono font-medium text-slate-800 tabular-nums">
                  {((course.credits || 0) * (GRADE_POINTS[course.grade] ?? 0)).toFixed(1)}
                </td>
                <td className="py-2 px-2 text-right">
                  <button
                    onClick={() => removeCourse(course.id)}
                    disabled={courses.length <= 1}
                    className="text-slate-400 hover:text-rose-600 disabled:opacity-30 p-1"
                    title={isSo ? 'Tir koorsada' : 'Delete course'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={addCourse}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#1E88E5] hover:text-[#1976D2]"
          >
            <Plus className="w-3.5 h-3.5" />
            {isSo ? 'Kudar Maaddo Kale' : 'Add Course'}
          </button>

          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800"
          >
            <RotateCcw className="w-3 h-3" />
            {isSo ? 'Dib u deji' : 'Reset Table'}
          </button>
        </div>
      </div>

      {/* GPA Summary Board */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              {isSo ? 'Celceliska Buundada (GPA Scale 4.0)' : 'Cumulative GPA (4.0 Scale)'}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-[#0A2342] font-mono tabular-nums">
                {gpa.toFixed(2)}
              </span>
              <span className="text-sm text-slate-500 font-mono">/ 4.00</span>
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-emerald-700">
              <Award className="w-4 h-4" />
              <span>{getStanding(gpa)}</span>
            </div>
          </div>

          <div className="text-right flex sm:flex-col items-center sm:items-end gap-3 sm:gap-1">
            <div className="text-xs text-slate-600">
              <span className="font-semibold text-slate-900">{isSo ? 'Wadarta Saacadaha' : 'Total Credits'}:</span>{' '}
              <span className="font-mono tabular-nums">{totalCredits}</span>
            </div>
            <div className="text-xs text-slate-600">
              <span className="font-semibold text-slate-900">{isSo ? 'Wadarta Dhibcaha' : 'Total Points'}:</span>{' '}
              <span className="font-mono tabular-nums">{totalPoints.toFixed(1)}</span>
            </div>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 mt-2 text-xs font-medium text-white bg-[#1E88E5] hover:bg-[#1976D2] rounded transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? (isSo ? 'Waa la guriyay!' : 'Copied!') : (isSo ? 'Guri GPA' : 'Copy Summary')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
