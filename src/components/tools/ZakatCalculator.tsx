import React, { useState } from 'react';
import { Language } from '../../types';
import { Scale, RotateCcw, Copy, Check, Info } from 'lucide-react';

interface Props {
  language: Language;
}

export const ZakatCalculator: React.FC<Props> = ({ language }) => {
  const isSo = language === 'so';

  const [cash, setCash] = useState<string>('8000');
  const [goldGrams, setGoldGrams] = useState<string>('0');
  const [goldPricePerGram, setGoldPricePerGram] = useState<string>('75');
  const [silverGrams, setSilverGrams] = useState<string>('0');
  const [silverPricePerGram, setSilverPricePerGram] = useState<string>('1.0');
  const [inventory, setInventory] = useState<string>('0');
  const [debts, setDebts] = useState<string>('500');
  const [nisabType, setNisabType] = useState<'gold' | 'silver'>('gold');
  const [copied, setCopied] = useState(false);

  const cashVal = parseFloat(cash) || 0;
  const goldVal = (parseFloat(goldGrams) || 0) * (parseFloat(goldPricePerGram) || 0);
  const silverVal = (parseFloat(silverGrams) || 0) * (parseFloat(silverPricePerGram) || 0);
  const inventoryVal = parseFloat(inventory) || 0;
  const debtsVal = parseFloat(debts) || 0;

  const totalAssets = cashVal + goldVal + silverVal + inventoryVal;
  const netZakatable = Math.max(0, totalAssets - debtsVal);

  // Nisab standards: 85g gold or 595g silver
  const goldNisabThreshold = 85 * (parseFloat(goldPricePerGram) || 75);
  const silverNisabThreshold = 595 * (parseFloat(silverPricePerGram) || 1.0);
  const activeNisabThreshold = nisabType === 'gold' ? goldNisabThreshold : silverNisabThreshold;

  const isEligible = netZakatable >= activeNisabThreshold;
  const zakatPayable = isEligible ? netZakatable * 0.025 : 0;

  const handleCopy = () => {
    const text = isSo
      ? `Maalka Sakada Gaaray: $${netZakatable.toLocaleString()} | Xaddiga Nisabka: $${activeNisabThreshold.toLocaleString()} | Sakada Waajibka ah (2.5%): $${zakatPayable.toFixed(2)}`
      : `Net Zakatable Wealth: $${netZakatable.toLocaleString()} | Nisab: $${activeNisabThreshold.toLocaleString()} | Zakat Due (2.5%): $${zakatPayable.toFixed(2)}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setCash('0');
    setGoldGrams('0');
    setSilverGrams('0');
    setInventory('0');
    setDebts('0');
  };

  return (
    <div className="space-y-6">
      {/* Intro note */}
      <div className="p-3 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-600 flex items-start gap-2">
        <Info className="w-4 h-4 text-[#1E88E5] shrink-0 mt-0.5" />
        <div>
          {isSo
            ? 'Sakada maalku waa 2.5% (rubuc-tobnaad) marka maalkaagu dhaafo Nisabka (85g oo dahab ah ama 595g oo qalin ah) isla markaana uu sanad buuxa (Xawl) ku wareego.'
            : 'Zakat on wealth is 2.5% (1/40th) when your net wealth meets or exceeds the Nisab threshold (85g gold or 595g silver) and has been held for one lunar year.'}
        </div>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            {isSo ? 'Lacagta Caddaanka & Bangiyada ($)' : 'Cash & Bank Balances ($)'}
          </label>
          <input
            type="number"
            value={cash}
            onChange={(e) => setCash(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md focus:outline-none focus:border-[#1E88E5] font-mono tabular-nums"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            {isSo ? 'Badeecada Ganacsiga ($)' : 'Business Inventory Value ($)'}
          </label>
          <input
            type="number"
            value={inventory}
            onChange={(e) => setInventory(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md focus:outline-none focus:border-[#1E88E5] font-mono tabular-nums"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            {isSo ? 'Dahabka Maalgashiga (Garaam)' : 'Gold for Investment (Grams)'}
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Grams"
              value={goldGrams}
              onChange={(e) => setGoldGrams(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md focus:outline-none focus:border-[#1E88E5] font-mono tabular-nums"
            />
            <div className="flex items-center text-xs text-slate-500 font-mono">
              @ ${goldPricePerGram}/g
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            {isSo ? 'Deymaha Degdegga ah ee Kugu Leeyihiin ($)' : 'Short-Term Liabilities & Debts ($)'}
          </label>
          <input
            type="number"
            value={debts}
            onChange={(e) => setDebts(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md focus:outline-none focus:border-[#1E88E5] font-mono tabular-nums"
          />
        </div>
      </div>

      {/* Nisab standard selector */}
      <div className="flex items-center justify-between text-xs bg-slate-50 p-2.5 rounded border border-slate-200">
        <span className="text-slate-600 font-medium">
          {isSo ? 'Halbeegga Nisabka la barbar-dhigayo:' : 'Nisab Standard Benchmark:'}
        </span>
        <div className="flex items-center gap-2">
          <label className="inline-flex items-center gap-1 cursor-pointer">
            <input
              type="radio"
              checked={nisabType === 'gold'}
              onChange={() => setNisabType('gold')}
              className="text-[#1E88E5]"
            />
            <span>{isSo ? 'Dahab (85g ~$6,375)' : 'Gold (85g ~$6,375)'}</span>
          </label>
          <label className="inline-flex items-center gap-1 cursor-pointer">
            <input
              type="radio"
              checked={nisabType === 'silver'}
              onChange={() => setNisabType('silver')}
              className="text-[#1E88E5]"
            />
            <span>{isSo ? 'Qalin (595g ~$595)' : 'Silver (595g ~$595)'}</span>
          </label>
        </div>
      </div>

      {/* Zakat Result Summary */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-5">
        <div className="text-center py-4 border-b border-slate-200">
          <span className="text-xs uppercase tracking-wider text-slate-500 block mb-1">
            {isSo ? 'Sakada Waajibka ah (2.5%)' : 'Zakat Amount Due (2.5%)'}
          </span>
          <div className={`text-4xl font-extrabold font-mono tabular-nums ${isEligible ? 'text-emerald-700' : 'text-slate-500'}`}>
            ${zakatPayable.toFixed(2)}
          </div>
          <div className="mt-1 text-xs">
            {isEligible ? (
              <span className="text-emerald-700 font-medium">
                {isSo ? 'Maalkaagu wuxuu gaaray Nisabka. Sakadu waa waajib.' : 'Wealth meets Nisab criteria. Zakat is obligatory.'}
              </span>
            ) : (
              <span className="text-slate-500">
                {isSo ? 'Maalkaagu kama badna Nisabka ($' + activeNisabThreshold.toFixed(0) + '). Sakadu kugu ma waajibin.' : 'Wealth is below the Nisab threshold. No Zakat due.'}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4 text-xs text-center">
          <div>
            <span className="text-slate-500 block">{isSo ? 'Wadarta Hantida' : 'Total Gross Assets'}</span>
            <span className="font-semibold text-slate-800 font-mono tabular-nums">${totalAssets.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-slate-500 block">{isSo ? 'Deymaha Laga Jaray' : 'Deductions (Debts)'}</span>
            <span className="font-semibold text-rose-600 font-mono tabular-nums">-${debtsVal.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-slate-500 block">{isSo ? 'Maalka La Saafay' : 'Net Zakatable Wealth'}</span>
            <span className="font-semibold text-slate-900 font-mono tabular-nums">${netZakatable.toLocaleString()}</span>
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
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            {isSo ? 'Dib u deji' : 'Reset'}
          </button>
        </div>
      </div>
    </div>
  );
};
