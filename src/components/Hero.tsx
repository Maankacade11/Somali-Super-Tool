import React from 'react';
import { Language } from '../types';
import { ArrowDown, CheckCircle2, Shield, Zap } from 'lucide-react';

interface Props {
  language: Language;
  onExploreClick: () => void;
  totalTools: number;
}

export const Hero: React.FC<Props> = ({ language, onExploreClick, totalTools }) => {
  const isSo = language === 'so';

  return (
    <section id="home" className="relative pt-12 pb-16 sm:pt-16 sm:pb-20 border-b border-slate-200 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Clean Kicker (unboxed, editorial) */}
        <p className="text-xs font-semibold tracking-wider uppercase text-slate-500 mb-3">
          {isSo ? 'Madal Bilaash ah oo Furan' : 'Independent Free Utility Suite'}
        </p>

        {/* Primary Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#0A2342] tracking-tight leading-tight sm:leading-tight">
          {isSo ? 'Dhammaan qalabkaaga, hal meel.' : 'All your tools, in one place.'}
        </h1>

        {/* Description */}
        <p className="mt-4 sm:mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          {isSo
            ? 'Qalab bilaash ah oo kuu fududaynaya shaqada, ganacsiga, waxbarashada iyo hawlaha maalinlaha ah.'
            : 'Free utility tools simplifying your work, business, education, and daily life tasks.'}
        </p>

        {/* Actions & Secondary trust text */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onExploreClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[#1E88E5] hover:bg-[#1976D2] rounded-md transition-colors shadow-xs"
          >
            <span>{isSo ? 'Baadh Qalabka' : 'Explore Tools'}</span>
            <ArrowDown className="w-4 h-4" />
          </button>
        </div>

        {/* Secondary text: Bilaash • Fudud • Ammaan */}
        <div className="mt-6 flex items-center justify-center gap-3 text-xs text-slate-500">
          <span>{isSo ? 'Bilaash' : 'Free'}</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span>{isSo ? 'Fudud' : 'Simple'}</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span>{isSo ? 'Ammaan' : 'Secure'}</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span className="font-mono">{totalTools} {isSo ? 'Qalab oo Shaqeynaya' : 'Working Tools'}</span>
        </div>
      </div>
    </section>
  );
};
