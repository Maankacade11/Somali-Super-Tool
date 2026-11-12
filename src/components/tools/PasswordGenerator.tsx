import React, { useState, useEffect } from 'react';
import { Language } from '../../types';
import { Copy, Check, RefreshCw, ShieldCheck } from 'lucide-react';

interface Props {
  language: Language;
}

export const PasswordGenerator: React.FC<Props> = ({ language }) => {
  const isSo = language === 'so';

  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeLower, setIncludeLower] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [copied, setCopied] = useState(false);

  const generate = () => {
    let charset = '';
    if (includeLower) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeUpper) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()-_=+[]{}|;:,.<>?';

    if (!charset) {
      setPassword('');
      return;
    }

    let generated = '';
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      generated += charset[array[i] % charset.length];
    }
    setPassword(generated);
  };

  useEffect(() => {
    generate();
  }, [length, includeUpper, includeLower, includeNumbers, includeSymbols]);

  const handleCopy = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStrength = () => {
    if (length < 10) return { label: isSo ? 'Daciif' : 'Weak', color: 'text-rose-600', width: '25%', bg: 'bg-rose-500' };
    if (length < 14) return { label: isSo ? 'Dhexdhexaad' : 'Fair', color: 'text-amber-600', width: '50%', bg: 'bg-amber-500' };
    if (length < 18) return { label: isSo ? 'Adag' : 'Strong', color: 'text-emerald-600', width: '75%', bg: 'bg-emerald-500' };
    return { label: isSo ? 'Aad u adag' : 'Very Strong', color: 'text-emerald-700', width: '100%', bg: 'bg-emerald-700' };
  };

  const strength = getStrength();

  return (
    <div className="space-y-6">
      {/* Generated Password Box */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-5">
        <div className="flex items-center justify-between gap-3 bg-white border border-slate-300 rounded-md p-3">
          <input
            type="text"
            readOnly
            value={password}
            className="w-full text-base sm:text-lg font-mono font-medium text-[#0A2342] tracking-wider bg-transparent focus:outline-none select-all"
          />

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={generate}
              className="p-1.5 text-slate-500 hover:text-slate-800 rounded transition-colors"
              title={isSo ? 'Abuur mid kale' : 'Generate new'}
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#1E88E5] hover:bg-[#1976D2] rounded transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? (isSo ? 'La guriyay!' : 'Copied!') : (isSo ? 'Guri' : 'Copy')}
            </button>
          </div>
        </div>

        {/* Strength meter */}
        <div className="mt-3">
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="text-slate-500">{isSo ? 'Heerka Adkaanta:' : 'Strength:'}</span>
            <span className={`font-semibold ${strength.color}`}>{strength.label}</span>
          </div>
          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className={`h-full ${strength.bg} transition-all duration-300`}
              style={{ width: strength.width }}
            />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            <span>{isSo ? 'Dhererka Furaha' : 'Password Length'}</span>
            <span className="font-mono text-[#0A2342] text-sm">{length}</span>
          </div>
          <input
            type="range"
            min="8"
            max="36"
            value={length}
            onChange={(e) => setLength(parseInt(e.target.value))}
            className="w-full accent-[#1E88E5] cursor-pointer"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
          <label className="flex items-center gap-2 p-2 border border-slate-200 rounded cursor-pointer hover:bg-slate-50">
            <input
              type="checkbox"
              checked={includeUpper}
              onChange={(e) => setIncludeUpper(e.target.checked)}
              className="accent-[#1E88E5]"
            />
            <span>{isSo ? 'Xarfo Waawayn (A-Z)' : 'Uppercase Letters (A-Z)'}</span>
          </label>

          <label className="flex items-center gap-2 p-2 border border-slate-200 rounded cursor-pointer hover:bg-slate-50">
            <input
              type="checkbox"
              checked={includeLower}
              onChange={(e) => setIncludeLower(e.target.checked)}
              className="accent-[#1E88E5]"
            />
            <span>{isSo ? 'Xarfo Yaryar (a-z)' : 'Lowercase Letters (a-z)'}</span>
          </label>

          <label className="flex items-center gap-2 p-2 border border-slate-200 rounded cursor-pointer hover:bg-slate-50">
            <input
              type="checkbox"
              checked={includeNumbers}
              onChange={(e) => setIncludeNumbers(e.target.checked)}
              className="accent-[#1E88E5]"
            />
            <span>{isSo ? 'Tirooyin (0-9)' : 'Numbers (0-9)'}</span>
          </label>

          <label className="flex items-center gap-2 p-2 border border-slate-200 rounded cursor-pointer hover:bg-slate-50">
            <input
              type="checkbox"
              checked={includeSymbols}
              onChange={(e) => setIncludeSymbols(e.target.checked)}
              className="accent-[#1E88E5]"
            />
            <span>{isSo ? 'Calaamado Gaar ah (!@#$)' : 'Symbols (!@#$%^&*)'}</span>
          </label>
        </div>
      </div>
    </div>
  );
};
