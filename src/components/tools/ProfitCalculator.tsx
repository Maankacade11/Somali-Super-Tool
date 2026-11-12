import React, { useState } from 'react';
import { Language } from '../../types';
import { Calculator, RotateCcw, Copy, Check } from 'lucide-react';

interface Props {
  language: Language;
}

export const ProfitCalculator: React.FC<Props> = ({ language }) => {
  const isSo = language === 'so';

  const [costPrice, setCostPrice] = useState<string>('20');
  const [sellingPrice, setSellingPrice] = useState<string>('30');
  const [units, setUnits] = useState<string>('100');
  const [copied, setCopied] = useState(false);

  const cost = parseFloat(costPrice) || 0;
  const selling = parseFloat(sellingPrice) || 0;
  const quantity = parseFloat(units) || 1;

  const profitPerUnit = selling - cost;
  const marginPercent = selling > 0 ? (profitPerUnit / selling) * 100 : 0;
  const markupPercent = cost > 0 ? (profitPerUnit / cost) * 100 : 0;
  const totalRevenue = selling * quantity;
  const totalCost = cost * quantity;
  const totalProfit = profitPerUnit * quantity;

  const handleReset = () => {
    setCostPrice('');
    setSellingPrice('');
    setUnits('1');
  };

  const handleCopy = () => {
    const summary = `${isSo ? 'Faa\'iidada Qaybta' : 'Unit Profit'}: $${profitPerUnit.toFixed(2)} | ${isSo ? 'Margin-ka' : 'Margin'}: ${marginPercent.toFixed(1)}% | ${isSo ? 'Markup-ka' : 'Markup'}: ${markupPercent.toFixed(1)}% | ${isSo ? 'Faa\'iidada Wadarta' : 'Total Profit'}: $${totalProfit.toFixed(2)}`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            {isSo ? 'Qiimaha Iibsiga ($)' : 'Cost Price ($)'}
          </label>
          <input
            type="number"
            step="any"
            value={costPrice}
            onChange={(e) => setCostPrice(e.target.value)}
            placeholder="0.00"
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md focus:outline-none focus:border-[#1E88E5] focus:ring-1 focus:ring-[#1E88E5] font-mono tabular-nums"
          />
          <p className="text-xs text-slate-500 mt-1">
            {isSo ? 'Intee ku timid badeecadu?' : 'How much you paid per unit'}
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            {isSo ? 'Qiimaha Iibka ($)' : 'Selling Price ($)'}
          </label>
          <input
            type="number"
            step="any"
            value={sellingPrice}
            onChange={(e) => setSellingPrice(e.target.value)}
            placeholder="0.00"
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md focus:outline-none focus:border-[#1E88E5] focus:ring-1 focus:ring-[#1E88E5] font-mono tabular-nums"
          />
          <p className="text-xs text-slate-500 mt-1">
            {isSo ? 'Intee ayaad ku iibinaysaa?' : 'Target price for customers'}
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            {isSo ? 'Tirada Xabbo (Units)' : 'Quantity (Units)'}
          </label>
          <input
            type="number"
            step="1"
            min="1"
            value={units}
            onChange={(e) => setUnits(e.target.value)}
            placeholder="1"
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md focus:outline-none focus:border-[#1E88E5] focus:ring-1 focus:ring-[#1E88E5] font-mono tabular-nums"
          />
          <p className="text-xs text-slate-500 mt-1">
            {isSo ? 'Xaddiga guud ee alaabta' : 'Total inventory amount'}
          </p>
        </div>
      </div>

      {/* Results Grid */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-5">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">
          {isSo ? 'Natiijada Xisaabinta' : 'Calculation Results'}
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="border-r border-slate-200 pr-2">
            <span className="text-xs text-slate-500 block">{isSo ? 'Faa\'iido Xabbaddiiba' : 'Unit Profit'}</span>
            <span className={`text-xl font-bold font-mono tabular-nums ${profitPerUnit >= 0 ? 'text-[#0A2342]' : 'text-rose-600'}`}>
              ${profitPerUnit.toFixed(2)}
            </span>
          </div>

          <div className="border-r border-slate-200 pr-2">
            <span className="text-xs text-slate-500 block">{isSo ? 'Margin-ka Faa\'iidada' : 'Profit Margin'}</span>
            <span className={`text-xl font-bold font-mono tabular-nums ${marginPercent >= 0 ? 'text-[#1E88E5]' : 'text-rose-600'}`}>
              {marginPercent.toFixed(1)}%
            </span>
          </div>

          <div className="border-r border-slate-200 pr-2">
            <span className="text-xs text-slate-500 block">{isSo ? 'Markup-ka' : 'Markup'}</span>
            <span className="text-xl font-bold font-mono tabular-nums text-[#0A2342]">
              {markupPercent.toFixed(1)}%
            </span>
          </div>

          <div>
            <span className="text-xs text-slate-500 block">{isSo ? 'Wadarta Faa\'iidada' : 'Total Net Profit'}</span>
            <span className={`text-xl font-bold font-mono tabular-nums ${totalProfit >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
              ${totalProfit.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
          <div>
            <span className="font-medium text-slate-900">{isSo ? 'Dakhliga Guud' : 'Total Revenue'}:</span> ${totalRevenue.toFixed(2)}
            <span className="mx-2">·</span>
            <span className="font-medium text-slate-900">{isSo ? 'Kharashka Guud' : 'Total Cost'}:</span> ${totalCost.toFixed(2)}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-100 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              {copied ? (isSo ? 'Waa la guriyay!' : 'Copied!') : (isSo ? 'Guri Natiijada' : 'Copy Result')}
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
    </div>
  );
};
