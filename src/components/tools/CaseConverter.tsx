import React, { useState } from 'react';
import { Language } from '../../types';
import { Copy, Check, RotateCcw } from 'lucide-react';

interface Props {
  language: Language;
}

export const CaseConverter: React.FC<Props> = ({ language }) => {
  const isSo = language === 'so';

  const [text, setText] = useState<string>(
    isSo
      ? 'Somali Super Toolkit: Qalabkaaga maalinlaha ah oo bilaash ah.'
      : 'Somali Super Toolkit: Your everyday utility platform.'
  );
  const [copied, setCopied] = useState(false);

  const toUpper = () => setText(text.toUpperCase());
  const toLower = () => setText(text.toLowerCase());

  const toTitle = () => {
    setText(
      text.replace(
        /\w\S*/g,
        (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
      )
    );
  };

  const toSentence = () => {
    setText(
      text
        .toLowerCase()
        .replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase())
    );
  };

  const toSlug = () => {
    setText(
      text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '')
    );
  };

  const cleanWhitespace = () => {
    setText(text.replace(/\s+/g, ' ').trim());
  };

  const reverseText = () => {
    setText(text.split('').reverse().join(''));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Transformation Action Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <button
          onClick={toUpper}
          className="px-3 py-2 text-xs font-semibold bg-white border border-slate-300 rounded hover:bg-slate-50 text-slate-800 transition-colors uppercase tracking-wider"
        >
          {isSo ? 'WAAWEYN' : 'UPPERCASE'}
        </button>

        <button
          onClick={toLower}
          className="px-3 py-2 text-xs font-semibold bg-white border border-slate-300 rounded hover:bg-slate-50 text-slate-800 transition-colors lowercase"
        >
          {isSo ? 'yaryar' : 'lowercase'}
        </button>

        <button
          onClick={toTitle}
          className="px-3 py-2 text-xs font-semibold bg-white border border-slate-300 rounded hover:bg-slate-50 text-slate-800 transition-colors capitalize"
        >
          {isSo ? 'Cinwaan (Title)' : 'Title Case'}
        </button>

        <button
          onClick={toSentence}
          className="px-3 py-2 text-xs font-semibold bg-white border border-slate-300 rounded hover:bg-slate-50 text-slate-800 transition-colors"
        >
          {isSo ? 'Sadarka Koowaad' : 'Sentence case'}
        </button>

        <button
          onClick={toSlug}
          className="px-3 py-2 text-xs font-semibold bg-white border border-slate-300 rounded hover:bg-slate-50 text-slate-800 transition-colors font-mono"
        >
          slug-url-case
        </button>

        <button
          onClick={cleanWhitespace}
          className="px-3 py-2 text-xs font-semibold bg-white border border-slate-300 rounded hover:bg-slate-50 text-slate-800 transition-colors"
        >
          {isSo ? 'Nadiifi Bannaanada' : 'Clean Spaces'}
        </button>

        <button
          onClick={reverseText}
          className="px-3 py-2 text-xs font-semibold bg-white border border-slate-300 rounded hover:bg-slate-50 text-slate-800 transition-colors"
        >
          {isSo ? 'Dib u Geli (Reverse)' : 'Reverse Text'}
        </button>

        <button
          onClick={() => setText('')}
          className="px-3 py-2 text-xs font-semibold bg-white border border-rose-200 text-rose-600 rounded hover:bg-rose-50 transition-colors"
        >
          {isSo ? 'Tir Qoraalka' : 'Clear Text'}
        </button>
      </div>

      <textarea
        rows={7}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={isSo ? 'Ku qor qoraalka halkan...' : 'Type or paste text here...'}
        className="w-full p-4 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#1E88E5] focus:ring-1 focus:ring-[#1E88E5] leading-relaxed"
      />

      <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
        <div>
          <span>{isSo ? 'Xarfaha:' : 'Chars:'} <strong className="font-mono text-slate-800">{text.length}</strong></span>
          <span className="mx-2">·</span>
          <span>{isSo ? 'Erayada:' : 'Words:'} <strong className="font-mono text-slate-800">{text.trim() ? text.trim().split(/\s+/).length : 0}</strong></span>
        </div>

        <button
          onClick={handleCopy}
          disabled={!text}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-[#1E88E5] hover:bg-[#1976D2] rounded transition-colors disabled:opacity-40"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? (isSo ? 'La guriyay!' : 'Copied!') : (isSo ? 'Guri Qoraalka' : 'Copy Text')}
        </button>
      </div>
    </div>
  );
};
