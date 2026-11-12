import React from 'react';
import { Language } from '../types';
import { Logo } from './Logo';

interface Props {
  language: Language;
  onOpenPrivacy: () => void;
  onOpenContact: () => void;
  onOpenAbout: () => void;
}

export const Footer: React.FC<Props> = ({
  language,
  onOpenPrivacy,
  onOpenContact,
  onOpenAbout,
}) => {
  const isSo = language === 'so';

  return (
    <footer className="bg-white border-t border-slate-200 py-12 text-slate-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-8 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <Logo size={24} className="w-6 h-6 shrink-0" />
            <span className="font-bold text-sm text-[#0A2342] tracking-tight">
              Somali Super Toolkit
            </span>
          </div>

          <nav className="flex flex-wrap items-center gap-6 text-xs text-slate-600">
            <a
              href="#about"
              onClick={onOpenAbout}
              className="hover:text-[#0A2342] transition-colors"
            >
              {isSo ? 'Nagu Saabsan' : 'About'}
            </a>
            <button
              onClick={onOpenPrivacy}
              className="hover:text-[#0A2342] transition-colors"
            >
              {isSo ? 'Xogta & Qarsoodiga' : 'Privacy'}
            </button>
            <button
              onClick={onOpenContact}
              className="hover:text-[#0A2342] transition-colors"
            >
              {isSo ? 'Nala Soo Xiriir' : 'Contact'}
            </button>
            <a href="#tools" className="hover:text-[#0A2342] transition-colors">
              {isSo ? 'Qalabka' : 'Tools'}
            </a>
          </nav>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500">
          <p className="text-slate-500">
            © {new Date().getFullYear()} Somali Super Toolkit. {isSo ? 'Xuquuqda oo dhan waa dhowran tahay.' : 'All rights reserved.'}
          </p>

          <p className="font-medium text-[#0A2342]">
            {isSo ? 'Loo sameeyay qof kasta (Made for everyone).' : 'Made for everyone.'}
          </p>
        </div>
      </div>
    </footer>
  );
};
