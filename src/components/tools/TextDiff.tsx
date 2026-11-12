import React, { useState } from 'react';
import { Language } from '../../types';
import { GitCompare, RotateCcw } from 'lucide-react';

interface Props {
  language: Language;
}

export const TextDiff: React.FC<Props> = ({ language }) => {
  const isSo = language === 'so';

  const [textA, setTextA] = useState<string>(
    isSo
      ? `Qodobka 1aad: Heshiisku wuxuu bilaabmayaa 1da Janaayo.\nQodobka 2aad: Qiimaha bishiiba waa $500 doolar.\nQodobka 3aad: Bixinta waxaa la sameynayaa 5 maalmood gudahood.`
      : `Section 1: The contract commences on January 1st.\nSection 2: Monthly fee is $500.\nSection 3: Payment must be completed within 5 days.`
  );

  const [textB, setTextB] = useState<string>(
    isSo
      ? `Qodobka 1aad: Heshiisku wuxuu bilaabmayaa 1da Janaayo.\nQodobka 2aad: Qiimaha bishiiba waa $650 doolar.\nQodobka 3aad: Bixinta waxaa la sameynayaa 3 maalmood gudahood.\nQodobka 4aad: Heshiiska waxaa lagu cusbooneysiin karaa codsi qoraal ah.`
      : `Section 1: The contract commences on January 1st.\nSection 2: Monthly fee is $650.\nSection 3: Payment must be completed within 3 days.\nSection 4: Renewal requires written notice.`
  );

  const linesA = textA.split('\n');
  const linesB = textB.split('\n');
  const maxLines = Math.max(linesA.length, linesB.length);

  const diffRows = [];
  for (let i = 0; i < maxLines; i++) {
    const a = linesA[i];
    const b = linesB[i];

    if (a === b) {
      diffRows.push({ status: 'same', textA: a, textB: b });
    } else if (a !== undefined && b !== undefined) {
      diffRows.push({ status: 'modified', textA: a, textB: b });
    } else if (a !== undefined && b === undefined) {
      diffRows.push({ status: 'removed', textA: a, textB: '' });
    } else {
      diffRows.push({ status: 'added', textA: '', textB: b });
    }
  }

  const handleReset = () => {
    setTextA('');
    setTextB('');
  };

  return (
    <div className="space-y-6">
      {/* Two Text Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            {isSo ? 'Qoraalkii Hore (Original)' : 'Original Text (Version A)'}
          </label>
          <textarea
            rows={6}
            value={textA}
            onChange={(e) => setTextA(e.target.value)}
            placeholder={isSo ? 'Geli qoraalkii hore...' : 'Original text...'}
            className="w-full p-3 text-xs font-mono bg-white border border-slate-300 rounded-md focus:outline-none focus:border-[#1E88E5]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            {isSo ? 'Qoraalka Cusub (Revised)' : 'Revised Text (Version B)'}
          </label>
          <textarea
            rows={6}
            value={textB}
            onChange={(e) => setTextB(e.target.value)}
            placeholder={isSo ? 'Geli qoraalka cusub...' : 'New revised text...'}
            className="w-full p-3 text-xs font-mono bg-white border border-slate-300 rounded-md focus:outline-none focus:border-[#1E88E5]"
          />
        </div>
      </div>

      {/* Diff Result Table */}
      <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-700 uppercase tracking-wider">
            {isSo ? 'Natiijada Farqiga (Sadarrada)' : 'Line Comparison Output'}
          </span>
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            {isSo ? 'Tir Labadaba' : 'Clear Both'}
          </button>
        </div>

        <div className="divide-y divide-slate-100 text-xs font-mono max-h-72 overflow-y-auto">
          {diffRows.map((row, idx) => (
            <div
              key={idx}
              className={`p-2 flex items-start gap-3 ${
                row.status === 'modified'
                  ? 'bg-amber-50/60'
                  : row.status === 'added'
                  ? 'bg-emerald-50/70'
                  : row.status === 'removed'
                  ? 'bg-rose-50/70'
                  : 'hover:bg-slate-50'
              }`}
            >
              <span className="w-6 text-slate-400 select-none text-right shrink-0">
                {idx + 1}
              </span>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className={`${row.status === 'modified' || row.status === 'removed' ? 'text-rose-700' : 'text-slate-700'}`}>
                  {row.textA || <span className="text-slate-300 italic">—</span>}
                </div>
                <div className={`${row.status === 'modified' || row.status === 'added' ? 'text-emerald-700 font-semibold' : 'text-slate-700'}`}>
                  {row.textB || <span className="text-slate-300 italic">—</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
