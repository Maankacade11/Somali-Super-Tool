import React, { useState } from 'react';
import { Language } from '../../types';
import { Activity, Copy, Check, RotateCcw, HeartPulse } from 'lucide-react';

interface Props {
  language: Language;
}

export const BmiCalculator: React.FC<Props> = ({ language }) => {
  const isSo = language === 'so';

  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('metric');
  const [weightKg, setWeightKg] = useState<string>('72');
  const [heightCm, setHeightCm] = useState<string>('175');

  const [weightLbs, setWeightLbs] = useState<string>('160');
  const [heightFeet, setHeightFeet] = useState<string>('5');
  const [heightInches, setHeightInches] = useState<string>('9');

  const [copied, setCopied] = useState(false);

  // Calculate BMI
  let weight = 0;
  let heightInMeters = 0;

  if (unitSystem === 'metric') {
    weight = parseFloat(weightKg) || 0;
    heightInMeters = (parseFloat(heightCm) || 0) / 100;
  } else {
    weight = (parseFloat(weightLbs) || 0) * 0.453592;
    const totalInches = (parseFloat(heightFeet) || 0) * 12 + (parseFloat(heightInches) || 0);
    heightInMeters = totalInches * 0.0254;
  }

  const bmi = heightInMeters > 0 ? weight / (heightInMeters * heightInMeters) : 0;

  // Ideal weight range for normal BMI 18.5 - 24.9
  const minNormalWeight = heightInMeters > 0 ? 18.5 * heightInMeters * heightInMeters : 0;
  const maxNormalWeight = heightInMeters > 0 ? 24.9 * heightInMeters * heightInMeters : 0;

  const getStatus = (val: number) => {
    if (val <= 0) return { label: '—', color: 'text-slate-500', barWidth: '0%', barColor: 'bg-slate-300' };
    if (val < 18.5)
      return {
        label: isSo ? 'Miisaan Hooseeya (Underweight)' : 'Underweight',
        color: 'text-amber-600',
        barWidth: '25%',
        barColor: 'bg-amber-500',
        adviceSo: 'Culeyskaagu wuxuu ka hooseeyaa heerkii caadiga ahaa. Waxaa lagula talinayaa cunto nafaqo leh.',
        adviceEn: 'Your weight is below the standard range. Focus on nutrient-dense meals and balanced calories.',
      };
    if (val < 25.0)
      return {
        label: isSo ? 'Miisaan Caafimaad Qaba (Normal)' : 'Normal Weight',
        color: 'text-emerald-700',
        barWidth: '50%',
        barColor: 'bg-emerald-600',
        adviceSo: 'Culeyskaagu waa mid caafimaad qaba oo heer sare ah. Sii wad jimicsiga iyo cuntada wanaagsan.',
        adviceEn: 'You have a healthy body weight for your height. Maintain regular physical activity and balanced diet.',
      };
    if (val < 30.0)
      return {
        label: isSo ? 'Miisaan Dheeraad ah (Overweight)' : 'Overweight',
        color: 'text-amber-600',
        barWidth: '75%',
        barColor: 'bg-amber-500',
        adviceSo: 'Waxaad leedahay xoogaa culeys dheeraad ah. Socod maalinle ah iyo xakameynta sokorta ayaa waxtar leh.',
        adviceEn: 'You have mild excess weight. Regular walking, portion control, and reducing refined sugars will help.',
      };
    return {
      label: isSo ? 'Cayil Xad-Dhaaf ah (Obesity)' : 'Obese',
      color: 'text-rose-600',
      barWidth: '100%',
      barColor: 'bg-rose-500',
      adviceSo: 'Culeyskaagu aad buu u sarreeyaa. Waxaa muhiim ah inaad la tashato dhakhtar ama qof xirfadle ah.',
      adviceEn: 'High BMI increases health risks. We recommend consulting a healthcare provider for personalized guidance.',
    };
  };

  const status = getStatus(bmi);

  const handleCopy = () => {
    const text = isSo
      ? `BMI-gaygu waa: ${bmi.toFixed(1)} (${status.label}) | Miisaanka Caadiga ah: ${minNormalWeight.toFixed(1)} - ${maxNormalWeight.toFixed(1)} kg`
      : `My BMI is: ${bmi.toFixed(1)} (${status.label}) | Healthy Weight Range: ${minNormalWeight.toFixed(1)} - ${maxNormalWeight.toFixed(1)} kg`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Unit system switcher */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
        <button
          onClick={() => setUnitSystem('metric')}
          className={`flex-1 py-1.5 px-3 text-xs font-medium rounded transition-colors ${
            unitSystem === 'metric'
              ? 'bg-white text-[#0A2342] shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {isSo ? 'Halbeegga Metric (Kg / Cm)' : 'Metric (Kg / Cm)'}
        </button>
        <button
          onClick={() => setUnitSystem('imperial')}
          className={`flex-1 py-1.5 px-3 text-xs font-medium rounded transition-colors ${
            unitSystem === 'imperial'
              ? 'bg-white text-[#0A2342] shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {isSo ? 'Halbeegga Imperial (Lbs / Feet)' : 'Imperial (Lbs / Feet)'}
        </button>
      </div>

      {/* Input fields */}
      {unitSystem === 'metric' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              {isSo ? 'Culeyska / Miisaanka (Kg)' : 'Weight (kg)'}
            </label>
            <input
              type="number"
              value={weightKg}
              onChange={(e) => setWeightKg(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md font-mono tabular-nums focus:outline-none focus:border-[#1E88E5]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              {isSo ? 'Dhererka (Sentimitir - cm)' : 'Height (cm)'}
            </label>
            <input
              type="number"
              value={heightCm}
              onChange={(e) => setHeightCm(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md font-mono tabular-nums focus:outline-none focus:border-[#1E88E5]"
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              {isSo ? 'Culeyska (Pounds - lbs)' : 'Weight (lbs)'}
            </label>
            <input
              type="number"
              value={weightLbs}
              onChange={(e) => setWeightLbs(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md font-mono tabular-nums focus:outline-none focus:border-[#1E88E5]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              {isSo ? 'Dhererka (Feet & Inches)' : 'Height (ft & in)'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Feet"
                value={heightFeet}
                onChange={(e) => setHeightFeet(e.target.value)}
                className="w-full px-2.5 py-2 text-sm bg-white border border-slate-300 rounded-md font-mono"
              />
              <input
                type="number"
                placeholder="Inches"
                value={heightInches}
                onChange={(e) => setHeightInches(e.target.value)}
                className="w-full px-2.5 py-2 text-sm bg-white border border-slate-300 rounded-md font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {/* Result Card */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-5">
        <div className="text-center py-4 border-b border-slate-200">
          <span className="text-xs uppercase tracking-wider text-slate-500 block mb-1">
            {isSo ? 'Heerkaaga BMI (Body Mass Index)' : 'Your Body Mass Index (BMI)'}
          </span>
          <div className="text-4xl sm:text-5xl font-extrabold text-[#0A2342] font-mono tabular-nums">
            {bmi > 0 ? bmi.toFixed(1) : '—'}
          </div>
          <div className={`mt-2 text-sm font-bold ${status.color}`}>
            {status.label}
          </div>
        </div>

        {/* BMI Scale Progress Bar */}
        <div className="mt-4">
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className={`h-full ${status.barColor} transition-all duration-300`}
              style={{ width: status.barWidth }}
            />
          </div>

          <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
            <span>&lt; 18.5</span>
            <span>18.5 – 24.9</span>
            <span>25.0 – 29.9</span>
            <span>30.0+</span>
          </div>
        </div>

        {/* Guidance and Healthy range */}
        {status.adviceSo && (
          <div className="mt-4 p-3 bg-white border border-slate-200 rounded text-xs text-slate-600 leading-relaxed">
            {isSo ? status.adviceSo : status.adviceEn}
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
          <div>
            <span className="font-semibold text-slate-800">
              {isSo ? 'Miisaanka Caadiga ah ee dhererkaaga:' : 'Healthy Weight for your height:'}
            </span>{' '}
            <span className="font-mono tabular-nums font-medium text-emerald-700">
              {minNormalWeight.toFixed(1)} – {maxNormalWeight.toFixed(1)} kg
            </span>
          </div>

          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#1E88E5] hover:bg-[#1976D2] rounded transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? (isSo ? 'La guriyay!' : 'Copied!') : (isSo ? 'Guri Natiijada' : 'Copy Result')}
          </button>
        </div>
      </div>
    </div>
  );
};
