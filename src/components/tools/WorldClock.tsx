import React, { useState, useEffect } from 'react';
import { Language } from '../../types';
import { Clock, Globe2, Sun, Moon, ArrowRight } from 'lucide-react';

interface Props {
  language: Language;
}

interface CityClock {
  id: string;
  nameSo: string;
  nameEn: string;
  countrySo: string;
  countryEn: string;
  timeZone: string;
  tag: string;
}

const CITIES: CityClock[] = [
  { id: 'mgq', nameSo: 'Muqdisho & Hargeysa', nameEn: 'Mogadishu & Hargeisa', countrySo: 'Soomaaliya', countryEn: 'Somalia (EAT, UTC+3)', timeZone: 'Africa/Mogadishu', tag: 'Dalka / Homeland' },
  { id: 'nbo', nameSo: 'Nairobi', nameEn: 'Nairobi', countrySo: 'Kiinya', countryEn: 'Kenya (EAT, UTC+3)', timeZone: 'Africa/Nairobi', tag: 'Bariga Afrika' },
  { id: 'lon', nameSo: 'London', nameEn: 'London', countrySo: 'Boqortooyada Midowday', countryEn: 'United Kingdom (GMT)', timeZone: 'Europe/London', tag: 'Qurba-joog UK' },
  { id: 'msp', nameSo: 'Minneapolis & St. Paul', nameEn: 'Minneapolis / St. Paul', countrySo: 'Maraykanka (CST)', countryEn: 'USA (Central Time)', timeZone: 'America/Chicago', tag: 'Qurba-joog USA' },
  { id: 'cmh', nameSo: 'Columbus & Ohio', nameEn: 'Columbus / New York', countrySo: 'Maraykanka (EST)', countryEn: 'USA (Eastern Time)', timeZone: 'America/New_York', tag: 'Qurba-joog USA' },
  { id: 'dxb', nameSo: 'Dubai', nameEn: 'Dubai', countrySo: 'Imaaraadka Carabta', countryEn: 'UAE (GST, UTC+4)', timeZone: 'Asia/Dubai', tag: 'Khaliijka' },
  { id: 'sto', nameSo: 'Stockholm & Oslo', nameEn: 'Stockholm & Oslo', countrySo: 'Iswiidhan / Noorway', countryEn: 'Sweden / Norway (CET)', timeZone: 'Europe/Stockholm', tag: 'Iskandaneefiya' },
];

export const WorldClock: React.FC<Props> = ({ language }) => {
  const isSo = language === 'so';

  const [currentTime, setCurrentTime] = useState(new Date());
  const [plannerHour, setPlannerHour] = useState<number>(14); // 2:00 PM Mogadishu default

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getCityTime = (timeZone: string, date: Date = currentTime) => {
    try {
      const formatter = new Intl.DateTimeFormat('en-GB', {
        timeZone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });
      return formatter.format(date);
    } catch (e) {
      return '--:--';
    }
  };

  const getCityHour = (timeZone: string, baseDate: Date) => {
    try {
      const formatter = new Intl.DateTimeFormat('en-GB', {
        timeZone,
        hour: 'numeric',
        hour12: false,
      });
      return parseInt(formatter.format(baseDate), 10) || 0;
    } catch (e) {
      return 12;
    }
  };

  // Planned time conversion from Mogadishu base
  const plannedDate = new Date();
  plannedDate.setHours(plannerHour, 0, 0, 0);

  return (
    <div className="space-y-6">
      {/* City Clocks Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {CITIES.map((city) => {
          const timeStr = getCityTime(city.timeZone);
          const hour = getCityHour(city.timeZone, currentTime);
          const isDay = hour >= 6 && hour < 18;

          return (
            <div
              key={city.id}
              className={`p-4 rounded-lg border transition-all ${
                city.id === 'mgq'
                  ? 'bg-blue-50/50 border-[#1E88E5]/40 shadow-xs'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span className="font-medium text-slate-700">{isSo ? city.countrySo : city.countryEn}</span>
                <span className="flex items-center gap-1 text-[11px]">
                  {isDay ? (
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                  ) : (
                    <Moon className="w-3.5 h-3.5 text-indigo-400" />
                  )}
                  <span>{isDay ? (isSo ? 'Maalin' : 'Day') : (isSo ? 'Habeen' : 'Night')}</span>
                </span>
              </div>

              <h4 className="text-sm font-bold text-[#0A2342] truncate">
                {isSo ? city.nameSo : city.nameEn}
              </h4>

              <div className="mt-2 text-2xl font-mono font-bold text-slate-900 tracking-tight tabular-nums">
                {timeStr}
              </div>

              <div className="mt-2 pt-2 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400 font-mono">
                <span>{city.tag}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Time Converter / Call Planner */}
      <div className="p-5 bg-slate-50 border border-slate-200 rounded-lg space-y-4">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            {isSo ? 'Qorsheeyaha Waqtiga Wicitaanka / Kulamada' : 'Family Call & Meeting Time Planner'}
          </span>
          <p className="text-xs text-slate-600">
            {isSo
              ? 'Haddii ay Muqdisho/Hargeysa tahay saacadda hoose, meelaha kale intey u noqonaysaa?'
              : 'Select an hour in Mogadishu to see the matching local time in diaspora cities:'}
          </p>
        </div>

        <div>
          <div className="flex justify-between items-center text-xs font-mono mb-1">
            <span className="font-semibold text-[#0A2342]">
              {isSo ? 'Saacadda Muqdisho / Hargeysa:' : 'Mogadishu Time:'} {plannerHour % 12 || 12}:00 {plannerHour >= 12 ? 'PM' : 'AM'}
            </span>
            <span className="text-slate-500">{plannerHour}:00 (24h)</span>
          </div>

          <input
            type="range"
            min="0"
            max="23"
            step="1"
            value={plannerHour}
            onChange={(e) => setPlannerHour(parseInt(e.target.value))}
            className="w-full accent-[#1E88E5] cursor-pointer"
          />
        </div>

        {/* Calculated times strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
          <div className="p-2.5 bg-white border border-slate-200 rounded">
            <span className="text-[11px] text-slate-500 block">London (UK)</span>
            <span className="font-mono font-bold text-slate-900 text-sm">
              {getCityTime('Europe/London', plannedDate).replace(/:\d\d\s/, ' ')}
            </span>
          </div>

          <div className="p-2.5 bg-white border border-slate-200 rounded">
            <span className="text-[11px] text-slate-500 block">Minneapolis (USA)</span>
            <span className="font-mono font-bold text-slate-900 text-sm">
              {getCityTime('America/Chicago', plannedDate).replace(/:\d\d\s/, ' ')}
            </span>
          </div>

          <div className="p-2.5 bg-white border border-slate-200 rounded">
            <span className="text-[11px] text-slate-500 block">Columbus / NY (USA)</span>
            <span className="font-mono font-bold text-slate-900 text-sm">
              {getCityTime('America/New_York', plannedDate).replace(/:\d\d\s/, ' ')}
            </span>
          </div>

          <div className="p-2.5 bg-white border border-slate-200 rounded">
            <span className="text-[11px] text-slate-500 block">Dubai (UAE)</span>
            <span className="font-mono font-bold text-slate-900 text-sm">
              {getCityTime('Asia/Dubai', plannedDate).replace(/:\d\d\s/, ' ')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
