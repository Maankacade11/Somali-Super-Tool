import React, { useState, useEffect } from 'react';
import { Language } from '../../types';
import { Compass, Clock, Copy, Check, MapPin, Sun, Moon } from 'lucide-react';

interface Props {
  language: Language;
}

interface CityInfo {
  id: string;
  nameSo: string;
  nameEn: string;
  lat: number;
  lng: number;
  tz: number; // UTC offset in hours
  qiblaDeg: number;
}

const SOMALI_CITIES: CityInfo[] = [
  { id: 'mgq', nameSo: 'Muqdisho (Mogadishu)', nameEn: 'Mogadishu', lat: 2.0469, lng: 45.3182, tz: 3, qiblaDeg: 341 },
  { id: 'hga', nameSo: 'Hargeysa (Hargeisa)', nameEn: 'Hargeisa', lat: 9.5624, lng: 44.0770, tz: 3, qiblaDeg: 337 },
  { id: 'gro', nameSo: 'Garoowe (Garowe)', nameEn: 'Garowe', lat: 8.4021, lng: 48.4845, tz: 3, qiblaDeg: 326 },
  { id: 'bsa', nameSo: 'Boosaaso (Bosaso)', nameEn: 'Bosaso', lat: 11.2842, lng: 49.1816, tz: 3, qiblaDeg: 317 },
  { id: 'kma', nameSo: 'Kismaayo (Kismayo)', nameEn: 'Kismayo', lat: -0.3582, lng: 42.5454, tz: 3, qiblaDeg: 350 },
  { id: 'byd', nameSo: 'Baydhabo (Baidoa)', nameEn: 'Baidoa', lat: 3.1138, lng: 43.6498, tz: 3, qiblaDeg: 346 },
  { id: 'bco', nameSo: 'Burco (Burao)', nameEn: 'Burao', lat: 9.5221, lng: 45.5336, tz: 3, qiblaDeg: 332 },
  { id: 'jbt', nameSo: 'Jabuuti (Djibouti City)', nameEn: 'Djibouti', lat: 11.5721, lng: 43.1456, tz: 3, qiblaDeg: 340 },
  { id: 'jgj', nameSo: 'Jigjiga (Jijiga)', nameEn: 'Jijiga', lat: 9.3500, lng: 42.8000, tz: 3, qiblaDeg: 341 },
  { id: 'nbo', nameSo: 'Nairobi (Eastleigh)', nameEn: 'Nairobi', lat: -1.2921, lng: 36.8219, tz: 3, qiblaDeg: 6 },
  { id: 'dxb', nameSo: 'Dubai (UAE)', nameEn: 'Dubai', lat: 25.2048, lng: 55.2708, tz: 4, qiblaDeg: 258 },
  { id: 'lon', nameSo: 'London (UK)', nameEn: 'London', lat: 51.5074, lng: -0.1278, tz: 0, qiblaDeg: 119 },
  { id: 'msp', nameSo: 'Minneapolis (USA)', nameEn: 'Minneapolis', lat: 44.9778, lng: -93.2650, tz: -6, qiblaDeg: 46 },
];

// Offline solar prayer time algorithm
function computePrayerTimes(lat: number, lng: number, tz: number, date: Date) {
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
  );

  // Solar declination & equation of time
  const B = (360 / 365) * (dayOfYear - 81) * (Math.PI / 180);
  const eot = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);
  const declination = 23.45 * Math.sin(((360 / 365) * (dayOfYear - 81) * Math.PI) / 180);

  // Solar noon
  const noon = 12 + tz - lng / 15 - eot / 60;

  const latRad = (lat * Math.PI) / 180;
  const decRad = (declination * Math.PI) / 180;

  const getHourAngle = (angle: number) => {
    const angleRad = (angle * Math.PI) / 180;
    const cosHA =
      (Math.sin(angleRad) - Math.sin(latRad) * Math.sin(decRad)) /
      (Math.cos(latRad) * Math.cos(decRad));
    if (cosHA > 1 || cosHA < -1) return 0;
    return (Math.acos(cosHA) * 180) / Math.PI / 15;
  };

  const fajrHA = getHourAngle(-18);
  const sunriseHA = getHourAngle(-0.833);
  const ishaHA = getHourAngle(-17.5);

  // Asr (Shafi'i: shadow = length + noon shadow)
  const asrAlt =
    (Math.atan(1 + Math.tan(Math.abs(latRad - decRad))) * 180) / Math.PI;
  const asrHA = getHourAngle(90 - asrAlt);

  const formatHours = (h: number) => {
    while (h < 0) h += 24;
    while (h >= 24) h -= 24;
    const hours = Math.floor(h);
    const mins = Math.floor((h - hours) * 60);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHour = hours % 12 || 12;
    return `${displayHour}:${mins.toString().padStart(2, '0')} ${period}`;
  };

  return {
    fajr: formatHours(noon - fajrHA),
    sunrise: formatHours(noon - sunriseHA),
    dhuhr: formatHours(noon + 0.03), // +2 mins for solar zenith clearance
    asr: formatHours(noon + asrHA),
    maghrib: formatHours(noon + sunriseHA + 0.05), // sunset + 3 mins
    isha: formatHours(noon + ishaHA),
  };
}

export const PrayerTimes: React.FC<Props> = ({ language }) => {
  const isSo = language === 'so';

  const [selectedCityId, setSelectedCityId] = useState<string>('mgq');
  const [copied, setCopied] = useState(false);
  const today = new Date();

  const city = SOMALI_CITIES.find((c) => c.id === selectedCityId) || SOMALI_CITIES[0];
  const prayers = computePrayerTimes(city.lat, city.lng, city.tz, today);

  const prayerList = [
    { id: 'fajr', nameSo: 'Subax (Fajr)', nameEn: 'Fajr', time: prayers.fajr, icon: Moon },
    { id: 'sunrise', nameSo: 'Qorrax-soo-bax (Sunrise)', nameEn: 'Sunrise', time: prayers.sunrise, icon: Sun },
    { id: 'dhuhr', nameSo: 'Duhur (Dhuhr)', nameEn: 'Dhuhr', time: prayers.dhuhr, icon: Sun },
    { id: 'asr', nameSo: 'Casar (Asr)', nameEn: 'Asr', time: prayers.asr, icon: Sun },
    { id: 'maghrib', nameSo: 'Maqrib (Maghrib)', nameEn: 'Maghrib', time: prayers.maghrib, icon: Sun },
    { id: 'isha', nameSo: 'Cisha (Isha)', nameEn: 'Isha', time: prayers.isha, icon: Moon },
  ];

  const handleCopy = () => {
    const summary = `${isSo ? 'Jadwalka Salaadda' : 'Prayer Times'} - ${isSo ? city.nameSo : city.nameEn}: Subax: ${prayers.fajr} | Duhur: ${prayers.dhuhr} | Casar: ${prayers.asr} | Maqrib: ${prayers.maghrib} | Cisha: ${prayers.isha}`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* City selector & Date info */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
        <div className="flex items-center gap-2 flex-1">
          <MapPin className="w-4 h-4 text-[#1E88E5] shrink-0" />
          <select
            value={selectedCityId}
            onChange={(e) => setSelectedCityId(e.target.value)}
            className="w-full sm:w-64 px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded font-semibold text-slate-800 focus:outline-none focus:border-[#1E88E5]"
          >
            {SOMALI_CITIES.map((c) => (
              <option key={c.id} value={c.id}>
                {isSo ? c.nameSo : c.nameEn}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-slate-500">
          <span className="font-mono">
            {today.toLocaleDateString(isSo ? 'so-SO' : 'en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            })}
          </span>

          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-100 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? (isSo ? 'La guriyay!' : 'Copied!') : (isSo ? 'Guri' : 'Copy')}
          </button>
        </div>
      </div>

      {/* Prayers Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {prayerList.map((p) => {
          const Icon = p.icon;
          const isSunrise = p.id === 'sunrise';
          return (
            <div
              key={p.id}
              className={`p-3 rounded-lg border text-center transition-colors ${
                isSunrise
                  ? 'bg-slate-50 border-slate-200 text-slate-500'
                  : 'bg-white border-slate-200 hover:border-[#1E88E5]'
              }`}
            >
              <span className="text-[11px] font-medium block mb-1 truncate text-slate-600">
                {isSo ? p.nameSo : p.nameEn}
              </span>
              <div className="text-base sm:text-lg font-bold font-mono text-[#0A2342] tabular-nums">
                {p.time}
              </div>
            </div>
          );
        })}
      </div>

      {/* Qibla Direction Information Box */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-full bg-white border border-slate-300 flex items-center justify-center text-[#1E88E5] shrink-0">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              {isSo ? 'Jiheeyaha Qiblada (Qibla Direction)' : 'Qibla Bearing'}
            </span>
            <p className="text-xs text-slate-600 mt-0.5">
              {isSo
                ? `Magaalada ${city.nameSo.split(' ')[0]} xaggeeda qiblada Kacbada sharafta leh waa ${city.qiblaDeg}° (Woqooyi-Galbeed).`
                : `From ${city.nameEn}, the Qibla angle towards Makkah is ${city.qiblaDeg}° relative to True North.`}
            </p>
          </div>
        </div>

        <div className="text-center sm:text-right shrink-0">
          <span className="text-2xl font-bold font-mono text-[#0A2342] tabular-nums">
            {city.qiblaDeg}°
          </span>
          <span className="text-xs text-slate-400 block font-mono">
            {isSo ? 'Kacbada Barakaysan' : 'Kaaba Direction'}
          </span>
        </div>
      </div>
    </div>
  );
};
