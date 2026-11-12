/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Language, CategoryId, Tool, AppSettings } from './types';
import { CATEGORIES } from './data/categories';
import { TOOLS } from './data/tools';

import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CategoriesSection } from './components/CategoriesSection';
import { ToolsDirectory } from './components/ToolsDirectory';
import { AboutSection } from './components/AboutSection';
import { Footer } from './components/Footer';

import { ToolWorkbenchModal } from './components/ToolWorkbenchModal';
import { SettingsModal } from './components/SettingsModal';
import { PrivacyModal } from './components/PrivacyModal';
import { ContactModal } from './components/ContactModal';

export default function App() {
  const [language, setLanguage] = useState<Language>(() => {
    try {
      return (localStorage.getItem('somali_toolkit_lang') as Language) || 'so';
    } catch (e) {
      return 'so';
    }
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    return {
      language: 'so',
      defaultCurrency: 'USD',
      compactMode: false,
    };
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('somali_toolkit_favs');
      return saved ? JSON.parse(saved) : ['profit-calc', 'invoice-gen', 'currency-converter', 'qr-gen'];
    } catch (e) {
      return ['profit-calc', 'invoice-gen', 'currency-converter', 'qr-gen'];
    }
  });

  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all' | 'favorites'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTool, setActiveTool] = useState<Tool | null>(null);

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  // Sync language with settings and document lang attribute
  useEffect(() => {
    try {
      localStorage.setItem('somali_toolkit_lang', language);
      document.documentElement.lang = language;
    } catch (e) {
      console.error(e);
    }
  }, [language]);

  // Sync favorites
  useEffect(() => {
    try {
      localStorage.setItem('somali_toolkit_favs', JSON.stringify(favorites));
    } catch (e) {
      console.error(e);
    }
  }, [favorites]);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setSettings((prev) => ({ ...prev, language: lang }));
  };

  const handleUpdateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      if (newSettings.language && newSettings.language !== language) {
        setLanguage(newSettings.language);
      }
      return updated;
    });
  };

  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectCategoryFromHeroOrGrid = (catId: CategoryId) => {
    setSelectedCategory(catId);
    const el = document.getElementById('tools');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleExploreClick = () => {
    const el = document.getElementById('tools');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Compute tool count per category
  const toolCounts = CATEGORIES.reduce((acc, cat) => {
    acc[cat.id] = TOOLS.filter((t) => t.category === cat.id).length;
    return acc;
  }, {} as Record<string, number>);

  const activeCategory = activeTool
    ? CATEGORIES.find((c) => c.id === activeTool.category)
    : undefined;

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-[#E3F2FD] selection:text-[#0A2342]">
      {/* 1. Header */}
      <Header
        language={language}
        onLanguageChange={handleLanguageChange}
        onOpenSettings={() => setSettingsOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="flex-1">
        {/* 2. Hero Section */}
        <Hero
          language={language}
          onExploreClick={handleExploreClick}
          totalTools={TOOLS.length}
        />

        {/* 3. Categories Section */}
        <CategoriesSection
          categories={CATEGORIES}
          language={language}
          onSelectCategory={handleSelectCategoryFromHeroOrGrid}
          toolCounts={toolCounts}
        />

        {/* 4. Tools Directory */}
        <ToolsDirectory
          tools={TOOLS}
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenTool={(tool) => setActiveTool(tool)}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          language={language}
        />

        {/* 5. About Section */}
        <AboutSection language={language} />
      </main>

      {/* 6. Footer */}
      <Footer
        language={language}
        onOpenPrivacy={() => setPrivacyOpen(true)}
        onOpenContact={() => setContactOpen(true)}
        onOpenAbout={() => {
          const el = document.getElementById('about');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Interactive Tool Workbench Dialog */}
      <ToolWorkbenchModal
        tool={activeTool}
        category={activeCategory}
        language={language}
        onClose={() => setActiveTool(null)}
        isFavorite={activeTool ? favorites.includes(activeTool.id) : false}
        onToggleFavorite={(id) => toggleFavorite(id)}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        favoritesCount={favorites.length}
      />

      {/* Privacy Policy Modal */}
      <PrivacyModal
        isOpen={privacyOpen}
        onClose={() => setPrivacyOpen(false)}
        language={language}
      />

      {/* Contact & Feedback Modal */}
      <ContactModal
        isOpen={contactOpen}
        onClose={() => setContactOpen(false)}
        language={language}
      />
    </div>
  );
}
