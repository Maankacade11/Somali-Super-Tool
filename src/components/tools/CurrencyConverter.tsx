import React, { useState } from 'react';
import { Language } from '../../types';
import { ArrowLeftRight, Copy, Check, Settings2 } from 'lucide-react';

interface Props {
  language: Language;
}

export const CurrencyConverter: React.FC<Props> = ({ language }) => {
  const isSo = language === 'so';

  const [amount, setAmount] = useState<string>('50');
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('SOS');
  const [customSosRate, setCustomSosRate] = useState<string>('26000');
  const [showCustomRate, setShowCustomRate] = useState<boolean>(false);
  const [copied, setCopied] = useState(false);

  // Baseline rates relative to 1 USD
  const baseRates: Record<string, number> = {
    USD: 1,
    SOS: parseFloat(customSosRate) || 26000,
    EUR: 0.92,
    GBP: 0.79,
    KES: 129.5,
    AED: 3.67,
    ETB: 122.0,
  };

  const currencyNames: Record<string, { nameSo: string; nameEn: string; symbol: string }> = {
    USD: { nameSo: 'Doolarka Maraykanka', nameEn: 'US Dollar', symbol: '$' },
    SOS: { nameSo: 'Shillinka Soomaaliga', nameEn: 'Somali Shilling', symbol: 'Sh.So' },
    EUR: { nameSo: 'Euro Yurub', nameEn: 'Euro', symbol: '€' },
    GBP: { nameSo: 'Bowndka Ingiriiska', nameEn: 'British Pound', symbol: '£' },
    KES: { nameSo: 'Shillinka Kiinya', nameEn: 'Kenyan Shilling', symbol: 'KSh' },
    AED: { nameSo: 'Dirhamka Imaaraadka', nameEn: 'UAE Dirham', symbol: 'AED' },
    ETB: { nameSo: 'Birrka Itoobiya', nameEn: 'Ethiopian Birr', symbol: 'ETB' },
  };

  const inputAmount = parseFloat(amount) || 0;
  // Convert from 'from' to USD, then USD to 'to'
  const fromRate = baseRates[fromCurrency] || 1;
  const toRate = baseRates[toCurrency] || 1;
  const inUsd = inputAmount / fromRate;
  const converted = inUsd * toRate;

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const handleCopy = () => {
    const text = `${amount} ${fromCurrency} = ${converted.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${toCurrency}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Input row */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            {isSo ? 'Qaddarka Lacagta' : 'Amount'}
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md focus:outline-none focus:border-[#1E88E5] font-mono tabular-nums"
          />
          <div className="mt-2">
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="w-full px-2 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:border-[#1E88E5]"
            >
              {Object.keys(baseRates).map((curr) => (
                <option key={curr} value={curr}>
                  {curr} — {isSo ? currencyNames[curr].nameSo : currencyNames[curr].nameEn}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-center md:pb-2">
          <button
            onClick={handleSwap}
            className="p-2 border border-slate-300 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
            title={isSo ? 'Kala beddel' : 'Swap currencies'}
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            {isSo ? 'Natiijada Sarifka' : 'Converted Output'}
          </label>
          <div className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-md font-mono font-bold text-[#0A2342] tabular-nums truncate">
            {converted.toLocaleString(undefined, { maximumFractionDigits: 2 })} {toCurrency}
          </div>
          <div className="mt-2">
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="w-full px-2 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:border-[#1E88E5]"
            >
              {Object.keys(baseRates).map((curr) => (
                <option key={curr} value={curr}>
                  {curr} — {isSo ? currencyNames[curr].nameSo : currencyNames[curr].nameEn}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Result summary and custom rate toggle */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <span className="text-xs text-slate-500 block">
              {isSo ? 'Xisaabta Sarifka' : 'Exchange Rate Calculation'}
            </span>
            <div className="text-base font-semibold text-slate-900 font-mono mt-0.5">
              1 {fromCurrency} = {(toRate / fromRate).toLocaleString(undefined, { maximumFractionDigits: 4 })} {toCurrency}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCustomRate(!showCustomRate)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-100"
            >
              <Settings2 className="w-3.5 h-3.5 text-slate-500" />
              {isSo ? 'Deji Qiimaha Suuqa (SOS)' : 'Custom SOS Rate'}
            </button>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#1E88E5] hover:bg-[#1976D2] rounded transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? (isSo ? 'La guriyay!' : 'Copied!') : (isSo ? 'Guri' : 'Copy')}
            </button>
          </div>
        </div>

        {/* Custom SOS rate input box */}
        {showCustomRate && (
          <div className="mt-4 pt-3 border-t border-slate-200 text-xs">
            <label className="block text-slate-700 font-medium mb-1">
              {isSo ? 'Qiimaha Suuqa ee $1 USD -> Shillin Soomaali:' : 'Market Rate 1 USD -> Somali Shillings:'}
            </label>
            <div className="flex items-center gap-2">
              <span className="font-mono text-slate-500">$1 USD =</span>
              <input
                type="number"
                value={customSosRate}
                onChange={(e) => setCustomSosRate(e.target.value)}
                className="w-36 px-2 py-1 bg-white border border-slate-300 rounded font-mono text-xs focus:outline-none focus:border-[#1E88E5]"
              />
              <span className="text-slate-500">SOS</span>
              <span className="text-[11px] text-slate-400">
                ({isSo ? 'Kala beddel sida suuqa dhabta ah' : 'Adjustable to current street rate'})
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Quick rates overview table */}
      <div className="border border-slate-200 rounded-lg p-3 bg-white">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
          {isSo ? 'Sarifka 1 Doolar ($1 USD) Maanta' : 'Indicative Rates for $1.00 USD'}
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
          {Object.entries(baseRates).filter(([c]) => c !== 'USD').map(([curr, rate]) => (
            <div key={curr} className="flex justify-between p-1.5 bg-slate-50 rounded border border-slate-100">
              <span className="font-medium text-slate-700">{curr}:</span>
              <span className="font-mono text-slate-900 tabular-nums">{rate.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
