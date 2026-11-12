import React, { useState } from 'react';
import { Language } from '../../types';
import { Footprints, Flame, Copy, Check, RotateCcw, Award } from 'lucide-react';

interface Props {
  language: Language;
}

export const WalkingCalculator: React.FC<Props> = ({ language }) => {
  const isSo = language === 'so';

  const [steps, setSteps] = useState<string>('6500');
  const [weightKg, setWeightKg] = useState<string>('72');
  const [pace, setPace] = useState<'moderate' | 'brisk' | 'jog'>('moderate');
  const [copied, setCopied] = useState(false);

  const numSteps = parseInt(steps, 10) || 0;
  const weight = parseFloat(weightKg) || 70;

  // Approx 1 step = 0.76 meters (0.00076 km)
  const distanceKm = (numSteps * 0.00076);
  const distanceMiles = distanceKm * 0.621371;

  // Calorie calculation based on MET values
  // Moderate walk (3.5 MET) = ~0.045 kcal per step per 70kg
  const metFactor = pace === 'moderate' ? 3.5 : pace === 'brisk' ? 4.3 : 7.0;
  // Calories = MET * weight(kg) * time(hours)
  // Time hours: moderate 4.8 km/h, brisk 5.8 km/h, jog 8.0 km/h
  const speedKmH = pace === 'moderate' ? 4.8 : pace === 'brisk' ? 5.8 : 8.0;
  const timeHours = speedKmH > 0 ? distanceKm / speedKmH : 0;
  const timeMinutes = Math.round(timeHours * 60);

  const caloriesBurned = Math.round(metFactor * weight * timeHours);

  // Equivalent food comparison for fun lifestyle context
  const getFoodEquivalent = (cal: number) => {
    if (cal < 100) return isSo ? '1 Moos dhexe' : '1 medium banana';
    if (cal < 200) return isSo ? '1 Koob oo Shaah Cadaysan ah' : '1 Somali spiced milk tea';
    if (cal < 350) return isSo ? '1 Xabbo oo Sambuus ah' : '1 Crispy Sambusa';
    if (cal < 500) return isSo ? '1 Saxan oo Bariis & Khudaar ah' : '1 Plate of spiced rice';
    return isSo ? 'Cunto buuxda oo qado ah!' : 'A complete lunch meal!';
  };

  const stepsGoal = 10000;
  const progressPercent = Math.min(100, Math.round((numSteps / stepsGoal) * 100));

  const handleCopy = () => {
    const text = isSo
      ? `Socodka Maanta: ${numSteps.toLocaleString()} tallaabo (${distanceKm.toFixed(2)} km) | Kaloriyada la gubay: ~${caloriesBurned} kcal (~${timeMinutes} daqiiqo)`
      : `Walking Today: ${numSteps.toLocaleString()} steps (${distanceKm.toFixed(2)} km) | Burned: ~${caloriesBurned} kcal (~${timeMinutes} mins)`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            {isSo ? 'Tirada Tallaabooyinka (Steps)' : 'Steps Count'}
          </label>
          <input
            type="number"
            value={steps}
            onChange={(e) => setSteps(e.target.value)}
            className="w-full px-2.5 py-1.5 text-sm bg-white border border-slate-300 rounded font-mono"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            {isSo ? 'Culeyskaaga (Kg)' : 'Body Weight (kg)'}
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
            {isSo ? 'Xawaaraha Socodka' : 'Walking Pace'}
          </label>
          <select
            value={pace}
            onChange={(e) => setPace(e.target.value as any)}
            className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded font-medium"
          >
            <option value="moderate">{isSo ? 'Socod Caadi ah (~4.8 km/h)' : 'Moderate Walk (~4.8 km/h)'}</option>
            <option value="brisk">{isSo ? 'Socod Degdeg ah (~5.8 km/h)' : 'Brisk Walk (~5.8 km/h)'}</option>
            <option value="jog">{isSo ? 'Orod Fudud (~8.0 km/h)' : 'Light Jogging (~8.0 km/h)'}</option>
          </select>
        </div>
      </div>

      {/* Results Overview */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-4 border-b border-slate-200 text-center">
          <div>
            <span className="text-xs text-slate-500 block">{isSo ? 'Kaloriyada La Gubay' : 'Calories Burned'}</span>
            <div className="flex items-center justify-center gap-1 mt-0.5">
              <Flame className="w-4 h-4 text-rose-500" />
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-[#0A2342] tabular-nums">
                {caloriesBurned}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">kcal</span>
          </div>

          <div>
            <span className="text-xs text-slate-500 block">{isSo ? 'Masaafada (Distance)' : 'Distance'}</span>
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-[#1E88E5] tabular-nums block mt-0.5">
              {distanceKm.toFixed(2)}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">km ({distanceMiles.toFixed(1)} mi)</span>
          </div>

          <div>
            <span className="text-xs text-slate-500 block">{isSo ? 'Waqtiga Socodka' : 'Duration'}</span>
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 tabular-nums block mt-0.5">
              ~{timeMinutes}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">{isSo ? 'daqiiqo' : 'minutes'}</span>
          </div>

          <div>
            <span className="text-xs text-slate-500 block">{isSo ? 'U Dhiganta Cunto' : 'Equivalent Food'}</span>
            <span className="text-xs font-bold text-emerald-700 block mt-2">
              {getFoodEquivalent(caloriesBurned)}
            </span>
          </div>
        </div>

        {/* 10,000 Steps Progress */}
        <div className="mt-4">
          <div className="flex justify-between items-center text-xs mb-1 font-mono">
            <span className="text-slate-600 font-sans font-medium">
              {isSo ? `Hadafka 10,000 Tallaabo ee Maanta:` : `Goal: 10,000 Steps/Day:`} {numSteps.toLocaleString()} / 10,000
            </span>
            <span className="font-bold text-[#1E88E5]">{progressPercent}%</span>
          </div>

          <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#1E88E5] transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-200 flex justify-between items-center text-xs">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#1E88E5] hover:bg-[#1976D2] rounded transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? (isSo ? 'La guriyay!' : 'Copied!') : (isSo ? 'Guri Natiijada Socodka' : 'Copy Stats')}
          </button>
        </div>
      </div>
    </div>
  );
};
