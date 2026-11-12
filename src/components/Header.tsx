import React, { useState } from 'react';
import { Language } from '../types';
import { Logo } from './Logo';
import { Search, Settings, Globe, Menu, X } from 'lucide-react';

interface Props {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenSettings: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Header: React.FC<Props> = ({
  language,
  onLanguageChange,
  onOpenSettings,
  searchQuery,
  onSearchChange,
}) => {
  const isSo = language === 'so';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleLanguage = () => {
    onLanguageChange(isSo ? 'en' : 'so');
  };

  const navLinks = [
    { href: '#home', labelSo: 'Bogga Hore', labelEn: 'Home' },
    { href: '#tools', labelSo: 'Qalabka', labelEn: 'Tools' },
    { href: '#categories', labelSo: 'Qaybaha', labelEn: 'Categories' },
    { href: '#about', labelSo: 'Nagu Saabsan', labelEn: 'About' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xs border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Zone 1: Brand Wordmark */}
          <a
            href="#home"
            className="flex items-center gap-2.5 text-[#0A2342] hover:opacity-90 transition-opacity whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E88E5] rounded"
          >
            <Logo size={26} className="w-6.5 h-6.5 shrink-0" />
            <span className="font-bold text-base sm:text-lg tracking-tight">
              Somali Super Toolkit
            </span>
          </a>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="hover:text-[#0A2342] transition-colors whitespace-nowrap shrink-0 py-1"
              >
                {isSo ? link.labelSo : link.labelEn}
              </a>
            ))}
          </nav>

          {/* Zone 3: Search, Language Switch & Settings */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Inline search box */}
            <div className="relative hidden sm:block w-44 md:w-56">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={isSo ? 'Raadi qalab...' : 'Search tools...'}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-none focus:border-[#1E88E5] focus:ring-1 focus:ring-[#1E88E5] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2 top-2 text-xs text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Language Switch */}
            <button
              onClick={toggleLanguage}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-[#0A2342] bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md transition-colors whitespace-nowrap shrink-0"
              title={isSo ? 'Switch to English' : 'U beddel Soomaali'}
            >
              <Globe className="w-3.5 h-3.5 text-[#1E88E5]" />
              <span>{isSo ? 'English' : 'Soomaali'}</span>
            </button>

            {/* Settings button */}
            <button
              onClick={onOpenSettings}
              className="p-1.5 text-slate-500 hover:text-[#0A2342] hover:bg-slate-100 rounded-md border border-slate-200 transition-colors"
              title={isSo ? 'Hagaajinta' : 'Settings'}
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 text-slate-600 hover:text-[#0A2342] hover:bg-slate-100 rounded-md border border-slate-200"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile search bar when screen is small */}
        <div className="sm:hidden pb-3 pt-1">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={isSo ? 'Raadi qalabka...' : 'Search tools...'}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-none focus:border-[#1E88E5]"
            />
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-2">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-slate-700 hover:text-[#1E88E5]"
            >
              {isSo ? link.labelSo : link.labelEn}
            </a>
          ))}
        </div>
      )}
    </header>
  );
};
