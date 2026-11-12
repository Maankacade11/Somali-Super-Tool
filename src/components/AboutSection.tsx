import React from 'react';
import { Language } from '../types';
import { ShieldCheck, Zap, HeartHandshake, EyeOff } from 'lucide-react';

interface Props {
  language: Language;
}

export const AboutSection: React.FC<Props> = ({ language }) => {
  const isSo = language === 'so';

  const principles = [
    {
      icon: HeartHandshake,
      titleSo: '100% Bilaash ah Waligeed',
      titleEn: '100% Free Forever',
      descSo: 'Ma jiro lacag-bixin qarsoon, xayeysiis dhib badan, ama isdiiwaangelin qasab ah.',
      descEn: 'No subscription tiers, intrusive advertisements, or mandatory registrations.',
    },
    {
      icon: EyeOff,
      titleSo: 'Dhammaan Xogtu Waa Maxalli (Local)',
      titleEn: 'Zero-Knowledge Privacy',
      descSo: 'Xisaabaadkaaga iyo qoraalladaadu kuma socdaan server dibadeed; waxay ku jiraan kaliya qalabkaaga.',
      descEn: 'All calculations, notes, and records stay in your local browser storage.',
    },
    {
      icon: Zap,
      titleSo: 'Fudud & Degdeg ah',
      titleEn: 'Fast & Lightweight',
      descSo: 'Looma baahna internet xawaare sare leh. Xitaa wuxuu ku shaqeynayaa offline marka hal mar la furo.',
      descEn: 'Instant load times with zero bloat. Works completely offline once loaded.',
    },
  ];

  return (
    <section id="about" className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
            {isSo ? 'Ujeeddada Mashruuca' : 'About Somali Super Toolkit'}
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A2342] tracking-tight">
            {isSo
              ? 'Waa maxay Somali Super Toolkit, maxaase looga dhigay bilaash?'
              : 'What is Somali Super Toolkit, and why is it free?'}
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed">
            {isSo
              ? 'Somali Super Toolkit waa xirmo qalab wax-ku-ool ah oo loogu talagalay ganacsatada, ardayda, howl-wadeennada iyo qoysaska Soomaaliyeed ee ku nool dalka iyo qurbaha. Waxaa loo dhisay in hal meel laga helo qalabkii loo baahnaa maalin kasta iyada oo aan loo baahnayn barnaamijyo badan oo kala duwan.'
              : 'Somali Super Toolkit is a dedicated utility suite built for Somali entrepreneurs, students, professionals, and families worldwide. It brings together daily computational, text, financial, and organizational tools under one unified, distraction-free interface.'}
          </p>
          <p className="mt-3 text-sm text-slate-600 leading-relaxed">
            {isSo
              ? 'Waxaan aaminsanahay in qalabka fududeynaya nolol-maalmeedka bulshada uu noqdo mid qof kasta u furan oo aan lahayn carqalad dhanka kharashka ah. Sidaas darteed, madashani waa mid bilaash ah, ammaan ah, oo xushmaynaysa xogtaada gaarka ah.'
              : 'We believe foundational utility software should be accessible to everyone without cost barriers or telemetry tracking. That is why this toolkit is completely free, runs offline, and stores data solely on your device.'}
          </p>
        </div>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10">
          {principles.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div key={idx} className="p-5 bg-white border border-slate-200 rounded-lg">
                <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-[#1E88E5] mb-3">
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-[#0A2342]">
                  {isSo ? p.titleSo : p.titleEn}
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {isSo ? p.descSo : p.descEn}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
