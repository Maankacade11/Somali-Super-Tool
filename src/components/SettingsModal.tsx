import React, { useState } from 'react';
import { Language, AppSettings } from '../types';
import { X, Trash2, Check, RefreshCw } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  favoritesCount: number;
}

export const SettingsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  favoritesCount,
}) => {
  if (!isOpen) return null;

  const isSo = settings.language === 'so';
  const [clearedNotice, setClearedNotice] = useState(false);

  const handleClearData = () => {
    if (
      window.confirm(
        isSo
          ? 'Ma hubtaa inaad tirtirto dhammaan xogta maxalliga ah (hawlaha, qoraallada iyo kuwa aad doiratay)?'
          : 'Are you sure you want to clear all locally stored tasks, notes, and favorites?'
      )
    ) {
      localStorage.removeItem('somali_toolkit_tasks');
      localStorage.removeItem('somali_quick_notepad');
      localStorage.removeItem('somali_toolkit_favs');
      setClearedNotice(true);
      setTimeout(() => {
        setClearedNotice(false);
        window.location.reload();
      }, 800);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden text-slate-800">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <h3 className="text-base font-bold text-[#0A2342]">
            {isSo ? 'Hagaajinta Qalabka' : 'Toolkit Settings'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5 text-xs">
          {/* Language preference */}
          <div>
            <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              {isSo ? 'Luuqadda Madasha' : 'Platform Language'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onUpdateSettings({ language: 'so' })}
                className={`py-2 px-3 rounded border text-left transition-colors font-medium ${
                  settings.language === 'so'
                    ? 'border-[#1E88E5] bg-[#E3F2FD] text-[#0A2342]'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                Soomaali (Somali)
              </button>
              <button
                type="button"
                onClick={() => onUpdateSettings({ language: 'en' })}
                className={`py-2 px-3 rounded border text-left transition-colors font-medium ${
                  settings.language === 'en'
                    ? 'border-[#1E88E5] bg-[#E3F2FD] text-[#0A2342]'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                English
              </button>
            </div>
          </div>

          {/* Default Currency */}
          <div>
            <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              {isSo ? 'Lacagta Asalka ah (Default Currency)' : 'Default Currency'}
            </label>
            <select
              value={settings.defaultCurrency}
              onChange={(e) => onUpdateSettings({ defaultCurrency: e.target.value as any })}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:border-[#1E88E5]"
            >
              <option value="USD">USD ($) — US Dollar</option>
              <option value="SOS">SOS (Sh.So) — Somali Shilling</option>
              <option value="EUR">EUR (€) — Euro</option>
              <option value="KES">KES (KSh) — Kenyan Shilling</option>
              <option value="AED">AED — UAE Dirham</option>
            </select>
          </div>

          {/* Local Storage details */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
            <span className="font-semibold text-slate-700 block mb-1">
              {isSo ? 'Xogta Maxalliga ah ee Browserka' : 'Local Browser Cache'}
            </span>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              {isSo
                ? `Waxaad haysataa ${favoritesCount} qalab oo aad doiratay, iyo hawlo maalinle ah oo ku kaydsan browserkan.`
                : `You currently have ${favoritesCount} favorited tools and local tasks cached locally.`}
            </p>

            <button
              onClick={handleClearData}
              className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-white border border-rose-200 hover:bg-rose-50 rounded transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              {isSo ? 'Tir Dhammaan Xogta Maxalliga ah' : 'Clear All Local Data'}
            </button>

            {clearedNotice && (
              <span className="text-emerald-700 text-[11px] block mt-2 font-medium">
                {isSo ? 'Xogtii waa la tirtiray! Bogga ayaa dib u furmaya...' : 'Local data cleared! Refreshing...'}
              </span>
            )}
          </div>
        </div>

        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-white bg-[#1E88E5] hover:bg-[#1976D2] rounded transition-colors"
          >
            {isSo ? 'Xir' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
};
