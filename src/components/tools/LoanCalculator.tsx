import React, { useState } from 'react';
import { Language } from '../../types';
import { Landmark, RotateCcw, Copy, Check } from 'lucide-react';

interface Props {
  language: Language;
}

export const LoanCalculator: React.FC<Props> = ({ language }) => {
  const isSo = language === 'so';

  const [principal, setPrincipal] = useState<string>('10000');
  const [profitRate, setProfitRate] = useState<string>('6');
  const [termMonths, setTermMonths] = useState<string>('24');
  const [copied, setCopied] = useState(false);

  const P = parseFloat(principal) || 0;
  const annualRate = parseFloat(profitRate) || 0;
  const months = Math.max(1, parseInt(termMonths) || 1);

  // Murabaha / Fixed Financing calculation: Total Profit = P * (rate/100) * (months / 12)
  const totalProfit = P * (annualRate / 100) * (months / 12);
  const totalRepayment = P + totalProfit;
  const monthlyPayment = totalRepayment / months;

  const handleCopy = () => {
    const text = isSo
      ? `Maalgelinta: $${P.toLocaleString()} | Billeedka: $${monthlyPayment.toFixed(2)}/bishiiba (${months} bilood) | Wadarta: $${totalRepayment.toFixed(2)}`
      : `Financing: $${P.toLocaleString()} | Monthly: $${monthlyPayment.toFixed(2)}/mo (${months} months) | Total: $${totalRepayment.toFixed(2)}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setPrincipal('');
    setProfitRate('5');
    setTermMonths('12');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            {isSo ? 'Qaddarka Amaahda / Maalgelinta ($)' : 'Financing Amount ($)'}
          </label>
          <input
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            placeholder="5,000"
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md focus:outline-none focus:border-[#1E88E5] font-mono tabular-nums"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            {isSo ? 'Heerka Faa\'iidada Sanadlaha ah (%)' : 'Annual Profit Rate (%)'}
          </label>
          <input
            type="number"
            step="0.1"
            value={profitRate}
            onChange={(e) => setProfitRate(e.target.value)}
            placeholder="6.0"
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md focus:outline-none focus:border-[#1E88E5] font-mono tabular-nums"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            {isSo ? 'Muddada Bixinta (Bilood)' : 'Loan Period (Months)'}
          </label>
          <select
            value={termMonths}
            onChange={(e) => setTermMonths(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md focus:outline-none focus:border-[#1E88E5]"
          >
            <option value="6">{isSo ? '6 Bilood (Nus-sano)' : '6 Months'}</option>
            <option value="12">{isSo ? '12 Bilood (1 Sano)' : '12 Months (1 Year)'}</option>
            <option value="24">{isSo ? '24 Bilood (2 Sano)' : '24 Months (2 Years)'}</option>
            <option value="36">{isSo ? '36 Bilood (3 Sano)' : '36 Months (3 Years)'}</option>
            <option value="60">{isSo ? '60 Bilood (5 Sano)' : '60 Months (5 Years)'}</option>
          </select>
        </div>
      </div>

      {/* Results Box */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-5">
        <div className="text-center py-4 border-b border-slate-200">
          <span className="text-xs uppercase tracking-wider text-slate-500 block mb-1">
            {isSo ? 'Qidmadda Billeedka ah (Monthly Payment)' : 'Estimated Monthly Payment'}
          </span>
          <div className="text-3xl sm:text-4xl font-extrabold text-[#0A2342] font-mono tabular-nums">
            ${monthlyPayment.toFixed(2)}
            <span className="text-xs font-normal text-slate-500 font-sans ml-1">/{isSo ? 'bishiiba' : 'month'}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 text-xs text-center">
          <div>
            <span className="text-slate-500 block">{isSo ? 'Asalka Lacagta' : 'Principal Amount'}</span>
            <span className="font-semibold text-slate-800 font-mono text-sm tabular-nums">${P.toLocaleString()}</span>
          </div>

          <div>
            <span className="text-slate-500 block">{isSo ? 'Wadarta Faa\'iidada Bangiga' : 'Total Financing Profit'}</span>
            <span className="font-semibold text-emerald-700 font-mono text-sm tabular-nums">+${totalProfit.toFixed(2)}</span>
          </div>

          <div>
            <span className="text-slate-500 block">{isSo ? 'Wadarta Bixinta Guud' : 'Total Repayment'}</span>
            <span className="font-semibold text-[#0A2342] font-mono text-sm tabular-nums">${totalRepayment.toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#1E88E5] hover:bg-[#1976D2] rounded transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? (isSo ? 'La guriyay!' : 'Copied!') : (isSo ? 'Guri Xisaabta' : 'Copy Summary')}
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
