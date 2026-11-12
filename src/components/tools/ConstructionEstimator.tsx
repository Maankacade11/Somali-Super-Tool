import React, { useState } from 'react';
import { Language } from '../../types';
import { Home, Copy, Check, RotateCcw, Building, Ruler } from 'lucide-react';

interface Props {
  language: Language;
}

export const ConstructionEstimator: React.FC<Props> = ({ language }) => {
  const isSo = language === 'so';

  // Plot dimensions in meters
  const [plotLength, setPlotLength] = useState<string>('20');
  const [plotWidth, setPlotWidth] = useState<string>('20');
  const [wallHeight, setWallHeight] = useState<string>('2.5');
  const [wallSides, setWallSides] = useState<number>(4); // Perimeter wall has 4 sides
  const [doorOpenings, setDoorOpenings] = useState<number>(1); // e.g. 1 main gate (approx 6 sqm)

  // Unit costs in USD for rough estimate in Somali market
  const [blockUnitPrice, setBlockUnitPrice] = useState<string>('0.55'); // ~$0.55 per hollow block
  const [cementBagPrice, setCementBagPrice] = useState<string>('7.50'); // ~$7.50 per 50kg bag

  const [copied, setCopied] = useState(false);

  const L = parseFloat(plotLength) || 0;
  const W = parseFloat(plotWidth) || 0;
  const H = parseFloat(wallHeight) || 0;

  // Area & perimeter
  const areaSqm = L * W;
  const areaSqft = areaSqm * 10.7639;
  const perimeterMeters = (L + W) * 2 * (wallSides / 4);

  // Gross wall area
  const grossWallArea = perimeterMeters * H;
  const deductedOpeningsArea = doorOpenings * 6; // 6 sqm per gate/door
  const netWallArea = Math.max(0, grossWallArea - deductedOpeningsArea);

  // Standard hollow concrete block (40cm x 20cm x 15/20cm) = 12.5 blocks per m² + 5% waste
  const blocksCount = Math.ceil(netWallArea * 12.5 * 1.05);

  // Mortar & concrete: approx 1 bag cement per 35 blocks
  const cementBags = Math.ceil(blocksCount / 35);

  // Sand: approx 1 truck (5 cubic meters) per ~800 blocks
  const sandTrucks = (blocksCount / 800).toFixed(1);

  // Estimated material cost
  const bPrice = parseFloat(blockUnitPrice) || 0.55;
  const cPrice = parseFloat(cementBagPrice) || 7.5;
  const blocksTotalCost = blocksCount * bPrice;
  const cementTotalCost = cementBags * cPrice;
  const totalMaterialCost = blocksTotalCost + cementTotalCost;

  const handlePresetPlot = (presetL: number, presetW: number) => {
    setPlotLength(String(presetL));
    setPlotWidth(String(presetW));
  };

  const handleCopy = () => {
    const summary = isSo
      ? `Cabirka Dhulka: ${L}m × ${W}m (${areaSqm} m² / ${areaSqft.toFixed(0)} ft²) | Baloogga Loo Baahan Yahay: ~${blocksCount.toLocaleString()} xabbo | Sibidhka: ~${cementBags} kiish | Qiyaasta Kharashka Qalabka: ~$${totalMaterialCost.toFixed(0)} USD`
      : `Plot: ${L}m × ${W}m (${areaSqm} sqm / ${areaSqft.toFixed(0)} sqft) | Concrete Blocks: ~${blocksCount.toLocaleString()} | Cement: ~${cementBags} bags | Est. Material Cost: ~$${totalMaterialCost.toFixed(0)} USD`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Quick Somali Plot Size Presets */}
      <div>
        <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-2">
          {isSo ? 'Cabirrada Caanka ah ee Boosaska Soomaaliya:' : 'Common Somali Plot Sizes:'}
        </span>
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { label: '20m × 20m (Boos Buuxa)', l: 20, w: 20 },
            { label: '15m × 20m (Boos & Bar)', l: 20, w: 15 },
            { label: '10m × 20m (Nus Boos)', l: 20, w: 10 },
            { label: '15m × 15m (Koonfur)', l: 15, w: 15 },
            { label: '30m × 30m (Beer / Xero)', l: 30, w: 30 },
          ].map((preset) => (
            <button
              key={preset.label}
              onClick={() => handlePresetPlot(preset.l, preset.w)}
              className="px-2.5 py-1 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-800 rounded transition-colors"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input Dimensions */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            {isSo ? 'Dhererka Dhulka (Mitir)' : 'Length (Meters)'}
          </label>
          <input
            type="number"
            value={plotLength}
            onChange={(e) => setPlotLength(e.target.value)}
            className="w-full px-2.5 py-1.5 text-sm bg-white border border-slate-300 rounded font-mono"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            {isSo ? 'Ballaca Dhulka (Mitir)' : 'Width (Meters)'}
          </label>
          <input
            type="number"
            value={plotWidth}
            onChange={(e) => setPlotWidth(e.target.value)}
            className="w-full px-2.5 py-1.5 text-sm bg-white border border-slate-300 rounded font-mono"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            {isSo ? 'Dhererka Darbiga (Mitir)' : 'Wall Height (m)'}
          </label>
          <input
            type="number"
            step="0.1"
            value={wallHeight}
            onChange={(e) => setWallHeight(e.target.value)}
            className="w-full px-2.5 py-1.5 text-sm bg-white border border-slate-300 rounded font-mono"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            {isSo ? 'Albaabbada / Iridda' : 'Gate Openings'}
          </label>
          <input
            type="number"
            min="0"
            value={doorOpenings}
            onChange={(e) => setDoorOpenings(parseInt(e.target.value) || 0)}
            className="w-full px-2.5 py-1.5 text-sm bg-white border border-slate-300 rounded font-mono"
          />
        </div>
      </div>

      {/* Calculation Results Overview */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-4 border-b border-slate-200 text-center">
          <div>
            <span className="text-xs text-slate-500 block">{isSo ? 'Bedka Dhulka (Area)' : 'Total Plot Area'}</span>
            <span className="text-xl sm:text-2xl font-bold font-mono text-[#0A2342] tabular-nums">
              {areaSqm} m²
            </span>
            <span className="text-[11px] text-slate-400 block font-mono">
              ≈ {areaSqft.toFixed(0)} ft²
            </span>
          </div>

          <div>
            <span className="text-xs text-slate-500 block">{isSo ? 'Wareegga Darbiga' : 'Perimeter Wall'}</span>
            <span className="text-xl sm:text-2xl font-bold font-mono text-[#0A2342] tabular-nums">
              {perimeterMeters} m
            </span>
            <span className="text-[11px] text-slate-400 block font-mono">
              {isSo ? 'Darbi 4 geesood ah' : '4-sided boundary'}
            </span>
          </div>

          <div>
            <span className="text-xs text-slate-500 block">{isSo ? 'Tirada Baloogga' : 'Blocks Needed'}</span>
            <span className="text-xl sm:text-2xl font-bold font-mono text-[#1E88E5] tabular-nums">
              ~{blocksCount.toLocaleString()}
            </span>
            <span className="text-[11px] text-slate-400 block font-mono">
              {isSo ? 'xabbo (hollow blocks)' : 'units (+5% waste)'}
            </span>
          </div>

          <div>
            <span className="text-xs text-slate-500 block">{isSo ? 'Kiishashka Sibidhka' : 'Cement Needed'}</span>
            <span className="text-xl sm:text-2xl font-bold font-mono text-emerald-700 tabular-nums">
              ~{cementBags}
            </span>
            <span className="text-[11px] text-slate-400 block font-mono">
              {isSo ? 'kiish (50kg)' : 'bags (50kg each)'}
            </span>
          </div>
        </div>

        {/* Cost estimate strip */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div>
            <span className="font-semibold text-slate-900">{isSo ? 'Qiyaasta Kharashka Baloogga & Sibidhka:' : 'Estimated Material Cost:'}</span>{' '}
            <strong className="text-base text-[#0A2342] font-mono tabular-nums">
              ~${totalMaterialCost.toLocaleString(undefined, { maximumFractionDigits: 0 })} USD
            </strong>{' '}
            <span className="text-[11px] text-slate-400">
              ({isSo ? `Ciidda: ~${sandTrucks} gaari` : `Sand: ~${sandTrucks} trucks`})
            </span>
          </div>

          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#1E88E5] hover:bg-[#1976D2] rounded transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? (isSo ? 'La guriyay!' : 'Copied!') : (isSo ? 'Guri Xisaabta Dhismaha' : 'Copy Estimate')}
          </button>
        </div>
      </div>
    </div>
  );
};
