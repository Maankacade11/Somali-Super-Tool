import React, { useState, useEffect } from 'react';
import { Language } from '../../types';
import { Droplet, Plus, Minus, RotateCcw, Check, Sparkles } from 'lucide-react';

interface Props {
  language: Language;
}

export const WaterTracker: React.FC<Props> = ({ language }) => {
  const isSo = language === 'so';

  const [weightKg, setWeightKg] = useState<string>('70');
  const [climate, setClimate] = useState<'hot' | 'moderate'>('hot'); // Hot climate default for Somalia/East Africa
  const [activityMinutes, setActivityMinutes] = useState<string>('30');

  // Track daily intake
  const [glassesConsumed, setGlassesConsumed] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('somali_water_glasses');
      const savedDate = localStorage.getItem('somali_water_date');
      const todayDate = new Date().toISOString().slice(0, 10);
      if (saved && savedDate === todayDate) {
        return parseInt(saved, 10) || 0;
      }
      return 0;
    } catch (e) {
      return 0;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('somali_water_glasses', String(glassesConsumed));
      localStorage.setItem('somali_water_date', new Date().toISOString().slice(0, 10));
    } catch (e) {
      console.error(e);
    }
  }, [glassesConsumed]);

  const weight = parseFloat(weightKg) || 70;
  const activity = parseFloat(activityMinutes) || 0;

  // Base requirement: 35ml per kg of body weight
  let requiredMl = weight * 35;
  // Extra for hot climate (+500ml)
  if (climate === 'hot') requiredMl += 500;
  // Extra for exercise (+350ml per 30 mins)
  requiredMl += (activity / 30) * 350;

  const targetLiters = (requiredMl / 1000).toFixed(1);
  const targetGlasses = Math.max(6, Math.ceil(requiredMl / 250)); // 250ml per standard glass

  const currentLiters = ((glassesConsumed * 250) / 1000).toFixed(1);
  const percentComplete = Math.min(100, Math.round((glassesConsumed / targetGlasses) * 100));

  const addGlass = () => setGlassesConsumed((prev) => prev + 1);
  const removeGlass = () => setGlassesConsumed((prev) => Math.max(0, prev - 1));
  const resetGlasses = () => setGlassesConsumed(0);

  return (
    <div className="space-y-6">
      {/* Lifestyle guidance note */}
      <div className="p-3 bg-blue-50/60 border border-blue-200/60 rounded-md text-xs text-slate-700 flex items-start gap-2">
        <Droplet className="w-4 h-4 text-[#1E88E5] shrink-0 mt-0.5" />
        <div>
          {isSo
            ? 'Cimilada kulul ee Soomaaliya iyo daalka maalinlaha ah waxay kordhiyaan baahida biyaha. Cabista biyo kugu filan waxay ka hortagtaa xanuunnada kelyaha iyo madax-xanuunka.'
            : 'Warm tropical climates and daily activity accelerate dehydration. Drinking adequate water protects kidney health, improves mental focus, and maintains vitality.'}
        </div>
      </div>

      {/* Target Calculator Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            {isSo ? 'Culeyskaaga (Kg)' : 'Weight (kg)'}
          </label>
          <input
            type="number"
            value={weightKg}
            onChange={(e) => setWeightKg(e.target.value)}
            className="w-full px-2.5 py-1.5 text-sm bg-white border border-slate-300 rounded font-mono"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            {isSo ? 'Cimilada (Climate)' : 'Climate'}
          </label>
          <select
            value={climate}
            onChange={(e) => setClimate(e.target.value as any)}
            className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded font-medium"
          >
            <option value="hot">{isSo ? 'Kulul (Muqdisho, Bosaso, Hargeysa)' : 'Hot / Tropical'}</option>
            <option value="moderate">{isSo ? 'Dhexdhexaad / Qabow (Qurba-joog)' : 'Moderate / Temperate'}</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            {isSo ? 'Socodka / Jimicsiga (Daqiiqo)' : 'Daily Activity (Mins)'}
          </label>
          <input
            type="number"
            value={activityMinutes}
            onChange={(e) => setActivityMinutes(e.target.value)}
            className="w-full px-2.5 py-1.5 text-sm bg-white border border-slate-300 rounded font-mono"
          />
        </div>
      </div>

      {/* Progress & Live Tracker Card */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <span className="text-xs uppercase tracking-wider text-slate-500 block mb-1">
              {isSo ? 'Biyaha Aad Cabtay Maanta' : 'Water Consumed Today'}
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold text-[#0A2342] font-mono tabular-nums">
              {glassesConsumed}{' '}
              <span className="text-sm font-sans font-normal text-slate-500">
                / {targetGlasses} {isSo ? 'koob' : 'glasses'} ({currentLiters} / {targetLiters}L)
              </span>
            </div>
          </div>

          {/* Quick Plus/Minus */}
          <div className="flex items-center gap-2">
            <button
              onClick={removeGlass}
              disabled={glassesConsumed === 0}
              className="p-2 border border-slate-300 rounded bg-white hover:bg-slate-100 disabled:opacity-40 text-slate-700 transition-colors"
              title={isSo ? 'Ka dhim 1 koob' : 'Minus 1 glass'}
            >
              <Minus className="w-4 h-4" />
            </button>
            <button
              onClick={addGlass}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#1E88E5] hover:bg-[#1976D2] rounded transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>{isSo ? 'Kudar 1 Koob (250ml)' : 'Drink 1 Glass'}</span>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between items-center text-xs mb-1 font-mono">
            <span className="text-slate-600 font-sans font-medium">
              {percentComplete >= 100
                ? isSo ? 'Hambalyo! Hadafka biyaha maanta waad buuxisay.' : 'Goal completed for today!'
                : isSo ? `Waxaa kuu dhiman ${targetGlasses - glassesConsumed} koob` : `${targetGlasses - glassesConsumed} glasses left`}
            </span>
            <span className="font-bold text-[#1E88E5]">{percentComplete}%</span>
          </div>

          <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                percentComplete >= 100 ? 'bg-emerald-600' : 'bg-[#1E88E5]'
              }`}
              style={{ width: `${percentComplete}%` }}
            />
          </div>
        </div>

        {/* Glasses Visual Icons Matrix */}
        <div className="mt-4 flex flex-wrap gap-2 pt-2">
          {Array.from({ length: targetGlasses }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setGlassesConsumed(idx + 1)}
              className={`p-2 rounded border text-center transition-all ${
                idx < glassesConsumed
                  ? 'bg-[#E3F2FD] border-[#1E88E5] text-[#1E88E5]'
                  : 'bg-white border-slate-200 text-slate-300 hover:border-slate-300'
              }`}
              title={isSo ? `Koob #${idx + 1}` : `Glass #${idx + 1}`}
            >
              <Droplet className="w-4 h-4 fill-current" />
            </button>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-200 flex justify-between items-center text-xs text-slate-400">
          <span>{isSo ? 'Si toos ah ugu kaydsan qalabkaaga maanta' : 'Auto-saved locally for today'}</span>
          <button
            onClick={resetGlasses}
            className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800"
          >
            <RotateCcw className="w-3 h-3" />
            {isSo ? 'Dib u deji maanta' : 'Reset Today'}
          </button>
        </div>
      </div>
    </div>
  );
};
