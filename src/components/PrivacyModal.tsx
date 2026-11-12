import React from 'react';
import { Language } from '../types';
import { X, ShieldCheck } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const PrivacyModal: React.FC<Props> = ({ isOpen, onClose, language }) => {
  if (!isOpen) return null;
  const isSo = language === 'so';

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-lg bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden text-slate-800">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#1E88E5]" />
            <h3 className="text-base font-bold text-[#0A2342]">
              {isSo ? 'Qaanuunka Qarsoodiga & Xogta' : 'Privacy & Data Policy'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs text-slate-600 leading-relaxed max-h-[70vh] overflow-y-auto">
          <div>
            <h4 className="font-bold text-slate-900 text-sm mb-1">
              {isSo ? '1. Ma Jiro Dabagal ama Telemetry' : '1. Zero Tracking & Telemetry'}
            </h4>
            <p>
              {isSo
                ? 'Somali Super Toolkit ma isticmaalo cookies dabagal ah, analytics qarsoon, ama xayeysiisyo. Ma jirto xog lagaaga qaadayo qalabkaaga.'
                : 'Somali Super Toolkit does not use tracking cookies, surveillance telemetry, or advertisement networks. Your activity is entirely unmonitored.'}
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 text-sm mb-1">
              {isSo ? '2. Xisaabinta Maxalliga ah (Client-Side)' : '2. 100% Client-Side Execution'}
            </h4>
            <p>
              {isSo
                ? 'Dhammaan xisaabaadkaaga maaliyadda, qaansheegyada, furayaasha sirta ah, GPA-da iyo qoraalladaadu waxay ku dhex shaqeeyaan biraawsarkaaga kaliya. Wax xog ah looma gudbiyo server dibadeed.'
                : 'All calculations, invoices, passwords, GPA computations, and scratchpad notes run strictly within your local browser JavaScript engine.'}
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 text-sm mb-1">
              {isSo ? '3. Kaydinta Biraawsarka (localStorage)' : '3. Local Browser Storage'}
            </h4>
            <p>
              {isSo
                ? 'Kaliya hawlaha aad qorto iyo doorashada luuqadda ayaa lagu kaydiyaa localStorage-ka qalabkaaga si aadan u lumin marka aad bogga dib u furto. Waad tirtiri kartaa xogtan markasta adoo maraya qeybta Settings.'
                : 'We only use localStorage to persist your daily tasks, scratchpad notes, and chosen language so they remain available when you return. You can erase them at any time via Settings.'}
            </p>
          </div>
        </div>

        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-white bg-[#1E88E5] hover:bg-[#1976D2] rounded transition-colors"
          >
            {isSo ? 'Waan Fahmay' : 'Understood'}
          </button>
        </div>
      </div>
    </div>
  );
};
