import React, { useState } from 'react';
import { Language } from '../../types';
import { Calendar, Copy, Check, ArrowLeftRight } from 'lucide-react';

interface Props {
  language: Language;
}

const HIJRI_MONTHS_SO = [
  'Muxarram',
  'Safar',
  'Rabiicul Awal',
  'Rabiicul Aakhir',
  'Jumaada Hore',
  'Jumaada Dambe',
  'Rajab',
  'Shacbaan',
  'Ramadaan',
  'Shawaal',
  'Dul-Qacdah',
  'Dul-Xijjah',
];

const HIJRI_MONTHS_EN = [
  'Muharram',
  'Safar',
  'Rabi al-Awwal',
  'Rabi al-Thani',
  'Jumada al-Ula',
  'Jumada al-Thani',
  'Rajab',
  'Sha\'ban',
  'Ramadan',
  'Shawwal',
  'Dhu al-Qi\'dah',
  'Dhu al-Hijjah',
];

// Julian Day Number conversions
function gregorianToJulianDay(year: number, month: number, day: number): number {
  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  return (
    Math.floor(365.25 * (year + 4716)) +
    Math.floor(30.6001 * (month + 1)) +
    day +
    B -
    1524.5
  );
}

function julianDayToHijri(jd: number): { year: number; month: number; day: number } {
  jd = Math.floor(jd) + 0.5;
  const l = Math.floor(jd - 1948440 + 10632);
  const n = Math.floor((l - 1) / 10631);
  const l1 = l - 10631 * n + 354;
  const j =
    Math.floor((10985 - l1) / 5316) * Math.floor((50 * l1) / 17719) +
    Math.floor(l1 / 5670) * Math.floor((43 * l1) / 15238);
  const l2 =
    l1 -
    Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
    Math.floor(j / 16) * Math.floor((15238 * j) / 43) +
    29;
  const month = Math.floor((24 * l2) / 709);
  const day = l2 - Math.floor((709 * month) / 24);
  const year = 30 * n + j - 30;

  return { year, month, day };
}

function hijriToJulianDay(year: number, month: number, day: number): number {
  return (
    day +
    Math.ceil(29.5 * (month - 1)) +
    (year - 1) * 354 +
    Math.floor((3 + 11 * year) / 30) +
    1948440 -
    385
  );
}

function julianDayToGregorian(jd: number): { year: number; month: number; day: number } {
  const z = Math.floor(jd + 0.5);
  const a = Math.floor((z - 1867216.25) / 36524.25);
  const b = z + 1 + a - Math.floor(a / 4);
  const c = b + 1524;
  const d = Math.floor((c - 122.1) / 365.25);
  const e = Math.floor(365.25 * d);
  const g = Math.floor((c - e) / 30.6001);
  const day = c - e - Math.floor(30.6001 * g);
  const month = g < 14 ? g - 1 : g - 13;
  const year = month > 2 ? d - 4716 : d - 4715;
  return { year, month, day };
}

export const DateConverter: React.FC<Props> = ({ language }) => {
  const isSo = language === 'so';

  const today = new Date();
  const [gregorianDate, setGregorianDate] = useState<string>(
    today.toISOString().slice(0, 10)
  );

  const [hijriYear, setHijriYear] = useState<number>(1448);
  const [hijriMonth, setHijriMonth] = useState<number>(5);
  const [hijriDay, setHijriDay] = useState<number>(23);

  const [mode, setMode] = useState<'gToH' | 'hToG'>('gToH');
  const [copied, setCopied] = useState(false);

  // Compute Today's live Hijri
  const todayJd = gregorianToJulianDay(
    today.getFullYear(),
    today.getMonth() + 1,
    today.getDate()
  );
  const todayHijri = julianDayToHijri(todayJd);

  // Calculate current conversion
  let convertedHijriText = '';
  let convertedGregorianText = '';

  if (mode === 'gToH') {
    const [y, m, d] = gregorianDate.split('-').map(Number);
    if (y && m && d) {
      const jd = gregorianToJulianDay(y, m, d);
      const h = julianDayToHijri(jd);
      const monthName = isSo
        ? HIJRI_MONTHS_SO[h.month - 1]
        : HIJRI_MONTHS_EN[h.month - 1];
      convertedHijriText = `${h.day} ${monthName} ${h.year} AH`;
    }
  } else {
    const jd = hijriToJulianDay(hijriYear, hijriMonth, hijriDay);
    const g = julianDayToGregorian(jd);
    convertedGregorianText = `${g.day.toString().padStart(2, '0')}/${g.month
      .toString()
      .padStart(2, '0')}/${g.year}`;
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Today's Official Hijri Card */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            {isSo ? 'Taariikhda Hijriga ee Maanta' : "Today's Hijri Date"}
          </span>
          <div className="text-lg sm:text-xl font-bold text-[#0A2342] mt-0.5">
            {todayHijri.day}{' '}
            {isSo
              ? HIJRI_MONTHS_SO[todayHijri.month - 1]
              : HIJRI_MONTHS_EN[todayHijri.month - 1]}{' '}
            {todayHijri.year} AH
          </div>
          <span className="text-xs text-slate-500">
            {today.toLocaleDateString(isSo ? 'so-SO' : 'en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>

        <button
          onClick={() =>
            handleCopy(
              `${todayHijri.day} ${
                isSo
                  ? HIJRI_MONTHS_SO[todayHijri.month - 1]
                  : HIJRI_MONTHS_EN[todayHijri.month - 1]
              } ${todayHijri.year} AH`
            )
          }
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-100 transition-colors shrink-0"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-emerald-600" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
          {copied
            ? isSo
              ? 'La guriyay!'
              : 'Copied!'
            : isSo
            ? 'Guri Maanta'
            : 'Copy Today'}
        </button>
      </div>

      {/* Mode Switch */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
        <button
          onClick={() => setMode('gToH')}
          className={`flex-1 py-1.5 px-3 text-xs font-medium rounded transition-colors ${
            mode === 'gToH'
              ? 'bg-white text-[#0A2342] shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {isSo ? 'Miilaadi -> Hijri' : 'Gregorian to Hijri'}
        </button>
        <button
          onClick={() => setMode('hToG')}
          className={`flex-1 py-1.5 px-3 text-xs font-medium rounded transition-colors ${
            mode === 'hToG'
              ? 'bg-white text-[#0A2342] shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {isSo ? 'Hijri -> Miilaadi' : 'Hijri to Gregorian'}
        </button>
      </div>

      {/* Converter Section */}
      {mode === 'gToH' ? (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              {isSo ? 'Dooro Taariikhda Miilaadiga' : 'Select Gregorian Date'}
            </label>
            <input
              type="date"
              value={gregorianDate}
              onChange={(e) => setGregorianDate(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md focus:outline-none focus:border-[#1E88E5] font-mono"
            />
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 text-center">
            <span className="text-xs uppercase tracking-wider text-slate-500 block mb-1">
              {isSo ? 'U dhiganta Taariikhda Hijriga' : 'Equivalent Hijri Date'}
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-[#0A2342] font-mono mt-1">
              {convertedHijriText}
            </div>

            <button
              onClick={() => handleCopy(convertedHijriText)}
              className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#1E88E5] hover:bg-[#1976D2] rounded transition-colors"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              {copied
                ? isSo
                  ? 'La guriyay!'
                  : 'Copied!'
                : isSo
                ? 'Guri Taariikhda'
                : 'Copy Date'}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                {isSo ? 'Maalinta (1-30)' : 'Day'}
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={hijriDay}
                onChange={(e) => setHijriDay(parseInt(e.target.value) || 1)}
                className="w-full px-2 py-1.5 text-sm bg-white border border-slate-300 rounded-md font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                {isSo ? 'Bisha' : 'Month'}
              </label>
              <select
                value={hijriMonth}
                onChange={(e) => setHijriMonth(parseInt(e.target.value) || 1)}
                className="w-full px-2 py-1.5 text-xs bg-white border border-slate-300 rounded-md"
              >
                {HIJRI_MONTHS_SO.map((m, idx) => (
                  <option key={idx} value={idx + 1}>
                    {idx + 1}. {isSo ? m : HIJRI_MONTHS_EN[idx]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                {isSo ? 'Sanadka (AH)' : 'Year (AH)'}
              </label>
              <input
                type="number"
                value={hijriYear}
                onChange={(e) => setHijriYear(parseInt(e.target.value) || 1445)}
                className="w-full px-2 py-1.5 text-sm bg-white border border-slate-300 rounded-md font-mono"
              />
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 text-center">
            <span className="text-xs uppercase tracking-wider text-slate-500 block mb-1">
              {isSo
                ? 'U dhiganta Taariikhda Miilaadiga'
                : 'Equivalent Gregorian Date'}
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-[#0A2342] font-mono mt-1">
              {convertedGregorianText}
            </div>

            <button
              onClick={() => handleCopy(convertedGregorianText)}
              className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#1E88E5] hover:bg-[#1976D2] rounded transition-colors"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              {copied
                ? isSo
                  ? 'La guriyay!'
                  : 'Copied!'
                : isSo
                ? 'Guri Taariikhda'
                : 'Copy Date'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
