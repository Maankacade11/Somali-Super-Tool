import React, { useState } from 'react';
import { Language } from '../../types';
import { Wallet, Copy, Check, RotateCcw } from 'lucide-react';

interface Props {
  language: Language;
}

export const SalaryCalculator: React.FC<Props> = ({ language }) => {
  const isSo = language === 'so';

  const [basicSalary, setBasicSalary] = useState<string>('800');
  const [housing, setHousing] = useState<string>('150');
  const [transport, setTransport] = useState<string>('50');
  const [otherAllowance, setOtherAllowance] = useState<string>('0');

  const [taxPercent, setTaxPercent] = useState<string>('5');
  const [pensionPercent, setPensionPercent] = useState<string>('3');
  const [advanceDeduction, setAdvanceDeduction] = useState<string>('0');

  const [copied, setCopied] = useState(false);

  const basic = parseFloat(basicSalary) || 0;
  const house = parseFloat(housing) || 0;
  const trans = parseFloat(transport) || 0;
  const other = parseFloat(otherAllowance) || 0;

  const grossSalary = basic + house + trans + other;

  const tax = (grossSalary * (parseFloat(taxPercent) || 0)) / 100;
  const pension = (grossSalary * (parseFloat(pensionPercent) || 0)) / 100;
  const advance = parseFloat(advanceDeduction) || 0;

  const totalDeductions = tax + pension + advance;
  const netPay = Math.max(0, grossSalary - totalDeductions);
  const annualNet = netPay * 12;

  const handleCopy = () => {
    const text = isSo
      ? `Mushaharka Guud: $${grossSalary.toFixed(2)} | Goynta Guud: $${totalDeductions.toFixed(2)} | Mushaharka Saafiga ah (Net): $${netPay.toFixed(2)} bishiiba ($${annualNet.toFixed(2)} sanadkiiba)`
      : `Gross Salary: $${grossSalary.toFixed(2)} | Total Deductions: $${totalDeductions.toFixed(2)} | Net Pay: $${netPay.toFixed(2)}/mo ($${annualNet.toFixed(2)}/yr)`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setBasicSalary('');
    setHousing('0');
    setTransport('0');
    setOtherAllowance('0');
    setTaxPercent('0');
    setPensionPercent('0');
    setAdvanceDeduction('0');
  };

  return (
    <div className="space-y-6">
      {/* Input Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Earnings */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            {isSo ? 'Dakhliga & Gunnooyinka ($)' : 'Earnings & Allowances ($)'}
          </span>

          <div>
            <label className="text-xs text-slate-600 block mb-1 font-medium">
              {isSo ? 'Mushaharka Asalka ah (Basic Salary)' : 'Basic Monthly Salary'}
            </label>
            <input
              type="number"
              value={basicSalary}
              onChange={(e) => setBasicSalary(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded font-mono tabular-nums focus:outline-none focus:border-[#1E88E5]"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-slate-600 block mb-1">
                {isSo ? 'Gunno Guri (Housing)' : 'Housing Allowance'}
              </label>
              <input
                type="number"
                value={housing}
                onChange={(e) => setHousing(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded font-mono tabular-nums"
              />
            </div>

            <div>
              <label className="text-xs text-slate-600 block mb-1">
                {isSo ? 'Gunno Gaadiid' : 'Transport Allowance'}
              </label>
              <input
                type="number"
                value={transport}
                onChange={(e) => setTransport(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded font-mono tabular-nums"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-600 block mb-1">
              {isSo ? 'Gunnooyin Kale (Other Allowances)' : 'Other Allowances / Bonus'}
            </label>
            <input
              type="number"
              value={otherAllowance}
              onChange={(e) => setOtherAllowance(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded font-mono tabular-nums"
            />
          </div>
        </div>

        {/* Deductions */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            {isSo ? 'Goynta & Cashuuraha' : 'Taxes & Deductions'}
          </span>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-slate-600 block mb-1 font-medium">
                {isSo ? 'Cashuurta Dakhliga (%)' : 'Income Tax Rate (%)'}
              </label>
              <input
                type="number"
                value={taxPercent}
                onChange={(e) => setTaxPercent(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded font-mono tabular-nums"
              />
              <span className="text-[10px] text-slate-500 block mt-0.5 font-mono">-${tax.toFixed(2)}</span>
            </div>

            <div>
              <label className="text-xs text-slate-600 block mb-1 font-medium">
                {isSo ? 'Kayd / Pension (%)' : 'Pension / Social Fund (%)'}
              </label>
              <input
                type="number"
                value={pensionPercent}
                onChange={(e) => setPensionPercent(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded font-mono tabular-nums"
              />
              <span className="text-[10px] text-slate-500 block mt-0.5 font-mono">-${pension.toFixed(2)}</span>
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-600 block mb-1 font-medium">
              {isSo ? 'Horumaris / Amaah La Jarayo ($)' : 'Salary Advance / Loan Repayment ($)'}
            </label>
            <input
              type="number"
              value={advanceDeduction}
              onChange={(e) => setAdvanceDeduction(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded font-mono tabular-nums"
            />
          </div>
        </div>
      </div>

      {/* Result Breakdown Card */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-5">
        <div className="text-center py-4 border-b border-slate-200">
          <span className="text-xs uppercase tracking-wider text-slate-500 block mb-1">
            {isSo ? 'Mushaharka Saafiga ah ee Gacanta Soo Galaya (Net Pay)' : 'Net Take-Home Pay (Monthly)'}
          </span>
          <div className="text-3xl sm:text-4xl font-extrabold text-[#0A2342] font-mono tabular-nums">
            ${netPay.toFixed(2)}
            <span className="text-xs font-normal text-slate-500 font-sans ml-1">/{isSo ? 'bishiiba' : 'mo'}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-4 text-xs text-center">
          <div>
            <span className="text-slate-500 block">{isSo ? 'Dakhliga Guud (Gross)' : 'Gross Earnings'}</span>
            <span className="font-semibold text-slate-800 font-mono text-sm tabular-nums">${grossSalary.toFixed(2)}</span>
          </div>

          <div>
            <span className="text-slate-500 block">{isSo ? 'Wadarta Goynta' : 'Total Deductions'}</span>
            <span className="font-semibold text-rose-600 font-mono text-sm tabular-nums">-${totalDeductions.toFixed(2)}</span>
          </div>

          <div>
            <span className="text-slate-500 block">{isSo ? 'Qiyaasta Sanadka' : 'Annual Estimate'}</span>
            <span className="font-semibold text-emerald-700 font-mono text-sm tabular-nums">${annualNet.toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#1E88E5] hover:bg-[#1976D2] rounded transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? (isSo ? 'La guriyay!' : 'Copied!') : (isSo ? 'Guri Xisaabta' : 'Copy Pay Breakdown')}
          </button>

          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            {isSo ? 'Dib u bilow' : 'Reset'}
          </button>
        </div>
      </div>
    </div>
  );
};
