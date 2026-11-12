import React from 'react';
import { Tool, Category, CategoryId, Language } from '../types';
import { DynamicIcon } from './DynamicIcon';
import { Search, Star, ArrowUpRight } from 'lucide-react';

interface Props {
  tools: Tool[];
  categories: Category[];
  selectedCategory: CategoryId | 'all' | 'favorites';
  onCategoryChange: (cat: CategoryId | 'all' | 'favorites') => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenTool: (tool: Tool) => void;
  favorites: string[];
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  language: Language;
}

export const ToolsDirectory: React.FC<Props> = ({
  tools,
  categories,
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  onOpenTool,
  favorites,
  onToggleFavorite,
  language,
}) => {
  const isSo = language === 'so';

  // Filter tools
  const filteredTools = tools.filter((tool) => {
    // Category filter
    if (selectedCategory === 'favorites') {
      if (!favorites.includes(tool.id)) return false;
    } else if (selectedCategory !== 'all') {
      if (tool.category !== selectedCategory) return false;
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName =
        tool.nameSo.toLowerCase().includes(q) ||
        tool.nameEn.toLowerCase().includes(q);
      const matchDesc =
        tool.descriptionSo.toLowerCase().includes(q) ||
        tool.descriptionEn.toLowerCase().includes(q);
      const matchTags =
        tool.tagsSo.some((t) => t.toLowerCase().includes(q)) ||
        tool.tagsEn.some((t) => t.toLowerCase().includes(q));
      return matchName || matchDesc || matchTags;
    }

    return true;
  });

  const getCategoryLabel = (catId: CategoryId) => {
    const found = categories.find((c) => c.id === catId);
    return isSo ? found?.labelSo : found?.labelEn;
  };

  return (
    <section id="tools" className="py-14 sm:py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading & Search */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0A2342] tracking-tight">
              {isSo ? 'Liiska Qalabka' : 'Tools Directory'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              {isSo
                ? 'Dooro qalabka aad u baahan tahay si aad isla markiiba u bilowdo isticmaalkiisa.'
                : 'Click any tool to launch immediately. All tools run client-side.'}
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={isSo ? 'Raadi magac ama hawl...' : 'Search by name or keyword...'}
              className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-none focus:border-[#1E88E5] focus:ring-1 focus:ring-[#1E88E5]"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-2.5 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Filter Tabs (Functional segmented buttons) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-6 no-scrollbar">
          <button
            onClick={() => onCategoryChange('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-[#0A2342] text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            {isSo ? 'Dhammaan' : 'All Tools'} ({tools.length})
          </button>

          {categories.map((cat) => {
            const count = tools.filter((t) => t.category === cat.id).length;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#0A2342] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                <DynamicIcon name={cat.icon} className="w-3.5 h-3.5" />
                <span>{isSo ? cat.labelSo : cat.labelEn}</span>
                <span className="opacity-70 font-mono text-[10px]">({count})</span>
              </button>
            );
          })}

          {favorites.length > 0 && (
            <button
              onClick={() => onCategoryChange('favorites')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                selectedCategory === 'favorites'
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-100 text-amber-700 hover:bg-amber-50'
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{isSo ? 'Kuwa La Doortay' : 'Favorites'}</span>
              <span className="font-mono text-[10px]">({favorites.length})</span>
            </button>
          )}
        </div>

        {/* Tools Grid */}
        {filteredTools.length === 0 ? (
          <div className="text-center py-12 px-4 bg-slate-50 border border-slate-200 rounded-lg">
            <p className="text-sm font-medium text-slate-700">
              {isSo ? 'Qalab ku habboon baaritaankaaga lama helin.' : 'No tools matched your search.'}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {isSo ? 'Iskuday inaad raadiso eray kale ama dooro "Dhammaan".' : 'Try searching another keyword or clear filters.'}
            </p>
            <button
              onClick={() => {
                onSearchChange('');
                onCategoryChange('all');
              }}
              className="mt-4 px-3 py-1.5 text-xs font-semibold text-white bg-[#1E88E5] hover:bg-[#1976D2] rounded transition-colors"
            >
              {isSo ? 'Dib u celi miiraha' : 'Reset Filters'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTools.map((tool) => {
              const isFav = favorites.includes(tool.id);
              return (
                <div
                  key={tool.id}
                  onClick={() => onOpenTool(tool)}
                  className="group relative p-4 sm:p-5 bg-white border border-slate-200 rounded-lg hover:border-[#1E88E5] hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    {/* Top Row: Icon + Category unboxed text + Star */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-8 h-8 rounded bg-slate-100 group-hover:bg-[#E3F2FD] flex items-center justify-center text-[#0A2342] group-hover:text-[#1E88E5] transition-colors">
                        <DynamicIcon name={tool.icon} className="w-4 h-4" />
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-medium text-slate-500">
                          {getCategoryLabel(tool.category)}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => onToggleFavorite(tool.id, e)}
                          className={`p-1 rounded hover:bg-slate-100 transition-colors ${
                            isFav ? 'text-amber-500' : 'text-slate-300 hover:text-slate-500'
                          }`}
                          title={isFav ? (isSo ? 'Ka saar' : 'Remove') : (isSo ? 'Dookh' : 'Favorite')}
                        >
                          <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-500' : ''}`} />
                        </button>
                      </div>
                    </div>

                    <h3 className="text-sm font-bold text-[#0A2342] group-hover:text-[#1E88E5] transition-colors line-clamp-1">
                      {isSo ? tool.nameSo : tool.nameEn}
                    </h3>

                    <p className="text-xs text-slate-600 mt-1 leading-relaxed line-clamp-2">
                      {isSo ? tool.descriptionSo : tool.descriptionEn}
                    </p>
                  </div>

                  {/* Bottom Action strip */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-400 font-mono">
                      {isSo ? 'Bilaash • Offline' : 'Free • Client-side'}
                    </span>

                    <span className="inline-flex items-center gap-1 font-semibold text-[#1E88E5] group-hover:text-[#1976D2]">
                      <span>{isSo ? 'Fur Qalabka' : 'Open Tool'}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
