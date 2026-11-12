import React, { useState } from 'react';
import { Language } from '../../types';
import { ArrowLeftRight, Copy, Check } from 'lucide-react';

interface Props {
  language: Language;
}

type UnitCategory = 'length' | 'weight' | 'area' | 'temp';

export const UnitConverter: React.FC<Props> = ({ language }) => {
  const isSo = language === 'so';

  const [category, setCategory] = useState<UnitCategory>('length');
  const [inputValue, setInputValue] = useState<string>('100');
  const [fromUnit, setFromUnit] = useState<string>('m');
  const [toUnit, setToUnit] = useState<string>('ft');
  const [copied, setCopied] = useState(false);

  // Conversion rates relative to base unit
  const lengthUnits: Record<string, { nameSo: string; nameEn: string; factor: number }> = {
    m: { nameSo: 'Mitir (m)', nameEn: 'Meter (m)', factor: 1 },
    km: { nameSo: 'Kilomitir (km)', nameEn: 'Kilometer (km)', factor: 1000 },
    cm: { nameSo: 'Sentimitir (cm)', nameEn: 'Centimeter (cm)', factor: 0.01 },
    mm: { nameSo: 'Milimitir (mm)', nameEn: 'Millimeter (mm)', factor: 0.001 },
    ft: { nameSo: 'Lug (ft)', nameEn: 'Foot (ft)', factor: 0.3048 },
    inch: { nameSo: 'Inji (in)', nameEn: 'Inch (in)', factor: 0.0254 },
    yard: { nameSo: 'Yaard (yd)', nameEn: 'Yard (yd)', factor: 0.9144 },
    mile: { nameSo: 'Mayl (mi)', nameEn: 'Mile (mi)', factor: 1609.344 },
  };

  const weightUnits: Record<string, { nameSo: string; nameEn: string; factor: number }> = {
    kg: { nameSo: 'Kiilogaraam (kg)', nameEn: 'Kilogram (kg)', factor: 1 },
    g: { nameSo: 'Garaam (g)', nameEn: 'Gram (g)', factor: 0.001 },
    mg: { nameSo: 'Miligaraam (mg)', nameEn: 'Milligram (mg)', factor: 0.000001 },
    lb: { nameSo: 'Pound (lb)', nameEn: 'Pound (lb)', factor: 0.45359237 },
    oz: { nameSo: 'Wiqiyad (oz)', nameEn: 'Ounce (oz)', factor: 0.02834952 },
    ton: { nameSo: 'Tan (metric ton)', nameEn: 'Metric Ton (t)', factor: 1000 },
  };

  const areaUnits: Record<string, { nameSo: string; nameEn: string; factor: number }> = {
    sqm: { nameSo: 'Mitir laba-jibaaran (m²)', nameEn: 'Square Meter (m²)', factor: 1 },
    hectare: { nameSo: 'Hektar (ha)', nameEn: 'Hectare (ha)', factor: 10000 },
    sqkm: { nameSo: 'Kilomitir laba-jibaaran (km²)', nameEn: 'Square Kilometer (km²)', factor: 1000000 },
    acre: { nameSo: 'Eekar (ac)', nameEn: 'Acre (ac)', factor: 4046.8564224 },
    sqft: { nameSo: 'Lug laba-jibaaran (ft²)', nameEn: 'Square Foot (ft²)', factor: 0.092903 },
  };

  const handleCategoryChange = (cat: UnitCategory) => {
    setCategory(cat);
    if (cat === 'length') {
      setFromUnit('m');
      setToUnit('ft');
    } else if (cat === 'weight') {
      setFromUnit('kg');
      setToUnit('lb');
    } else if (cat === 'area') {
      setFromUnit('sqm');
      setToUnit('acre');
    } else if (cat === 'temp') {
      setFromUnit('C');
      setToUnit('F');
    }
  };

  const convertTemperature = (val: number, from: string, to: string): number => {
    if (from === to) return val;
    let celsius = val;
    if (from === 'F') celsius = (val - 32) * (5 / 9);
    else if (from === 'K') celsius = val - 273.15;

    if (to === 'C') return celsius;
    if (to === 'F') return (celsius * 9) / 5 + 32;
    if (to === 'K') return celsius + 273.15;
    return celsius;
  };

  const inputNum = parseFloat(inputValue) || 0;
  let result = 0;

  if (category === 'temp') {
    result = convertTemperature(inputNum, fromUnit, toUnit);
  } else {
    const unitMap =
      category === 'length' ? lengthUnits : category === 'weight' ? weightUnits : areaUnits;
    const fromFactor = unitMap[fromUnit]?.factor || 1;
    const toFactor = unitMap[toUnit]?.factor || 1;
    result = (inputNum * fromFactor) / toFactor;
  }

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`${inputValue} ${fromUnit} = ${result.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${toUnit}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentUnitMap =
    category === 'length' ? lengthUnits : category === 'weight' ? weightUnits : areaUnits;

  return (
    <div className="space-y-6">
      {/* Category selector */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
        {[
          { id: 'length', so: 'Dherer (Length)', en: 'Length' },
          { id: 'weight', so: 'Miisaan (Weight)', en: 'Weight' },
          { id: 'area', so: 'Bed (Area)', en: 'Area' },
          { id: 'temp', so: 'Heerkul (Temp)', en: 'Temperature' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleCategoryChange(tab.id as UnitCategory)}
            className={`flex-1 py-1.5 px-2 text-xs font-medium rounded transition-colors whitespace-nowrap ${
              category === tab.id
                ? 'bg-white text-[#0A2342] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {isSo ? tab.so : tab.en}
          </button>
        ))}
      </div>

      {/* Converter Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            {isSo ? 'Qaddarka' : 'Value'}
          </label>
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md focus:outline-none focus:border-[#1E88E5] font-mono tabular-nums"
          />
          <div className="mt-2">
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full px-2 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:border-[#1E88E5]"
            >
              {category === 'temp' ? (
                <>
                  <option value="C">Celsius (°C)</option>
                  <option value="F">Fahrenheit (°F)</option>
                  <option value="K">Kelvin (K)</option>
                </>
              ) : (
                Object.entries(currentUnitMap).map(([k, u]) => (
                  <option key={k} value={k}>
                    {isSo ? u.nameSo : u.nameEn}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        <div className="flex justify-center md:pb-2">
          <button
            onClick={handleSwap}
            className="p-2 border border-slate-300 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
            title={isSo ? 'U beddel dhanka kale' : 'Swap units'}
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            {isSo ? 'Natiijada' : 'Converted Value'}
          </label>
          <div className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-md font-mono font-bold text-[#0A2342] tabular-nums truncate">
            {result.toLocaleString(undefined, { maximumFractionDigits: 6 })}
          </div>
          <div className="mt-2">
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full px-2 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:border-[#1E88E5]"
            >
              {category === 'temp' ? (
                <>
                  <option value="C">Celsius (°C)</option>
                  <option value="F">Fahrenheit (°F)</option>
                  <option value="K">Kelvin (K)</option>
                </>
              ) : (
                Object.entries(currentUnitMap).map(([k, u]) => (
                  <option key={k} value={k}>
                    {isSo ? u.nameSo : u.nameEn}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>
      </div>

      {/* Result Display Box */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-center sm:text-left">
          <span className="text-xs text-slate-500 block">
            {isSo ? 'Isu-dhigmaha rasmiga ah' : 'Conversion Formula & Equivalence'}
          </span>
          <div className="text-base font-semibold text-slate-900 font-mono mt-0.5">
            {inputValue} {fromUnit} = {result.toLocaleString(undefined, { maximumFractionDigits: 4 })} {toUnit}
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#1E88E5] hover:bg-[#1976D2] rounded transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? (isSo ? 'Waa la guriyay!' : 'Copied!') : (isSo ? 'Guri Natiijada' : 'Copy Result')}
        </button>
      </div>
    </div>
  );
};
