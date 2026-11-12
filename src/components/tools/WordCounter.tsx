import React, { useState } from 'react';
import { Language } from '../../types';
import { Copy, Check, Trash2, Clock, Volume2 } from 'lucide-react';

interface Props {
  language: Language;
}

export const WordCounter: React.FC<Props> = ({ language }) => {
  const isSo = language === 'so';

  const [text, setText] = useState<string>(
    isSo
      ? 'Somali Super Toolkit waa madal casri ah oo bilaash ah. Waxay isu keentaa dhammaan qalabka lagama maarmaanka u ah ganacsiga, waxbarashada iyo nolosha maalinlaha ah.'
      : 'Somali Super Toolkit is a clean, minimal utility suite designed for work, business, study, and daily tasks.'
  );
  const [copied, setCopied] = useState(false);

  const cleanText = text.trim();
  const words = cleanText ? cleanText.split(/\s+/).filter(Boolean).length : 0;
  const charactersWithSpaces = text.length;
  const charactersWithoutSpaces = text.replace(/\s/g, '').length;
  const sentences = cleanText ? (cleanText.match(/[.!?]+(?:\s|$)/g) || []).length || (words > 0 ? 1 : 0) : 0;
  const paragraphs = cleanText ? cleanText.split(/\n+/).filter((p) => p.trim().length > 0).length : 0;

  const readingTimeMin = Math.ceil(words / 200) || 1;
  const speakingTimeMin = Math.ceil(words / 130) || 1;

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setText('');
  };

  return (
    <div className="space-y-5">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
          <span className="text-xs text-slate-500 uppercase tracking-wider block">{isSo ? 'Erayada' : 'Words'}</span>
          <span className="text-2xl font-bold font-mono text-[#0A2342] tabular-nums">{words}</span>
        </div>

        <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
          <span className="text-xs text-slate-500 uppercase tracking-wider block">{isSo ? 'Xarfaha (Dhammaan)' : 'Characters'}</span>
          <span className="text-2xl font-bold font-mono text-[#0A2342] tabular-nums">{charactersWithSpaces}</span>
        </div>

        <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
          <span className="text-xs text-slate-500 uppercase tracking-wider block">{isSo ? 'Sadarrada' : 'Sentences'}</span>
          <span className="text-2xl font-bold font-mono text-[#0A2342] tabular-nums">{sentences}</span>
        </div>

        <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
          <span className="text-xs text-slate-500 uppercase tracking-wider block">{isSo ? 'Faqradaha' : 'Paragraphs'}</span>
          <span className="text-2xl font-bold font-mono text-[#0A2342] tabular-nums">{paragraphs}</span>
        </div>
      </div>

      {/* Main Textarea */}
      <div className="relative">
        <textarea
          rows={7}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={isSo ? 'Ku qor ama ku dheji qoraalkaaga halkan...' : 'Type or paste your text here...'}
          className="w-full p-4 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#1E88E5] focus:ring-1 focus:ring-[#1E88E5] leading-relaxed"
        />

        <div className="flex flex-wrap items-center justify-between gap-2 mt-2 text-xs text-slate-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {isSo ? `Waqtiga Akhrinta: ~${readingTimeMin} daq` : `Reading Time: ~${readingTimeMin} min`}
            </span>
            <span className="flex items-center gap-1">
              <Volume2 className="w-3.5 h-3.5 text-slate-400" />
              {isSo ? `Waqtiga Hadalka: ~${speakingTimeMin} daq` : `Speaking Time: ~${speakingTimeMin} min`}
            </span>
            <span>
              {isSo ? 'Xarfaha aan bannaanada lahayn' : 'Without spaces'}:{' '}
              <strong className="font-mono text-slate-700">{charactersWithoutSpaces}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              disabled={!text}
              className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-40"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? (isSo ? 'Waa la guriyay!' : 'Copied!') : (isSo ? 'Guri' : 'Copy Text')}
            </button>
            <button
              onClick={handleClear}
              disabled={!text}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-rose-600 hover:bg-rose-50 rounded disabled:opacity-40"
            >
              <Trash2 className="w-3.5 h-3.5" />
              {isSo ? 'Tir' : 'Clear'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
