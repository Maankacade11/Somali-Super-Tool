import React, { useState } from 'react';
import { Language } from '../../types';
import { Utensils, ShoppingCart, Copy, Check, RotateCcw, Plus, Trash2 } from 'lucide-react';

interface Props {
  language: Language;
}

interface DayMeal {
  daySo: string;
  dayEn: string;
  breakfast: string;
  lunch: string;
  dinner: string;
}

const DEFAULT_WEEK: DayMeal[] = [
  {
    daySo: 'Isniin',
    dayEn: 'Monday',
    breakfast: 'Canjeero, Beer & Shaah Cadaysan',
    lunch: 'Bariis Isku-karis, Hilib Ari & Moos',
    dinner: 'Muufo, Maraq Qudaar & Caano',
  },
  {
    daySo: 'Talaado',
    dayEn: 'Tuesday',
    breakfast: 'Boorash & Moos / Qaxwo',
    lunch: 'Baasto Saldaato & Suqaar Hilib Lo\'aad',
    dinner: 'Rooti, Ukun & Shaah Sanjabiil leh',
  },
  {
    daySo: 'Arbaco',
    dayEn: 'Wednesday',
    breakfast: 'Malawax & Malab / Shaah',
    lunch: 'Kalluun Shiilan, Bariis Cad & Saladh',
    dinner: 'Canjeero & Digir / Caano Geel',
  },
  {
    daySo: 'Khamiis',
    dayEn: 'Thursday',
    breakfast: 'Canjeero & Odkac (Muqmad)',
    lunch: 'Baasto & Digaag Duban (Chicken)',
    dinner: 'Fuul Masri ah, Qudaar & Khubus',
  },
  {
    daySo: 'Jimce',
    dayEn: 'Friday',
    breakfast: 'Canjeero, beer & Shaah Shaash',
    lunch: 'Bariis Xafladeed, Hilib Geel & Xalwo',
    dinner: 'Muufo & Shigni / Qudaar Fudud',
  },
  {
    daySo: 'Sabti',
    dayEn: 'Saturday',
    breakfast: 'Rooti, Farmaajo & Shaah',
    lunch: 'Baasto Maraq leh & Hilib',
    dinner: 'Canjeero & Caano / Suqaar Digaag',
  },
  {
    daySo: 'Axad',
    dayEn: 'Sunday',
    breakfast: 'Sabaayad & Suqaar / Shaah',
    lunch: 'Bariis, Kalluun Tuunno & Saladh Cagaaran',
    dinner: 'Digir la kariyay & Saliid Macsar',
  },
];

export const MealPlanner: React.FC<Props> = ({ language }) => {
  const isSo = language === 'so';

  const [meals, setMeals] = useState<DayMeal[]>(DEFAULT_WEEK);
  const [activeTab, setActiveTab] = useState<'menu' | 'grocery'>('menu');
  const [copied, setCopied] = useState(false);

  // Grocery checklist
  const [groceryItems, setGroceryItems] = useState([
    { name: isSo ? 'Bariis Basmati' : 'Basmati Rice', checked: false },
    { name: isSo ? 'Baasto (Spaghetti)' : 'Pasta / Spaghetti', checked: false },
    { name: isSo ? 'Hilib (Ari / Lo\' / Digaag)' : 'Meat (Goat / Beef / Chicken)', checked: false },
    { name: isSo ? 'Kalluun (Fresh Fish)' : 'Fish', checked: false },
    { name: isSo ? 'Daaqiiq & Galley (Canjeero/Muufo)' : 'Flour & Cornmeal', checked: false },
    { name: isSo ? 'Basal, Yaanyo & Toon' : 'Onions, Tomatoes & Garlic', checked: false },
    { name: isSo ? 'Moos & Khudaar Cagaaran' : 'Bananas & Salad Greens', checked: false },
    { name: isSo ? 'Shaah, Sanjabiil & Qorfe' : 'Tea Leaves, Ginger & Cardamom', checked: false },
    { name: isSo ? 'Caano & Saliid Cunto' : 'Milk & Cooking Oil', checked: false },
  ]);

  const [newGroceryItem, setNewGroceryItem] = useState('');

  const updateMeal = (idx: number, field: 'breakfast' | 'lunch' | 'dinner', val: string) => {
    setMeals((prev) =>
      prev.map((m, i) => (i === idx ? { ...m, [field]: val } : m))
    );
  };

  const toggleGrocery = (index: number) => {
    setGroceryItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, checked: !item.checked } : item))
    );
  };

  const addGrocery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroceryItem.trim()) return;
    setGroceryItems((prev) => [...prev, { name: newGroceryItem.trim(), checked: false }]);
    setNewGroceryItem('');
  };

  const removeGrocery = (index: number) => {
    setGroceryItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCopyMenu = () => {
    const text = meals
      .map(
        (m) =>
          `[${isSo ? m.daySo : m.dayEn}]\n- ${isSo ? 'Quraac' : 'Breakfast'}: ${m.breakfast}\n- ${isSo ? 'Qado' : 'Lunch'}: ${m.lunch}\n- ${isSo ? 'Casho' : 'Dinner'}: ${m.dinner}`
      )
      .join('\n\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5">
      {/* Tab Switcher */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg">
          <button
            onClick={() => setActiveTab('menu')}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors flex items-center gap-1.5 ${
              activeTab === 'menu' ? 'bg-white text-[#0A2342] shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>{isSo ? 'Jadwalka Cuntada (7 Maalmood)' : 'Weekly Menu (7 Days)'}</span>
          </button>

          <button
            onClick={() => setActiveTab('grocery')}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors flex items-center gap-1.5 ${
              activeTab === 'grocery' ? 'bg-white text-[#0A2342] shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>{isSo ? 'Liiska Suuqa & Raashinka' : 'Grocery Shopping List'}</span>
          </button>
        </div>

        {activeTab === 'menu' && (
          <button
            onClick={handleCopyMenu}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
            {copied ? (isSo ? 'La guriyay!' : 'Copied!') : (isSo ? 'Guri Jadwalka' : 'Copy Menu')}
          </button>
        )}
      </div>

      {activeTab === 'menu' ? (
        <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
          {meals.map((meal, idx) => (
            <div
              key={meal.daySo}
              className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors"
            >
              <span className="font-bold text-xs uppercase tracking-wider text-[#1E88E5] block mb-2">
                {isSo ? meal.daySo : meal.dayEn}
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="text-[11px] text-slate-500 block mb-0.5">{isSo ? 'Quraac' : 'Breakfast'}:</span>
                  <input
                    type="text"
                    value={meal.breakfast}
                    onChange={(e) => updateMeal(idx, 'breakfast', e.target.value)}
                    className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs text-slate-800"
                  />
                </div>

                <div>
                  <span className="text-[11px] text-slate-500 block mb-0.5">{isSo ? 'Qado' : 'Lunch'}:</span>
                  <input
                    type="text"
                    value={meal.lunch}
                    onChange={(e) => updateMeal(idx, 'lunch', e.target.value)}
                    className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs text-slate-800"
                  />
                </div>

                <div>
                  <span className="text-[11px] text-slate-500 block mb-0.5">{isSo ? 'Casho' : 'Dinner'}:</span>
                  <input
                    type="text"
                    value={meal.dinner}
                    onChange={(e) => updateMeal(idx, 'dinner', e.target.value)}
                    className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs text-slate-800"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Add grocery item */}
          <form onSubmit={addGrocery} className="flex gap-2">
            <input
              type="text"
              value={newGroceryItem}
              onChange={(e) => setNewGroceryItem(e.target.value)}
              placeholder={isSo ? 'Kudar alaab suuqa laga doonayo (tusaale: Sanjabiil, Liin)...' : 'Add custom grocery item...'}
              className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:border-[#1E88E5]"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-[#1E88E5] hover:bg-[#1976D2] rounded-md transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              {isSo ? 'Kudar' : 'Add'}
            </button>
          </form>

          {/* Grocery items checklist */}
          <div className="space-y-1.5 max-h-80 overflow-y-auto">
            {groceryItems.map((item, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between p-2.5 rounded border transition-colors ${
                  item.checked ? 'bg-slate-50 border-slate-200 text-slate-400' : 'bg-white border-slate-200 text-slate-800'
                }`}
              >
                <label className="flex items-center gap-2.5 flex-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => toggleGrocery(idx)}
                    className="accent-[#1E88E5]"
                  />
                  <span className={`text-xs ${item.checked ? 'line-through text-slate-400' : 'font-medium'}`}>
                    {item.name}
                  </span>
                </label>

                <button
                  onClick={() => removeGrocery(idx)}
                  className="p-1 text-slate-400 hover:text-rose-600"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
