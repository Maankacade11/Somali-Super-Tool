import React, { useState } from 'react';
import { Language } from '../../types';
import { Users, Copy, Check, RotateCcw } from 'lucide-react';

interface Props {
  language: Language;
}

export const ExpenseSplitter: React.FC<Props> = ({ language }) => {
  const isSo = language === 'so';

  const [billAmount, setBillAmount] = useState<string>('120');
  const [peopleCount, setPeopleCount] = useState<number>(4);
  const [tipPercent, setTipPercent] = useState<number>(10);
  const [copied, setCopied] = useState(false);

  const bill = parseFloat(billAmount) || 0;
  const count = Math.max(1, peopleCount);
  const tipAmount = (bill * (tipPercent || 0)) / 100;
  const totalWithTip = bill + tipAmount;
  const perPerson = totalWithTip / count;

  const handleCopy = () => {
    const text = isSo
      ? `Biilka Guud: $${totalWithTip.toFixed(2)} (${count} qof). Qofkiiba: $${perPerson.toFixed(2)}.`
      : `Total Bill: $${totalWithTip.toFixed(2)} (${count} people). Per person: $${perPerson.toFixed(2)}.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setBillAmount('');
    setPeopleCount(2);
    setTipPercent(0);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            {isSo ? 'Wadarta Biilka ($)' : 'Total Bill Amount ($)'}
          </label>
          <input
            type="number"
            step="any"
            value={billAmount}
            onChange={(e) => setBillAmount(e.target.value)}
            placeholder="0.00"
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md focus:outline-none focus:border-[#1E88E5] focus:ring-1 focus:ring-[#1E88E5] font-mono tabular-nums"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            {isSo ? 'Tirada Dadka' : 'Number of People'}
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPeopleCount(Math.max(1, peopleCount - 1))}
              className="px-3 py-2 border border-slate-300 rounded-md hover:bg-slate-100 text-sm font-bold text-slate-700"
            >
              -
            </button>
            <input
              type="number"
              min="1"
              value={peopleCount}
              onChange={(e) => setPeopleCount(parseInt(e.target.value) || 1)}
              className="w-full text-center px-3 py-2 text-sm bg-white border border-slate-300 rounded-md focus:outline-none focus:border-[#1E88E5] font-mono tabular-nums"
            />
            <button
              onClick={() => setPeopleCount(peopleCount + 1)}
              className="px-3 py-2 border border-slate-300 rounded-md hover:bg-slate-100 text-sm font-bold text-slate-700"
            >
              +
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            {isSo ? 'Tip / Adeeg Dheeraad ah (%)' : 'Tip / Service (%)'}
          </label>
          <div className="flex items-center gap-1.5">
            {[0, 5, 10, 15].map((preset) => (
              <button
                key={preset}
                onClick={() => setTipPercent(preset)}
                className={`flex-1 py-2 text-xs font-medium rounded border transition-colors ${
                  tipPercent === preset
                    ? 'bg-[#1E88E5] text-white border-[#1E88E5]'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                {preset}%
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Result Cards */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-5">
        <div className="text-center py-4 border-b border-slate-200">
          <span className="text-xs uppercase tracking-wider text-slate-500 block mb-1">
            {isSo ? 'Qaybta Qofkiiba Ku Soo Aadeysa' : 'Each Person Pays'}
          </span>
          <div className="text-3xl sm:text-4xl font-extrabold text-[#0A2342] font-mono tabular-nums">
            ${perPerson.toFixed(2)}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-4 text-center text-xs">
          <div>
            <span className="text-slate-500 block">{isSo ? 'Biilka Asalka ah' : 'Original Bill'}</span>
            <span className="font-semibold text-slate-800 font-mono tabular-nums">${bill.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-slate-500 block">{isSo ? 'Wadarta Tip-ka' : 'Total Tip'}</span>
            <span className="font-semibold text-slate-800 font-mono tabular-nums">${tipAmount.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-slate-500 block">{isSo ? 'Wadarta Guud' : 'Total with Tip'}</span>
            <span className="font-semibold text-slate-800 font-mono tabular-nums">${totalWithTip.toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#1E88E5] hover:bg-[#1976D2] rounded transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? (isSo ? 'Waa la guriyay!' : 'Copied!') : (isSo ? 'Guri Qoraalka Qaybta' : 'Copy Split Details')}
          </button>

          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            {isSo ? 'Dib u bilow' : 'Reset'}
          </button>
        </div>
      </div>
    </div>
  );
};
