import React, { useState } from 'react';
import { Language } from '../../types';
import { Fuel, Copy, Check, RotateCcw, MapPin, Users } from 'lucide-react';

interface Props {
  language: Language;
}

interface RoutePreset {
  nameSo: string;
  nameEn: string;
  distKm: number;
}

const SOMALI_ROUTES: RoutePreset[] = [
  { nameSo: 'Muqdisho — Baydhabo', nameEn: 'Mogadishu — Baidoa', distKm: 245 },
  { nameSo: 'Hargeysa — Berbera', nameEn: 'Hargeisa — Berbera', distKm: 160 },
  { nameSo: 'Garoowe — Boosaaso', nameEn: 'Garowe — Bosaso', distKm: 460 },
  { nameSo: 'Muqdisho — Kismaayo', nameEn: 'Mogadishu — Kismayo', distKm: 500 },
  { nameSo: 'Hargeysa — Burco', nameEn: 'Hargeisa — Burao', distKm: 180 },
  { nameSo: 'Nairobi — Gaarisa (Garissa)', nameEn: 'Nairobi — Garissa', distKm: 370 },
  { nameSo: 'Garoowe — Gaalkacyo', nameEn: 'Garowe — Galkayo', distKm: 235 },
  { nameSo: 'Jabuuti — Cali Sabiix', nameEn: 'Djibouti — Ali Sabieh', distKm: 95 },
];

export const FuelCalculator: React.FC<Props> = ({ language }) => {
  const isSo = language === 'so';

  const [distanceKm, setDistanceKm] = useState<string>('245');
  const [efficiencyKmPerL, setEfficiencyKmPerL] = useState<string>('10'); // 10 km per liter average
  const [pricePerLiter, setPricePerLiter] = useState<string>('1.10'); // ~$1.10 per liter
  const [passengers, setPassengers] = useState<number>(1);
  const [copied, setCopied] = useState(false);

  const dist = parseFloat(distanceKm) || 0;
  const eff = parseFloat(efficiencyKmPerL) || 1;
  const price = parseFloat(pricePerLiter) || 0;
  const pax = Math.max(1, passengers);

  const fuelLiters = dist > 0 && eff > 0 ? dist / eff : 0;
  const totalCost = fuelLiters * price;
  const perPersonCost = totalCost / pax;

  const handleCopy = () => {
    const text = isSo
      ? `Fogaanta: ${dist} km | Shidaalka loo baahan yahay: ${fuelLiters.toFixed(1)} litir | Kharashka Guud: $${totalCost.toFixed(2)} ($${perPersonCost.toFixed(2)}/qofkiiba)`
      : `Distance: ${dist} km | Fuel needed: ${fuelLiters.toFixed(1)} L | Total Cost: $${totalCost.toFixed(2)} ($${perPersonCost.toFixed(2)}/person)`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Popular Route Presets */}
      <div>
        <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-2">
          {isSo ? 'Waddooyinka Caanka ah ee Soomaaliya & Gobolka:' : 'Popular Regional Highway Routes:'}
        </span>
        <div className="flex flex-wrap items-center gap-1.5">
          {SOMALI_ROUTES.map((route) => (
            <button
              key={route.nameSo}
              onClick={() => setDistanceKm(String(route.distKm))}
              className="px-2.5 py-1 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-800 rounded transition-colors"
            >
              {isSo ? route.nameSo : route.nameEn} ({route.distKm} km)
            </button>
          ))}
        </div>
      </div>

      {/* Input Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            {isSo ? 'Fogaanta Safarka (Kilomitir)' : 'Distance (km)'}
          </label>
          <input
            type="number"
            value={distanceKm}
            onChange={(e) => setDistanceKm(e.target.value)}
            className="w-full px-2.5 py-1.5 text-sm bg-white border border-slate-300 rounded font-mono tabular-nums"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            {isSo ? 'Isticmaalka Gaariga (km/litir)' : 'Fuel Economy (km/liter)'}
          </label>
          <input
            type="number"
            step="0.5"
            value={efficiencyKmPerL}
            onChange={(e) => setEfficiencyKmPerL(e.target.value)}
            className="w-full px-2.5 py-1.5 text-sm bg-white border border-slate-300 rounded font-mono tabular-nums"
          />
          <span className="text-[10px] text-slate-400 block mt-0.5">
            {isSo ? 'Gaariga caadiga ah ~10-12 km/L' : 'Average car ~10-12 km/L'}
          </span>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            {isSo ? 'Qiimaha Litirka ($)' : 'Fuel Price per Liter ($)'}
          </label>
          <input
            type="number"
            step="0.05"
            value={pricePerLiter}
            onChange={(e) => setPricePerLiter(e.target.value)}
            className="w-full px-2.5 py-1.5 text-sm bg-white border border-slate-300 rounded font-mono tabular-nums"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            {isSo ? 'Dadka Wada Saaran' : 'Passengers Sharing'}
          </label>
          <input
            type="number"
            min="1"
            value={passengers}
            onChange={(e) => setPassengers(parseInt(e.target.value) || 1)}
            className="w-full px-2.5 py-1.5 text-sm bg-white border border-slate-300 rounded font-mono tabular-nums"
          />
        </div>
      </div>

      {/* Result Card */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-4 border-b border-slate-200 text-center">
          <div>
            <span className="text-xs text-slate-500 block">{isSo ? 'Shidaalka Loo Baahan Yahay' : 'Total Fuel Needed'}</span>
            <span className="text-2xl sm:text-3xl font-bold font-mono text-[#0A2342] tabular-nums">
              {fuelLiters.toFixed(1)} <span className="text-sm font-sans font-normal text-slate-500">{isSo ? 'Litir' : 'Liters'}</span>
            </span>
          </div>

          <div>
            <span className="text-xs text-slate-500 block">{isSo ? 'Kharashka Shidaalka Guud' : 'Total Fuel Cost'}</span>
            <span className="text-2xl sm:text-3xl font-bold font-mono text-emerald-700 tabular-nums">
              ${totalCost.toFixed(2)}
            </span>
          </div>

          <div>
            <span className="text-xs text-slate-500 block">{isSo ? 'Qofkiiba Kharashka Ku Soo Aadaya' : 'Per Passenger Share'}</span>
            <span className="text-2xl sm:text-3xl font-bold font-mono text-[#1E88E5] tabular-nums">
              ${perPersonCost.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#1E88E5] hover:bg-[#1976D2] rounded transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? (isSo ? 'La guriyay!' : 'Copied!') : (isSo ? 'Guri Xisaabta Shidaalka' : 'Copy Trip Summary')}
          </button>

          <span className="text-slate-400 font-mono text-[11px]">
            {dist} km @ {eff} km/L
          </span>
        </div>
      </div>
    </div>
  );
};
