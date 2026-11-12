import React, { useState, useEffect } from 'react';
import { Language } from '../../types';
import { RotateCcw, Volume2, VolumeX, Sparkles, Check } from 'lucide-react';

interface Props {
  language: Language;
}

interface DhikrPreset {
  id: string;
  arabic: string;
  translitSo: string;
  translitEn: string;
  target: number;
}

const PRESETS: DhikrPreset[] = [
  { id: 'subhanallah', arabic: 'سُبْحَانَ اللَّهِ', translitSo: 'Subxaanallaah (33)', translitEn: 'SubhanAllah (33)', target: 33 },
  { id: 'alhamdulillah', arabic: 'الْحَمْدُ لِلَّهِ', translitSo: 'Alxamdullillaah (33)', translitEn: 'Alhamdulillah (33)', target: 33 },
  { id: 'allahuakbar', arabic: 'اللَّهُ أَكْبَرُ', translitSo: 'Allaahu Akbar (34)', translitEn: 'Allahu Akbar (34)', target: 34 },
  { id: 'istighfar', arabic: 'أَسْتَغْفِرُ اللَّهَ', translitSo: 'Astaghfirullaah (100)', translitEn: 'Astaghfirullah (100)', target: 100 },
  { id: 'salawat', arabic: 'اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ', translitSo: 'Saliga Nabiga ﷺ (100)', translitEn: 'Salawat on the Prophet ﷺ (100)', target: 100 },
  { id: 'tahlil', arabic: 'لَا إِلَٰهَ إِلَّا اللَّهُ', translitSo: 'Laa ilaaha illallaah (100)', translitEn: 'La ilaha illallah (100)', target: 100 },
  { id: 'hasbuna', arabic: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ', translitSo: 'Xasbunallaahu wa nicmal wakiil', translitEn: 'HasbunAllahu wa ni\'mal wakeel', target: 100 },
];

export const TasbeehCounter: React.FC<Props> = ({ language }) => {
  const isSo = language === 'so';

  const [selectedPreset, setSelectedPreset] = useState<DhikrPreset>(PRESETS[0]);
  const [count, setCount] = useState<number>(0);
  const [lapCount, setLapCount] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Load and sync total lifetime counts
  const [totalLifetime, setTotalLifetime] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem('somali_tasbeeh_total') || '0', 10);
    } catch (e) {
      return 0;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('somali_tasbeeh_total', String(totalLifetime));
    } catch (e) {
      console.error(e);
    }
  }, [totalLifetime]);

  const playClickSound = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.08);
    } catch (e) {
      // Audio context might be restricted
    }
  };

  const handleIncrement = () => {
    playClickSound();

    // Haptic vibration if supported on phone
    if (navigator.vibrate) {
      navigator.vibrate(30);
    }

    const nextCount = count + 1;
    setTotalLifetime((prev) => prev + 1);

    if (nextCount >= selectedPreset.target) {
      setLapCount((prev) => prev + 1);
      setCount(0);
      if (navigator.vibrate) {
        navigator.vibrate([50, 50, 100]);
      }
    } else {
      setCount(nextCount);
    }
  };

  const handleReset = () => {
    if (window.confirm(isSo ? 'Ma hubtaa inaad dib u bilaabayso tirinta?' : 'Reset current counter?')) {
      setCount(0);
      setLapCount(0);
    }
  };

  const handleSelectPreset = (p: DhikrPreset) => {
    setSelectedPreset(p);
    setCount(0);
  };

  const progressPercent = Math.min(100, Math.round((count / selectedPreset.target) * 100));

  return (
    <div className="space-y-6 max-w-md mx-auto text-center">
      {/* Preset selector */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 p-1 bg-slate-100 rounded-lg">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            onClick={() => handleSelectPreset(p)}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
              selectedPreset.id === p.id
                ? 'bg-white text-[#0A2342] shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {isSo ? p.translitSo.split(' ')[0] : p.translitEn.split(' ')[0]}
          </button>
        ))}
      </div>

      {/* Main Tasbeeh Device Card */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col items-center">
        {/* Arabic Dhikr Calligraphy */}
        <div className="text-xl sm:text-2xl font-bold text-[#0A2342] font-serif tracking-wide mb-1">
          {selectedPreset.arabic}
        </div>
        <span className="text-xs text-slate-500 font-medium">
          {isSo ? selectedPreset.translitSo : selectedPreset.translitEn}
        </span>

        {/* Counter Display Screen */}
        <div className="my-6 px-8 py-4 bg-white border border-slate-200 rounded-xl shadow-xs w-48 text-center">
          <div className="text-5xl sm:text-6xl font-mono font-extrabold text-[#0A2342] tabular-nums tracking-wider select-none">
            {count}
          </div>
          <div className="text-[11px] font-mono text-slate-400 mt-1 flex justify-between items-center">
            <span>{isSo ? 'Bartilmaameed' : 'Target'}: {selectedPreset.target}</span>
            <span>{isSo ? 'Wareeg' : 'Laps'}: {lapCount}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-48 h-1.5 bg-slate-200 rounded-full overflow-hidden mb-6">
          <div
            className="h-full bg-[#1E88E5] transition-all duration-150"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Large Touch/Tap Button */}
        <button
          onClick={handleIncrement}
          className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#1E88E5] hover:bg-[#1976D2] active:scale-95 text-white font-bold text-sm shadow-md transition-all flex flex-col items-center justify-center cursor-pointer select-none border-4 border-blue-100"
          aria-label="Count"
        >
          <span className="text-xs uppercase tracking-wider">{isSo ? 'Riix' : 'Count'}</span>
          <span className="text-lg font-mono">+1</span>
        </button>

        {/* Action strip */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 border border-slate-200 bg-white rounded-md transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isSo ? 'Dib u bilaab' : 'Reset'}</span>
          </button>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1.5 text-slate-500 hover:text-slate-800 border border-slate-200 bg-white rounded-md transition-colors"
            title={soundEnabled ? 'Mute' : 'Enable sound'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#1E88E5]" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>

        {/* Total stats */}
        <div className="mt-4 pt-3 border-t border-slate-200 w-full text-center text-xs text-slate-400 font-mono">
          {isSo ? 'Wadarta Guud ee La Tasbiixsaday:' : 'Lifetime Dhikr Count:'}{' '}
          <strong className="text-slate-700">{totalLifetime.toLocaleString()}</strong>
        </div>
      </div>
    </div>
  );
};
