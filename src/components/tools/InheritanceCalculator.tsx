import React, { useState } from 'react';
import { Language } from '../../types';
import { Scale, Copy, Check, RotateCcw, Info, Users } from 'lucide-react';

interface Props {
  language: Language;
}

export const InheritanceCalculator: React.FC<Props> = ({ language }) => {
  const isSo = language === 'so';

  const [estateValue, setEstateValue] = useState<string>('50000');
  const [debts, setDebts] = useState<string>('2000');
  const [wasiyah, setWasiyah] = useState<string>('0');

  const [deceasedGender, setDeceasedGender] = useState<'male' | 'female'>('male');
  const [wivesCount, setWivesCount] = useState<number>(1);
  const [husbandPresent, setHusbandPresent] = useState<boolean>(true);
  const [sonsCount, setSonsCount] = useState<number>(2);
  const [daughtersCount, setDaughtersCount] = useState<number>(3);
  const [fatherAlive, setFatherAlive] = useState<boolean>(true);
  const [motherAlive, setMotherAlive] = useState<boolean>(true);

  const [copied, setCopied] = useState(false);

  // Compute estate net
  const grossEstate = parseFloat(estateValue) || 0;
  const debtsVal = parseFloat(debts) || 0;
  const wasiyahRequested = parseFloat(wasiyah) || 0;

  const afterDebts = Math.max(0, grossEstate - debtsVal);
  // Wasiyah capped at 1/3 of net
  const maxWasiyah = afterDebts / 3;
  const actualWasiyah = Math.min(wasiyahRequested, maxWasiyah);
  const distributableEstate = Math.max(0, afterDebts - actualWasiyah);

  const hasChildren = sonsCount > 0 || daughtersCount > 0;

  // Inheritance calculation
  interface HeirShare {
    heirSo: string;
    heirEn: string;
    fraction: string;
    amount: number;
    count: number;
    perPerson: number;
  }

  const shares: HeirShare[] = [];
  let remaining = distributableEstate;

  // 1. Spouse
  if (deceasedGender === 'male') {
    if (wivesCount > 0) {
      const wifeFractionNum = hasChildren ? 1 / 8 : 1 / 4;
      const wifeTotal = distributableEstate * wifeFractionNum;
      remaining -= wifeTotal;
      shares.push({
        heirSo: wivesCount > 1 ? `Xaaska (${wivesCount} xaas)` : 'Xaaska (Wife)',
        heirEn: wivesCount > 1 ? `Wives (${wivesCount})` : 'Wife',
        fraction: hasChildren ? '1/8' : '1/4',
        amount: wifeTotal,
        count: wivesCount,
        perPerson: wifeTotal / wivesCount,
      });
    }
  } else {
    if (husbandPresent) {
      const husbandFractionNum = hasChildren ? 1 / 4 : 1 / 2;
      const husbandTotal = distributableEstate * husbandFractionNum;
      remaining -= husbandTotal;
      shares.push({
        heirSo: 'Sayga / Ninka (Husband)',
        heirEn: 'Husband',
        fraction: hasChildren ? '1/4' : '1/2',
        amount: husbandTotal,
        count: 1,
        perPerson: husbandTotal,
      });
    }
  }

  // 2. Mother
  if (motherAlive) {
    const motherFractionNum = hasChildren ? 1 / 6 : 1 / 3;
    const motherTotal = distributableEstate * motherFractionNum;
    remaining -= motherTotal;
    shares.push({
      heirSo: 'Hooyada (Mother)',
      heirEn: 'Mother',
      fraction: hasChildren ? '1/6' : '1/3',
      amount: motherTotal,
      count: 1,
      perPerson: motherTotal,
    });
  }

  // 3. Father
  if (fatherAlive) {
    const fatherFractionNum = 1 / 6;
    const fatherTotal = distributableEstate * fatherFractionNum;
    remaining -= fatherTotal;
    shares.push({
      heirSo: 'Aabbaha (Father)',
      heirEn: 'Father',
      fraction: '1/6',
      amount: fatherTotal,
      count: 1,
      perPerson: fatherTotal,
    });
  }

  // 4. Children (Residue / Asabah)
  if (hasChildren) {
    const totalChildUnits = sonsCount * 2 + daughtersCount;
    if (sonsCount > 0) {
      const perUnit = remaining > 0 ? remaining / totalChildUnits : 0;
      const sonTotal = perUnit * (sonsCount * 2);
      const daughterTotal = perUnit * daughtersCount;

      shares.push({
        heirSo: `Wiilasha (${sonsCount} wiil)`,
        heirEn: `Sons (${sonsCount})`,
        fraction: isSo ? 'Casabo (2 saami)' : 'Residue (2 shares each)',
        amount: sonTotal,
        count: sonsCount,
        perPerson: sonsCount > 0 ? sonTotal / sonsCount : 0,
      });

      if (daughtersCount > 0) {
        shares.push({
          heirSo: `Gabdhaha (${daughtersCount} gabdhood)`,
          heirEn: `Daughters (${daughtersCount})`,
          fraction: isSo ? 'Casabo (1 saami)' : 'Residue (1 share each)',
          amount: daughterTotal,
          count: daughtersCount,
          perPerson: daughtersCount > 0 ? daughterTotal / daughtersCount : 0,
        });
      }
    } else {
      // Only daughters, no sons
      const daughterFraction = daughtersCount === 1 ? 1 / 2 : 2 / 3;
      const daughterTotal = distributableEstate * daughterFraction;
      shares.push({
        heirSo: `Gabdhaha (${daughtersCount} gabdhood)`,
        heirEn: `Daughters (${daughtersCount})`,
        fraction: daughtersCount === 1 ? '1/2' : '2/3',
        amount: daughterTotal,
        count: daughtersCount,
        perPerson: daughterTotal / daughtersCount,
      });
    }
  }

  const handleCopy = () => {
    const summary = shares
      .map((s) => `${isSo ? s.heirSo : s.heirEn}: $${s.amount.toFixed(2)} (${s.fraction})`)
      .join(' | ');
    navigator.clipboard.writeText(`Dhaxalka Guud ee La Qaybiyay: $${distributableEstate.toFixed(2)} -> ${summary}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setEstateValue('10000');
    setDebts('0');
    setWasiyah('0');
    setSonsCount(1);
    setDaughtersCount(1);
  };

  return (
    <div className="space-y-6">
      {/* Intro note */}
      <div className="p-3 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-600 flex items-start gap-2">
        <Info className="w-4 h-4 text-[#1E88E5] shrink-0 mt-0.5" />
        <div>
          {isSo
            ? 'Qalabkani wuxuu u xisaabiyaa dhaxalka shareecada Islaamka (Suuradda An-Nisaa). Xisaabtu waxay bilaabmaysaa marka hore laga jaro deymaha iyo dardaaranka (ugu badnaan 1/3).'
            : 'Calculates estate distribution in accordance with Islamic Shariah (Surah An-Nisa). Debts and bequests (max 1/3) are deducted before shares are distributed.'}
        </div>
      </div>

      {/* Estate inputs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            {isSo ? 'Wadarta Hantida Dhaxalka ($)' : 'Total Estate Value ($)'}
          </label>
          <input
            type="number"
            value={estateValue}
            onChange={(e) => setEstateValue(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md font-mono tabular-nums focus:outline-none focus:border-[#1E88E5]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            {isSo ? 'Deymaha Qofka Lagu Lahaa ($)' : 'Debts of Deceased ($)'}
          </label>
          <input
            type="number"
            value={debts}
            onChange={(e) => setDebts(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md font-mono tabular-nums focus:outline-none focus:border-[#1E88E5]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            {isSo ? 'Dardaaran / Wasiyad ($)' : 'Bequest / Wasiyah ($)'}
          </label>
          <input
            type="number"
            value={wasiyah}
            onChange={(e) => setWasiyah(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md font-mono tabular-nums focus:outline-none focus:border-[#1E88E5]"
          />
          <span className="text-[10px] text-slate-400 block mt-0.5">
            {isSo ? 'Ugu badnaan 1/3 ee hantida' : 'Max 1/3 of net estate'}
          </span>
        </div>
      </div>

      {/* Relatives Selection */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-4 text-xs">
        <span className="font-bold text-slate-700 uppercase tracking-wider block">
          {isSo ? 'Qaraabada Nool ee Dhaxalka Leh' : 'Surviving Heirs Configuration'}
        </span>

        {/* Deceased Gender */}
        <div className="flex items-center gap-4">
          <span className="font-semibold text-slate-700">{isSo ? 'Qofka Geeriyooday:' : 'Deceased:'}</span>
          <label className="inline-flex items-center gap-1.5 cursor-pointer">
            <input
              type="radio"
              checked={deceasedGender === 'male'}
              onChange={() => setDeceasedGender('male')}
              className="accent-[#1E88E5]"
            />
            <span>{isSo ? 'Nin (Waxaa ka dhashay Xaas)' : 'Male (Husband / Father)'}</span>
          </label>
          <label className="inline-flex items-center gap-1.5 cursor-pointer">
            <input
              type="radio"
              checked={deceasedGender === 'female'}
              onChange={() => setDeceasedGender('female')}
              className="accent-[#1E88E5]"
            />
            <span>{isSo ? 'Haweenay (Waxaa ka dhashay Saygii)' : 'Female (Wife / Mother)'}</span>
          </label>
        </div>

        {/* Spouses */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {deceasedGender === 'male' ? (
            <div>
              <label className="text-slate-600 block mb-1">{isSo ? 'Tirada Xaasaska' : 'Wives Count'}</label>
              <select
                value={wivesCount}
                onChange={(e) => setWivesCount(parseInt(e.target.value))}
                className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded font-mono"
              >
                <option value={0}>{isSo ? 'Ma jiro (0)' : 'None (0)'}</option>
                <option value={1}>1 Xaas</option>
                <option value={2}>2 Xaas</option>
                <option value={3}>3 Xaas</option>
                <option value={4}>4 Xaas</option>
              </select>
            </div>
          ) : (
            <div>
              <label className="text-slate-600 block mb-1">{isSo ? 'Saygii / Ninkii' : 'Husband'}</label>
              <select
                value={husbandPresent ? 'yes' : 'no'}
                onChange={(e) => setHusbandPresent(e.target.value === 'yes')}
                className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded font-medium"
              >
                <option value="yes">{isSo ? 'Wuu nool yahay' : 'Alive'}</option>
                <option value="no">{isSo ? 'Wuu geeriyooday' : 'Deceased'}</option>
              </select>
            </div>
          )}

          <div>
            <label className="text-slate-600 block mb-1">{isSo ? 'Tirada Wiilasha' : 'Sons Count'}</label>
            <input
              type="number"
              min="0"
              value={sonsCount}
              onChange={(e) => setSonsCount(parseInt(e.target.value) || 0)}
              className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded font-mono"
            />
          </div>

          <div>
            <label className="text-slate-600 block mb-1">{isSo ? 'Tirada Gabdhaha' : 'Daughters Count'}</label>
            <input
              type="number"
              min="0"
              value={daughtersCount}
              onChange={(e) => setDaughtersCount(parseInt(e.target.value) || 0)}
              className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded font-mono"
            />
          </div>

          <div>
            <label className="text-slate-600 block mb-1">{isSo ? 'Waalidiinta' : 'Parents'}</label>
            <div className="space-y-1">
              <label className="flex items-center gap-1.5">
                <input
                  type="checkbox"
                  checked={fatherAlive}
                  onChange={(e) => setFatherAlive(e.target.checked)}
                  className="accent-[#1E88E5]"
                />
                <span>{isSo ? 'Aabbuhu waa nool yahay' : 'Father alive'}</span>
              </label>
              <label className="flex items-center gap-1.5">
                <input
                  type="checkbox"
                  checked={motherAlive}
                  onChange={(e) => setMotherAlive(e.target.checked)}
                  className="accent-[#1E88E5]"
                />
                <span>{isSo ? 'Hooyadu waa nooshahay' : 'Mother alive'}</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center text-xs">
          <span className="font-semibold text-slate-800 uppercase tracking-wider">
            {isSo ? 'Saamiyada Dhaxalka ee Qof Kasta' : 'Inheritance Shares Breakdown'}
          </span>
          <span className="font-mono text-slate-600">
            {isSo ? 'La Qaybiyay:' : 'Distributed:'} ${distributableEstate.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </span>
        </div>

        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase">
            <tr>
              <th className="py-2.5 px-3">{isSo ? 'Qaraabada' : 'Heir'}</th>
              <th className="py-2.5 px-3 text-center">{isSo ? 'Saamiga (Fraction)' : 'Share Fraction'}</th>
              <th className="py-2.5 px-3 text-right">{isSo ? 'Wadarta Kooxda ($)' : 'Group Total ($)'}</th>
              <th className="py-2.5 px-3 text-right">{isSo ? 'Qofkiiba ($)' : 'Each Receives ($)'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {shares.map((s, idx) => (
              <tr key={idx} className="hover:bg-slate-50">
                <td className="py-2.5 px-3 font-semibold text-slate-900">{isSo ? s.heirSo : s.heirEn}</td>
                <td className="py-2.5 px-3 text-center font-mono font-medium text-[#1E88E5]">{s.fraction}</td>
                <td className="py-2.5 px-3 text-right font-mono text-slate-800 tabular-nums">${s.amount.toFixed(2)}</td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-700 tabular-nums">
                  ${s.perPerson.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 font-medium text-white bg-[#1E88E5] hover:bg-[#1976D2] rounded transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? (isSo ? 'La guriyay!' : 'Copied!') : (isSo ? 'Guri Saamiyada' : 'Copy All Shares')}
          </button>

          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800"
          >
            <RotateCcw className="w-3 h-3" />
            {isSo ? 'Dib u deji' : 'Reset'}
          </button>
        </div>
      </div>
    </div>
  );
};
