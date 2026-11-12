import React, { useState, useEffect } from 'react';
import { Language } from '../../types';
import { Copy, Check, Download, Trash2, Save } from 'lucide-react';

interface Props {
  language: Language;
}

export const QuickNotepad: React.FC<Props> = ({ language }) => {
  const isSo = language === 'so';

  const [content, setContent] = useState<string>(() => {
    try {
      return localStorage.getItem('somali_quick_notepad') || '';
    } catch (e) {
      return '';
    }
  });

  const [copied, setCopied] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('somali_quick_notepad', content);
      setSavedNotice(true);
      const timer = setTimeout(() => setSavedNotice(false), 1200);
      return () => clearTimeout(timer);
    } catch (e) {
      console.error(e);
    }
  }, [content]);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `somali_note_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleClear = () => {
    if (window.confirm(isSo ? 'Ma hubtaa inaad tirtirayso qoraalka?' : 'Are you sure you want to clear your notes?')) {
      setContent('');
    }
  };

  const words = content.trim() ? content.trim().split(/\s+/).length : 0;
  const chars = content.length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-600">
        <div className="flex items-center gap-3">
          <span>{isSo ? 'Erayada:' : 'Words:'} <strong className="font-mono text-slate-900">{words}</strong></span>
          <span>{isSo ? 'Xarfaha:' : 'Characters:'} <strong className="font-mono text-slate-900">{chars}</strong></span>
          {savedNotice && (
            <span className="text-emerald-600 flex items-center gap-1 font-medium">
              <Save className="w-3 h-3" />
              {isSo ? 'Si toos ah u kaydsan' : 'Saved'}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            disabled={!content}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-100 disabled:opacity-40"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? (isSo ? 'La guriyay!' : 'Copied!') : (isSo ? 'Guri' : 'Copy')}
          </button>
          <button
            onClick={handleDownload}
            disabled={!content}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-100 disabled:opacity-40"
          >
            <Download className="w-3.5 h-3.5" />
            {isSo ? 'Soo deji (.txt)' : 'Export (.txt)'}
          </button>
          <button
            onClick={handleClear}
            disabled={!content}
            className="p-1 text-slate-400 hover:text-rose-600 disabled:opacity-40"
            title={isSo ? 'Tir qoraalka' : 'Clear notes'}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <textarea
        rows={10}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={
          isSo
            ? 'Qor qoraal, fikrad, lambarro ama wax kasta oo aad rabto inaad si degdeg ah u kaydsato...\nWaxay ku kaydsan yihiin browserkaaga xitaa haddii aad bogga xirto.'
            : 'Jot down thoughts, ideas, links, or draft messages...\nEverything is stored locally on this browser.'
        }
        className="w-full p-4 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#1E88E5] focus:ring-1 focus:ring-[#1E88E5] leading-relaxed font-sans"
      />
    </div>
  );
};
