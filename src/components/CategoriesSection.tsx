import React from 'react';
import { Category, Language } from '../types';
import { DynamicIcon } from './DynamicIcon';
import { ArrowRight } from 'lucide-react';

interface Props {
  categories: Category[];
  language: Language;
  onSelectCategory: (id: any) => void;
  toolCounts: Record<string, number>;
}

export const CategoriesSection: React.FC<Props> = ({
  categories,
  language,
  onSelectCategory,
  toolCounts,
}) => {
  const isSo = language === 'so';

  return (
    <section id="categories" className="py-14 sm:py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0A2342] tracking-tight">
              {isSo ? 'Qaybaha Qalabka' : 'Tool Categories'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              {isSo
                ? 'Qalabka oo u kala habaysan baahiyaha kala duwan ee shaqada iyo nolosha.'
                : 'Curated by everyday domain: business, learning, work, finance, and daily life.'}
            </p>
          </div>

          <span className="text-xs text-slate-500 font-mono">
            6 {isSo ? 'Qaybood oo Muhiim ah' : 'Core Categories'}
          </span>
        </div>

        {/* 6 Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => {
            const count = toolCounts[cat.id] || 0;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className="text-left p-5 bg-white border border-slate-200 rounded-lg hover:border-[#1E88E5] hover:shadow-xs transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded bg-slate-100 group-hover:bg-[#E3F2FD] flex items-center justify-center text-[#0A2342] group-hover:text-[#1E88E5] transition-colors">
                      <DynamicIcon name={cat.icon} className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono text-slate-400 group-hover:text-[#1E88E5]">
                      {count} {isSo ? 'qalab' : 'tools'}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#0A2342] group-hover:text-[#1E88E5] transition-colors">
                    {isSo ? cat.labelSo : cat.labelEn}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {isSo ? cat.descriptionSo : cat.descriptionEn}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1 text-xs font-medium text-[#1E88E5]">
                  <span>{isSo ? 'Eeg qalabka' : 'View tools'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
