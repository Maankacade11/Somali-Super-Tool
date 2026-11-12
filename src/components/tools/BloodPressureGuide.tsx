import React, { useState, useEffect } from 'react';
import { Language } from '../../types';
import { HeartPulse, AlertTriangle, CheckCircle, Info, Copy, Check, RotateCcw } from 'lucide-react';

interface Props {
  language: Language;
}

interface BpLog {
  id: string;
  sys: number;
  dia: number;
  pulse?: number;
  date: string;
  category: string;
}

export const BloodPressureGuide: React.FC<Props> = ({ language }) => {
  const isSo = language === 'so';

  const [systolic, setSystolic] = useState<string>('120');
  const [diastolic, setDiastolic] = useState<string>('80');
  const [pulse, setPulse] = useState<string>('72');

  const [logs, setLogs] = useState<BpLog[]>(() => {
    try {
      const saved = localStorage.getItem('somali_bp_logs');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('somali_bp_logs', JSON.stringify(logs));
    } catch (e) {
      console.error(e);
    }
  }, [logs]);

  const sys = parseInt(systolic, 10) || 0;
  const dia = parseInt(diastolic, 10) || 0;

  const evaluateBP = (s: number, d: number) => {
    if (s <= 0 || d <= 0) {
      return {
        labelSo: '—',
        labelEn: '—',
        color: 'text-slate-500',
        bg: 'bg-slate-100',
        badge: 'bg-slate-200 text-slate-700',
        adviceSo: 'Geli cabbiraadda dhiiggaaga.',
        adviceEn: 'Enter your blood pressure reading.',
      };
    }
    if (s > 180 || d > 120) {
      return {
        labelSo: 'Xaalad Degdeg ah (Hypertensive Crisis)',
        labelEn: 'Hypertensive Crisis',
        color: 'text-rose-700',
        bg: 'bg-rose-50 border-rose-300',
        badge: 'bg-rose-600 text-white',
        adviceSo: 'Fadlan isla markiiba la xiriir rug caafimaad ama dhakhtar degdeg ah! Cadaadiskaagu aad buu u sarreeyaa.',
        adviceEn: 'Seek immediate emergency medical care! Your reading is dangerously high.',
      };
    }
    if (s >= 140 || d >= 90) {
      return {
        labelSo: 'Dhiig-kar Heer 2 (Hypertension Stage 2)',
        labelEn: 'Hypertension Stage 2',
        color: 'text-rose-600',
        bg: 'bg-rose-50 border-rose-200',
        badge: 'bg-rose-100 text-rose-800',
        adviceSo: 'Dhiiggaagu wuu sarreeyaa. Waxaa lagula talinayaa inaad la tashato dhakhtar, yarayso cusbada, joojiso sigaarka/qaadka, oo aad jimicsi sameyso.',
        adviceEn: 'High blood pressure requiring medical evaluation, strict sodium reduction, and lifestyle interventions.',
      };
    }
    if ((s >= 130 && s <= 139) || (d >= 80 && d <= 89)) {
      return {
        labelSo: 'Dhiig-kar Heer 1 (Hypertension Stage 1)',
        labelEn: 'Hypertension Stage 1',
        color: 'text-amber-600',
        bg: 'bg-amber-50 border-amber-200',
        badge: 'bg-amber-100 text-amber-800',
        adviceSo: 'Dhiig-karku wuxuu ku jiraa heerka koowaad. Yaree cusbada cuntada (bariiska/suugada), cab biyo badan, socodna samee ugu yaraan 30 daqiiqo maalin kasta.',
        adviceEn: 'Mild hypertension. Adopt a heart-healthy diet, limit sodium, walk regularly, and manage daily stress.',
      };
    }
    if (s >= 120 && s <= 129 && d < 80) {
      return {
        labelSo: 'Heer Sareeya / Digniin (Elevated)',
        labelEn: 'Elevated Blood Pressure',
        color: 'text-amber-600',
        bg: 'bg-amber-50 border-amber-200',
        badge: 'bg-amber-100 text-amber-800',
        adviceSo: 'Cadaadiska dhiiggaagu xoogaa wuu ka sarreeyaa caadiga. Waa waqti fiican oo aad ku saxdo cuntooyinka aad cuntid iyo miisaankaaga.',
        adviceEn: 'Blood pressure is slightly elevated. Lifestyle modifications can prevent progression to hypertension.',
      };
    }
    return {
      labelSo: 'Caadi & Caafimaad Qaba (Normal)',
      labelEn: 'Normal & Healthy',
      color: 'text-emerald-700',
      bg: 'bg-emerald-50 border-emerald-200',
      badge: 'bg-emerald-100 text-emerald-800',
      adviceSo: 'Cadaadiska dhiiggaagu waa heer aad u wanaagsan oo caafimaad qaba. Sii wad qaab-nololeedkaaga wanaagsan.',
      adviceEn: 'Your blood pressure is in the ideal healthy range. Maintain your healthy habits and balanced diet.',
    };
  };

  const currentStatus = evaluateBP(sys, dia);

  const saveLog = () => {
    if (sys > 0 && dia > 0) {
      const newEntry: BpLog = {
        id: Date.now().toString(),
        sys,
        dia,
        pulse: parseInt(pulse, 10) || undefined,
        date: new Date().toLocaleDateString(isSo ? 'so-SO' : 'en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        category: isSo ? currentStatus.labelSo : currentStatus.labelEn,
      };
      setLogs([newEntry, ...logs.slice(0, 4)]);
    }
  };

  const handleCopy = () => {
    const text = `Cadaadiska Dhiigga: ${sys}/${dia} mmHg (${isSo ? currentStatus.labelSo : currentStatus.labelEn})${pulse ? ` | Garaaca Wadnaha: ${pulse} bpm` : ''}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Intro Health Note */}
      <div className="p-3 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-600 flex items-start gap-2">
        <HeartPulse className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
        <div>
          {isSo
            ? 'Dhiig-karka waxaa loo yaqaannaa "Dilaaga Aamusan". Hubinta joogtada ah iyo yaraynta cusbada cuntada ayaa ka hortagta wadne-istaagga iyo faaliga.'
            : 'Hypertension is known as the silent threat. Regular monitoring, low sodium intake, and active lifestyle protect against stroke and cardiovascular illness.'}
        </div>
      </div>

      {/* Inputs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            {isSo ? 'Cadaadiska Sare (Systolic - mmHg)' : 'Systolic (Top number)'}
          </label>
          <input
            type="number"
            value={systolic}
            onChange={(e) => setSystolic(e.target.value)}
            placeholder="120"
            className="w-full px-2.5 py-1.5 text-base font-bold font-mono text-[#0A2342] bg-white border border-slate-300 rounded focus:outline-none focus:border-[#1E88E5]"
          />
          <span className="text-[10px] text-slate-400 block mt-0.5">Caadi: &lt; 120</span>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            {isSo ? 'Cadaadiska Hoose (Diastolic - mmHg)' : 'Diastolic (Bottom number)'}
          </label>
          <input
            type="number"
            value={diastolic}
            onChange={(e) => setDiastolic(e.target.value)}
            placeholder="80"
            className="w-full px-2.5 py-1.5 text-base font-bold font-mono text-[#0A2342] bg-white border border-slate-300 rounded focus:outline-none focus:border-[#1E88E5]"
          />
          <span className="text-[10px] text-slate-400 block mt-0.5">Caadi: &lt; 80</span>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            {isSo ? 'Garaaca Wadnaha (Pulse - bpm)' : 'Heart Rate / Pulse (bpm)'}
          </label>
          <input
            type="number"
            value={pulse}
            onChange={(e) => setPulse(e.target.value)}
            placeholder="72"
            className="w-full px-2.5 py-1.5 text-base font-bold font-mono text-slate-700 bg-white border border-slate-300 rounded focus:outline-none focus:border-[#1E88E5]"
          />
          <span className="text-[10px] text-slate-400 block mt-0.5">Caadi: 60 - 100</span>
        </div>
      </div>

      {/* Result Status Card */}
      <div className={`p-5 rounded-lg border ${currentStatus.bg} transition-all`}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-slate-200/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold font-mono text-[#0A2342] tabular-nums">
                {sys}/{dia}
              </span>
              <span className="text-xs text-slate-500 font-mono">mmHg</span>
            </div>
            <div className={`text-sm font-bold mt-1 ${currentStatus.color}`}>
              {isSo ? currentStatus.labelSo : currentStatus.labelEn}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={saveLog}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-[#0A2342] hover:bg-slate-800 rounded transition-colors"
            >
              {isSo ? 'Kaydi Cabbiraadda' : 'Log Reading'}
            </button>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-100"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? (isSo ? 'La guriyay!' : 'Copied!') : (isSo ? 'Guri' : 'Copy')}
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-700 mt-3 leading-relaxed">
          {isSo ? currentStatus.adviceSo : currentStatus.adviceEn}
        </p>
      </div>

      {/* Log History */}
      {logs.length > 0 && (
        <div className="border border-slate-200 rounded-lg p-3 bg-white text-xs">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-slate-700 uppercase tracking-wider text-[11px]">
              {isSo ? 'Cabbiraadihii U Dambeeyay ee La Kaydiyay' : 'Recent Logged Readings'}
            </span>
            <button
              onClick={() => setLogs([])}
              className="text-slate-400 hover:text-rose-600 text-[11px]"
            >
              {isSo ? 'Tir Taariikhda' : 'Clear History'}
            </button>
          </div>

          <div className="space-y-1.5">
            {logs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-100 font-mono"
              >
                <div>
                  <strong className="text-slate-900 text-sm">{log.sys}/{log.dia}</strong> mmHg
                  {log.pulse && <span className="text-slate-500 text-[11px] ml-2 font-sans font-normal">({log.pulse} bpm)</span>}
                </div>
                <div className="text-right text-[11px] text-slate-500 font-sans">
                  <span>{log.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
