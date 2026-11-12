import React, { useState } from 'react';
import { Language } from '../../types';
import { Moon, Sun, Clock, Copy, Check, Sparkles, AlarmClock } from 'lucide-react';

interface Props {
  language: Language;
}

export const SleepCalculator: React.FC<Props> = ({ language }) => {
  const isSo = language === 'so';

  const [mode, setMode] = useState<'sleepNow' | 'wakeAt'>('wakeAt');
  const [targetWakeHour, setTargetWakeHour] = useState<string>('05:00'); // Default Fajr wake-up 5:00 AM
  const [copied, setCopied] = useState(false);

  // Helper to format hours:mins
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  // 90 minutes per sleep cycle + 14 minutes average to fall asleep
  const calculateSleepNowTimes = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 14); // Time to fall asleep

    const cycles = [3, 4, 5, 6]; // 4.5h, 6h, 7.5h, 9h
    return cycles.map((c) => {
      const d = new Date(now.getTime() + c * 90 * 60 * 1000);
      return {
        cycles: c,
        hours: (c * 1.5).toFixed(1),
        time: formatTime(d),
        isRecommended: c === 5 || c === 6,
      };
    });
  };

  const calculateBedTimesForWake = () => {
    const [h, m] = targetWakeHour.split(':').map(Number);
    const target = new Date();
    target.setHours(h, m, 0, 0);

    const cycles = [6, 5, 4, 3]; // 9h, 7.5h, 6h, 4.5h before wake time
    return cycles.map((c) => {
      // Subtract (cycles * 90 mins + 14 mins to fall asleep)
      const bedDate = new Date(target.getTime() - (c * 90 + 14) * 60 * 1000);
      return {
        cycles: c,
        hours: (c * 1.5).toFixed(1),
        time: formatTime(bedDate),
        isRecommended: c === 5 || c === 6,
      };
    });
  };

  const sleepNowOptions = calculateSleepNowTimes();
  const wakeAtOptions = calculateBedTimesForWake();

  const handleCopy = (summary: string) => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Mode Switch */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
        <button
          onClick={() => setMode('wakeAt')}
          className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded transition-colors ${
            mode === 'wakeAt' ? 'bg-white text-[#0A2342] shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {isSo ? 'Waqtiga aan rabo inaan tooso (Tusaale Salaadda Subax)' : 'I need to wake up at...'}
        </button>

        <button
          onClick={() => setMode('sleepNow')}
          className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded transition-colors ${
            mode === 'sleepNow' ? 'bg-white text-[#0A2342] shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {isSo ? 'Haddii aan hadda seexdo...' : 'If I sleep right now...'}
        </button>
      </div>

      {mode === 'wakeAt' ? (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <div>
              <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                {isSo ? 'Goorma ayaad doonaysaa inaad soo toosto?' : 'Select Target Wake-up Time:'}
              </span>
              <p className="text-xs text-slate-500 mt-0.5">
                {isSo
                  ? 'Waxaa lagula talinayaa in la qabto waqti ku beegan Salaadda Subax ama shaqada.'
                  : 'Calculated using 90-minute restorative sleep cycles to avoid grogginess.'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <AlarmClock className="w-4 h-4 text-[#1E88E5]" />
              <input
                type="time"
                value={targetWakeHour}
                onChange={(e) => setTargetWakeHour(e.target.value)}
                className="px-2.5 py-1 text-sm font-bold font-mono text-[#0A2342] bg-white border border-slate-300 rounded focus:outline-none focus:border-[#1E88E5]"
              />
            </div>
          </div>

          <div>
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
              {isSo ? 'Waqtiyada ugu habboon ee ay tahay inaad seexato caawa:' : 'Optimal Bedtimes for Tonight:'}
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {wakeAtOptions.map((opt, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-lg border transition-all text-center ${
                    opt.isRecommended
                      ? 'bg-blue-50/60 border-[#1E88E5] shadow-xs'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="text-2xl font-bold font-mono text-[#0A2342] tabular-nums">
                    {opt.time}
                  </div>
                  <span className="text-xs font-semibold text-slate-600 block mt-1">
                    {opt.hours} {isSo ? 'saacadood' : 'hours'} ({opt.cycles} {isSo ? 'wareeg' : 'cycles'})
                  </span>
                  {opt.isRecommended && (
                    <span className="text-[10px] font-bold text-[#1E88E5] uppercase tracking-wider block mt-1.5">
                      ★ {isSo ? 'Ugu Wanaagsan' : 'Recommended'}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-xs text-slate-600">
            {isSo
              ? 'Haddii aad hadda sariirta tagto (iyadoo lagu xisaabtamay 14 daqiiqo oo hurdadu kugu timaado), kuwani waa waqtiyada ay tahay inaad toosto adoo firfircoon:'
              : 'If you head to sleep right now (including ~14 mins to fall asleep), wake up at one of these cycle completions:'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {sleepNowOptions.map((opt, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-lg border transition-all text-center ${
                  opt.isRecommended
                    ? 'bg-blue-50/60 border-[#1E88E5] shadow-xs'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="text-2xl font-bold font-mono text-[#0A2342] tabular-nums">
                  {opt.time}
                </div>
                <span className="text-xs font-semibold text-slate-600 block mt-1">
                  {opt.hours} {isSo ? 'saacadood' : 'hours'} ({opt.cycles} {isSo ? 'wareeg' : 'cycles'})
                </span>
                {opt.isRecommended && (
                  <span className="text-[10px] font-bold text-[#1E88E5] uppercase tracking-wider block mt-1.5">
                    ★ {isSo ? 'Ugu Wanaagsan' : 'Recommended'}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sleep Science Advice */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 space-y-1.5">
        <span className="font-bold text-slate-800 uppercase tracking-wider block">
          {isSo ? 'Cilmiga Hurdada (90-Minute Sleep Cycles)' : 'Why 90-Minute Sleep Cycles Matter'}
        </span>
        <p className="leading-relaxed">
          {isSo
            ? 'Hurdadu waxay martaa wareegyo 90 daqiiqo ah. Haddii aad soo toosto bartamaha wareegga, waxaad dareemaysaa caajis iyo daal badan. Laakiin haddii aad toosto marka wareeggu dhammaado, waxaad toosaysaa adoo aad u firfircoon!'
            : 'Waking up in the middle of a sleep cycle leaves you feeling exhausted. Waking up at the completion of a 90-minute REM cycle ensures you feel energized and alert.'}
        </p>
      </div>
    </div>
  );
};
