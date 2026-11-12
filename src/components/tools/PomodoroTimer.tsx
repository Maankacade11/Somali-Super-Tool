import React, { useState, useEffect, useRef } from 'react';
import { Language } from '../../types';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Flag } from 'lucide-react';

interface Props {
  language: Language;
}

type Mode = 'pomodoro' | 'short' | 'long' | 'stopwatch';

const MODE_DURATIONS: Record<Mode, number> = {
  pomodoro: 25 * 60,
  short: 5 * 60,
  long: 15 * 60,
  stopwatch: 0,
};

export const PomodoroTimer: React.FC<Props> = ({ language }) => {
  const isSo = language === 'so';

  const [mode, setMode] = useState<Mode>('pomodoro');
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [completedSessions, setCompletedSessions] = useState<number>(0);
  const [laps, setLaps] = useState<number[]>([]);

  const timerRef = useRef<any>(null);

  // Play gentle web audio chime
  const playBeep = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.6);
    } catch (e) {
      // Audio context might be restricted before user gesture
    }
  };

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        if (mode === 'stopwatch') {
          setTimeLeft((prev) => prev + 1);
        } else {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              clearInterval(timerRef.current);
              setIsRunning(false);
              playBeep();
              if (mode === 'pomodoro') {
                setCompletedSessions((s) => s + 1);
              }
              return 0;
            }
            return prev - 1;
          });
        }
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, mode, soundEnabled]);

  const switchMode = (newMode: Mode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(MODE_DURATIONS[newMode]);
    if (newMode === 'stopwatch') {
      setLaps([]);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(MODE_DURATIONS[mode]);
    if (mode === 'stopwatch') {
      setLaps([]);
    }
  };

  const recordLap = () => {
    if (mode === 'stopwatch' && isRunning) {
      setLaps([timeLeft, ...laps]);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Mode Switcher */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
        {[
          { id: 'pomodoro', so: 'Pomodoro (25m)', en: 'Pomodoro (25m)' },
          { id: 'short', so: 'Nasasho Gaaban (5m)', en: 'Short Break (5m)' },
          { id: 'long', so: 'Nasasho Dheer (15m)', en: 'Long Break (15m)' },
          { id: 'stopwatch', so: 'Saacad-qabte', en: 'Stopwatch' },
        ].map((m) => (
          <button
            key={m.id}
            onClick={() => switchMode(m.id as Mode)}
            className={`flex-1 py-1.5 px-2 text-xs font-medium rounded transition-colors whitespace-nowrap ${
              mode === m.id ? 'bg-white text-[#0A2342] shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {isSo ? m.so : m.en}
          </button>
        ))}
      </div>

      {/* Main Display Box */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-8 text-center">
        <div className="text-6xl sm:text-7xl font-mono font-extrabold text-[#0A2342] tracking-wider tabular-nums">
          {formatTime(timeLeft)}
        </div>

        <div className="mt-2 text-xs text-slate-500 uppercase tracking-widest font-mono">
          {mode === 'pomodoro'
            ? (isSo ? 'Waqtiga Diirad-saarista' : 'Focus Session')
            : mode === 'short'
            ? (isSo ? 'Nasasho Gaaban' : 'Short Rest')
            : mode === 'long'
            ? (isSo ? 'Nasasho Dheer' : 'Long Rest')
            : (isSo ? 'Waqti-qabte Toos ah' : 'Active Stopwatch')}
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-[#1E88E5] hover:bg-[#1976D2] rounded-md transition-colors"
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
            {isRunning ? (isSo ? 'Hakad' : 'Pause') : (isSo ? 'Bilow' : 'Start')}
          </button>

          {mode === 'stopwatch' && isRunning && (
            <button
              onClick={recordLap}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-md transition-colors"
            >
              <Flag className="w-4 h-4 text-slate-500" />
              {isSo ? 'Wareeg' : 'Lap'}
            </button>
          )}

          <button
            onClick={handleReset}
            className="p-2.5 text-slate-500 hover:text-slate-800 border border-slate-300 bg-white rounded-md transition-colors"
            title={isSo ? 'Dib u bilow' : 'Reset'}
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2.5 text-slate-500 hover:text-slate-800 border border-slate-300 bg-white rounded-md transition-colors"
            title={soundEnabled ? (isSo ? 'Dami Dhawaaqa' : 'Mute Sound') : (isSo ? 'Fur Dhawaaqa' : 'Enable Sound')}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#1E88E5]" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>

        {mode !== 'stopwatch' && (
          <div className="mt-6 text-xs text-slate-500">
            {isSo ? 'Wareegyada La Dhammeeyay Maanta' : 'Sessions completed today'}:{' '}
            <strong className="text-slate-800 font-mono">{completedSessions}</strong>
          </div>
        )}

        {/* Stopwatch Laps */}
        {mode === 'stopwatch' && laps.length > 0 && (
          <div className="mt-6 text-left max-h-40 overflow-y-auto border-t border-slate-200 pt-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
              {isSo ? 'Wareegyada La Diiwaangeliyay' : 'Recorded Laps'}
            </span>
            <div className="space-y-1 text-xs">
              {laps.map((lapTime, idx) => (
                <div key={idx} className="flex justify-between py-1 border-b border-slate-100 font-mono">
                  <span className="text-slate-500">{isSo ? `Wareeg ${laps.length - idx}` : `Lap ${laps.length - idx}`}</span>
                  <span className="font-semibold text-slate-800">{formatTime(lapTime)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
