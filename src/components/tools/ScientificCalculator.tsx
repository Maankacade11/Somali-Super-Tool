import React, { useState } from 'react';
import { Language } from '../../types';
import { Copy, Check, RotateCcw, Delete } from 'lucide-react';

interface Props {
  language: Language;
}

export const ScientificCalculator: React.FC<Props> = ({ language }) => {
  const isSo = language === 'so';

  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const handleDigit = (digit: string) => {
    if (display === '0' || display === 'Error') {
      setDisplay(digit);
    } else {
      setDisplay(display + digit);
    }
  };

  const handleDecimal = () => {
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleOperator = (op: string) => {
    setEquation(`${display} ${op} `);
    setDisplay('0');
  };

  const handleClear = () => {
    setDisplay('0');
    setEquation('');
  };

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const handleCalculate = () => {
    try {
      const fullExp = equation + display;
      // Sanitize safe math characters
      const sanitized = fullExp
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/π/g, 'Math.PI')
        .replace(/e/g, 'Math.E');

      // Evaluator with safe Function execution
      const result = new Function(`'use strict'; return (${sanitized})`)();
      const formatted = Number.isFinite(result)
        ? Math.round(result * 10000000) / 10000000
        : 'Error';

      const entry = `${fullExp} = ${formatted}`;
      setHistory((prev) => [entry, ...prev.slice(0, 4)]);
      setDisplay(String(formatted));
      setEquation('');
    } catch (e) {
      setDisplay('Error');
    }
  };

  const handleScientific = (fn: string) => {
    const val = parseFloat(display);
    if (isNaN(val)) return;

    let res = 0;
    switch (fn) {
      case 'sqrt':
        res = Math.sqrt(val);
        break;
      case 'sq':
        res = val * val;
        break;
      case 'inv':
        res = val !== 0 ? 1 / val : 0;
        break;
      case 'sin':
        res = Math.sin((val * Math.PI) / 180);
        break;
      case 'cos':
        res = Math.cos((val * Math.PI) / 180);
        break;
      case 'tan':
        res = Math.tan((val * Math.PI) / 180);
        break;
      case 'pct':
        res = val / 100;
        break;
      case 'pm':
        res = -val;
        break;
      default:
        break;
    }

    const formatted = Math.round(res * 10000000) / 10000000;
    setDisplay(String(formatted));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(display);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-md mx-auto">
      {/* Display */}
      <div className="p-4 bg-slate-900 text-white rounded-lg border border-slate-800 text-right">
        <div className="text-xs text-slate-400 font-mono h-5 overflow-hidden truncate">
          {equation || ' '}
        </div>
        <div className="text-3xl sm:text-4xl font-mono font-bold tracking-tight text-white mt-1 tabular-nums overflow-x-auto truncate">
          {display}
        </div>
      </div>

      {/* Calculator Buttons Grid */}
      <div className="grid grid-cols-4 gap-2 text-xs font-semibold">
        {/* Row 1: Sci functions */}
        <button
          onClick={() => handleScientific('sqrt')}
          className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors"
        >
          √x
        </button>
        <button
          onClick={() => handleScientific('sq')}
          className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors"
        >
          x²
        </button>
        <button
          onClick={() => handleScientific('pct')}
          className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors"
        >
          %
        </button>
        <button
          onClick={handleClear}
          className="p-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded transition-colors font-bold"
        >
          AC
        </button>

        {/* Row 2: Trig & Div */}
        <button
          onClick={() => handleScientific('sin')}
          className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors"
        >
          sin
        </button>
        <button
          onClick={() => handleScientific('cos')}
          className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors"
        >
          cos
        </button>
        <button
          onClick={handleBackspace}
          className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors flex items-center justify-center"
        >
          <Delete className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleOperator('÷')}
          className="p-2.5 bg-[#E3F2FD] hover:bg-blue-100 text-[#1E88E5] text-base rounded transition-colors"
        >
          ÷
        </button>

        {/* Row 3: 7 8 9 × */}
        {['7', '8', '9'].map((d) => (
          <button
            key={d}
            onClick={() => handleDigit(d)}
            className="p-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-sm font-mono rounded transition-colors"
          >
            {d}
          </button>
        ))}
        <button
          onClick={() => handleOperator('×')}
          className="p-2.5 bg-[#E3F2FD] hover:bg-blue-100 text-[#1E88E5] text-base rounded transition-colors"
        >
          ×
        </button>

        {/* Row 4: 4 5 6 - */}
        {['4', '5', '6'].map((d) => (
          <button
            key={d}
            onClick={() => handleDigit(d)}
            className="p-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-sm font-mono rounded transition-colors"
          >
            {d}
          </button>
        ))}
        <button
          onClick={() => handleOperator('-')}
          className="p-2.5 bg-[#E3F2FD] hover:bg-blue-100 text-[#1E88E5] text-base rounded transition-colors"
        >
          -
        </button>

        {/* Row 5: 1 2 3 + */}
        {['1', '2', '3'].map((d) => (
          <button
            key={d}
            onClick={() => handleDigit(d)}
            className="p-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-sm font-mono rounded transition-colors"
          >
            {d}
          </button>
        ))}
        <button
          onClick={() => handleOperator('+')}
          className="p-2.5 bg-[#E3F2FD] hover:bg-blue-100 text-[#1E88E5] text-base rounded transition-colors"
        >
          +
        </button>

        {/* Row 6: ± 0 . = */}
        <button
          onClick={() => handleScientific('pm')}
          className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs rounded transition-colors"
        >
          ±
        </button>
        <button
          onClick={() => handleDigit('0')}
          className="p-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-sm font-mono rounded transition-colors"
        >
          0
        </button>
        <button
          onClick={handleDecimal}
          className="p-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-sm font-mono rounded transition-colors"
        >
          .
        </button>
        <button
          onClick={handleCalculate}
          className="p-3 bg-[#1E88E5] hover:bg-[#1976D2] text-white text-base rounded transition-colors font-bold"
        >
          =
        </button>
      </div>

      {/* Copy and History row */}
      <div className="flex items-center justify-between text-xs pt-1">
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? (isSo ? 'La guriyay!' : 'Copied!') : (isSo ? 'Guri Natiijada' : 'Copy Number')}
        </button>

        {history.length > 0 && (
          <span className="text-slate-400 font-mono text-[11px]">
            {isSo ? 'Xisaabtii u dambeysay:' : 'Last:'} {history[0]}
          </span>
        )}
      </div>
    </div>
  );
};
