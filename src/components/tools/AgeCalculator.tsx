import React, { useState } from 'react';
import { Language } from '../../types';
import { HeartHandshake, Copy, Check, Calendar } from 'lucide-react';

interface Props {
  language: Language;
}

const SOMALI_DAYS = ['Axad', 'Isniin', 'Talaado', 'Arbaco', 'Khamiis', 'Jimce', 'Sabti'];
const ENGLISH_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const AgeCalculator: React.FC<Props> = ({ language }) => {
  const isSo = language === 'so';

  const [birthDate, setBirthDate] = useState<string>('2000-01-01');
  const [copied, setCopied] = useState(false);

  const calculateAge = () => {
    const birth = new Date(birthDate);
    const now = new Date();

    if (isNaN(birth.getTime()) || birth > now) {
      return null;
    }

    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    // Total stats
    const diffTime = Math.abs(now.getTime() - birth.getTime());
    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = years * 12 + months;
    const totalHours = totalDays * 24;

    // Next birthday
    let nextBday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBday < now) {
      nextBday = new Date(now.getFullYear() + 1, birth.getMonth(), birth.getDate());
    }
    const daysToNext = Math.ceil((nextBday.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    const dayOfWeek = birth.getDay();

    return {
      years,
      months,
      days,
      totalDays,
      totalWeeks,
      totalMonths,
      totalHours,
      daysToNext,
      dayBorn: isSo ? SOMALI_DAYS[dayOfWeek] : ENGLISH_DAYS[dayOfWeek],
    };
  };

  const ageData = calculateAge();

  const handleCopy = () => {
    if (!ageData) return;
    const text = isSo
      ? `Da'da: ${ageData.years} sano, ${ageData.months} bilood, ${ageData.days} maalmood | Wadarta: ${ageData.totalDays.toLocaleString()} maalmood | Maalintii Dhalashada: ${ageData.dayBorn}`
      : `Age: ${ageData.years} years, ${ageData.months} months, ${ageData.days} days | Total: ${ageData.totalDays.toLocaleString()} days | Born on: ${ageData.dayBorn}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
          {isSo ? 'Geli Taariikhda Dhalashadaada' : 'Select Date of Birth'}
        </label>
        <input
          type="date"
          value={birthDate}
          max={new Date().toISOString().slice(0, 10)}
          onChange={(e) => setBirthDate(e.target.value)}
          className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md focus:outline-none focus:border-[#1E88E5] font-mono"
        />
      </div>

      {ageData ? (
        <div className="space-y-4">
          {/* Main Age Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 text-center">
            <span className="text-xs uppercase tracking-wider text-slate-500 block mb-1">
              {isSo ? 'Da\'daada Saxda ah' : 'Your Exact Age'}
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold text-[#0A2342] font-mono tracking-tight mt-1">
              {ageData.years}{' '}
              <span className="text-sm font-sans font-normal text-slate-600 mr-2">
                {isSo ? 'sano' : 'years'}
              </span>
              {ageData.months}{' '}
              <span className="text-sm font-sans font-normal text-slate-600 mr-2">
                {isSo ? 'bilood' : 'months'}
              </span>
              {ageData.days}{' '}
              <span className="text-sm font-sans font-normal text-slate-600">
                {isSo ? 'maalmood' : 'days'}
              </span>
            </div>

            <div className="mt-3 text-xs text-slate-600 flex flex-wrap items-center justify-center gap-3">
              <span>
                {isSo ? 'Waxaad dhalatay maalin:' : 'Born on:'}{' '}
                <strong className="text-slate-900">{ageData.dayBorn}</strong>
              </span>
              <span>·</span>
              <span>
                {isSo ? 'Dhalashada xigta:' : 'Next Birthday:'}{' '}
                <strong className="text-emerald-700 font-mono">
                  {ageData.daysToNext} {isSo ? 'maalmood' : 'days'}
                </strong>
              </span>
            </div>
          </div>

          {/* Breakdown Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-white border border-slate-200 rounded-md text-center">
              <span className="text-xs text-slate-500 block">{isSo ? 'Wadarta Bilo' : 'Total Months'}</span>
              <span className="text-lg font-bold font-mono text-[#0A2342] tabular-nums">
                {ageData.totalMonths.toLocaleString()}
              </span>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-md text-center">
              <span className="text-xs text-slate-500 block">{isSo ? 'Wadarta Toddobaadyo' : 'Total Weeks'}</span>
              <span className="text-lg font-bold font-mono text-[#0A2342] tabular-nums">
                {ageData.totalWeeks.toLocaleString()}
              </span>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-md text-center">
              <span className="text-xs text-slate-500 block">{isSo ? 'Wadarta Maalmo' : 'Total Days'}</span>
              <span className="text-lg font-bold font-mono text-[#0A2342] tabular-nums">
                {ageData.totalDays.toLocaleString()}
              </span>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-md text-center">
              <span className="text-xs text-slate-500 block">{isSo ? 'Wadarta Saacado' : 'Total Hours'}</span>
              <span className="text-lg font-bold font-mono text-[#0A2342] tabular-nums">
                {ageData.totalHours.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#1E88E5] hover:bg-[#1976D2] rounded transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? (isSo ? 'La guriyay!' : 'Copied!') : (isSo ? 'Guri Da\'da' : 'Copy Age Stats')}
            </button>
          </div>
        </div>
      ) : (
        <div className="text-xs text-rose-600">
          {isSo ? 'Fadlan dooro taariikh sax ah oo hore.' : 'Please select a valid past date.'}
        </div>
      )}
    </div>
  );
};
