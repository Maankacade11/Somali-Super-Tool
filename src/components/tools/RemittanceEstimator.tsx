import React, { useState } from 'react';
import { Language } from '../../types';
import { SendHorizontal, Copy, Check, RotateCcw, Info } from 'lucide-react';

interface Props {
  language: Language;
}

interface SendingCorridor {
  code: string;
  nameSo: string;
  nameEn: string;
  currency: string;
  rateToUsd: number; // e.g., 1 GBP = 1.27 USD
  typicalFeePct: number;
  fixedFee: number;
}

const CORRIDORS: SendingCorridor[] = [
  { code: 'US', nameSo: 'Maraykanka (USA)', nameEn: 'United States (USD)', currency: 'USD ($)', rateToUsd: 1.0, typicalFeePct: 2.0, fixedFee: 2.0 },
  { code: 'UK', nameSo: 'Ingiriiska (UK)', nameEn: 'United Kingdom (GBP)', currency: 'GBP (£)', rateToUsd: 1.27, typicalFeePct: 2.0, fixedFee: 1.5 },
  { code: 'EU', nameSo: 'Midowga Yurub (EU)', nameEn: 'Eurozone (EUR)', currency: 'EUR (€)', rateToUsd: 1.08, typicalFeePct: 2.2, fixedFee: 2.0 },
  { code: 'SE', nameSo: 'Iswiidhan (Sweden)', nameEn: 'Sweden (SEK)', currency: 'SEK (kr)', rateToUsd: 0.095, typicalFeePct: 2.5, fixedFee: 20 },
  { code: 'NO', nameSo: 'Noorway (Norway)', nameEn: 'Norway (NOK)', currency: 'NOK (kr)', rateToUsd: 0.093, typicalFeePct: 2.5, fixedFee: 20 },
  { code: 'AE', nameSo: 'Imaaraadka (UAE)', nameEn: 'United Arab Emirates (AED)', currency: 'AED', rateToUsd: 0.272, typicalFeePct: 1.8, fixedFee: 10 },
  { code: 'KE', nameSo: 'Kiinya (Kenya)', nameEn: 'Kenya (KES)', currency: 'KES (KSh)', rateToUsd: 0.0077, typicalFeePct: 1.5, fixedFee: 50 },
  { code: 'CA', nameSo: 'Kanada (Canada)', nameEn: 'Canada (CAD)', currency: 'CAD ($)', rateToUsd: 0.74, typicalFeePct: 2.2, fixedFee: 2.5 },
];

export const RemittanceEstimator: React.FC<Props> = ({ language }) => {
  const isSo = language === 'so';

  const [sendCountry, setSendCountry] = useState<string>('US');
  const [sendAmount, setSendAmount] = useState<string>('200');
  const [deliveryMethod, setDeliveryMethod] = useState<'mobile' | 'cash' | 'bank'>('mobile');
  const [sosExchangeRate, setSosExchangeRate] = useState<string>('26000');
  const [copied, setCopied] = useState(false);

  const selectedCorridor = CORRIDORS.find((c) => c.code === sendCountry) || CORRIDORS[0];
  const amount = parseFloat(sendAmount) || 0;

  // Calculate fees
  const fee = (amount * selectedCorridor.typicalFeePct) / 100 + selectedCorridor.fixedFee;
  const totalCost = amount + fee;

  // Convert to USD received in Somalia
  const recipientUsd = amount * selectedCorridor.rateToUsd;
  const recipientSos = recipientUsd * (parseFloat(sosExchangeRate) || 26000);

  const handleCopy = () => {
    const summary = isSo
      ? `Dirista: ${amount} ${selectedCorridor.currency} | Khidmadda: ~${fee.toFixed(2)} | Qofka loo diray wuxuu helayaa: $${recipientUsd.toFixed(2)} USD (${recipientSos.toLocaleString()} Sh.So)`
      : `Sent: ${amount} ${selectedCorridor.currency} | Est. Fee: ~${fee.toFixed(2)} | Recipient gets: $${recipientUsd.toFixed(2)} USD (~${recipientSos.toLocaleString()} SOS)`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="p-3 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-600 flex items-start gap-2">
        <Info className="w-4 h-4 text-[#1E88E5] shrink-0 mt-0.5" />
        <div>
          {isSo
            ? 'Qalabkani wuxuu qiyaasaa khidmadaha xawaaladaha (sida Dahabshiil, Taaj, WorldRemit, Paysii) iyo inta lacag ee ku dhacaysa EVC Plus, Zaad ama Sahal.'
            : 'Estimates remittance transfer fees and net delivery amounts into Somali mobile wallets (EVC Plus, Zaad, Sahal) or branch cash pickup.'}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            {isSo ? 'Dalka Lacagta Laga Dirayo' : 'Sending Country / Corridor'}
          </label>
          <select
            value={sendCountry}
            onChange={(e) => setSendCountry(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:border-[#1E88E5]"
          >
            {CORRIDORS.map((c) => (
              <option key={c.code} value={c.code}>
                {isSo ? c.nameSo : c.nameEn}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            {isSo ? `Qaddarka Aad Dirayso (${selectedCorridor.currency})` : `Send Amount (${selectedCorridor.currency})`}
          </label>
          <input
            type="number"
            value={sendAmount}
            onChange={(e) => setSendAmount(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md focus:outline-none focus:border-[#1E88E5] font-mono tabular-nums"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            {isSo ? 'Habka Qabashada (Delivery)' : 'Delivery Channel'}
          </label>
          <select
            value={deliveryMethod}
            onChange={(e) => setDeliveryMethod(e.target.value as any)}
            className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:border-[#1E88E5]"
          >
            <option value="mobile">{isSo ? 'Mobile Money (EVC Plus / Zaad / Sahal)' : 'Mobile Money (EVC / Zaad / Sahal)'}</option>
            <option value="cash">{isSo ? 'Caddaan Laamaha (Cash Pickup)' : 'Branch Cash Pickup'}</option>
            <option value="bank">{isSo ? 'Koonto Bangi (Bank Deposit)' : 'Bank Account Deposit'}</option>
          </select>
        </div>
      </div>

      {/* Result Card */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-5">
        <div className="text-center py-4 border-b border-slate-200">
          <span className="text-xs uppercase tracking-wider text-slate-500 block mb-1">
            {isSo ? 'Qaddarka Qofka Soomaaliya Jooga Helayo' : 'Net Amount Recipient Receives'}
          </span>
          <div className="text-3xl sm:text-4xl font-extrabold text-[#0A2342] font-mono tabular-nums">
            ${recipientUsd.toFixed(2)} <span className="text-sm font-sans font-normal text-slate-500">USD</span>
          </div>
          <span className="text-xs text-slate-500 mt-1 block font-mono">
            ≈ {recipientSos.toLocaleString(undefined, { maximumFractionDigits: 0 })} SOS ({isSo ? 'Shillin Soomaali' : 'Somali Shilling'})
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 text-xs text-center">
          <div>
            <span className="text-slate-500 block">{isSo ? 'Lacagta Aad Dirayso' : 'Sent Principal'}</span>
            <span className="font-semibold text-slate-800 font-mono text-sm tabular-nums">
              {amount} {selectedCorridor.currency}
            </span>
          </div>

          <div>
            <span className="text-slate-500 block">{isSo ? 'Qiyaasta Khidmadda Xawaaladda' : 'Estimated Transfer Fee'}</span>
            <span className="font-semibold text-rose-600 font-mono text-sm tabular-nums">
              ~{fee.toFixed(2)} {selectedCorridor.currency}
            </span>
          </div>

          <div>
            <span className="text-slate-500 block">{isSo ? 'Wadarta Kharashka Guud' : 'Total You Pay'}</span>
            <span className="font-semibold text-[#0A2342] font-mono text-sm tabular-nums">
              {totalCost.toFixed(2)} {selectedCorridor.currency}
            </span>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#1E88E5] hover:bg-[#1976D2] rounded transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? (isSo ? 'La guriyay!' : 'Copied!') : (isSo ? 'Guri Faahfaahinta' : 'Copy Estimate')}
          </button>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>{isSo ? 'Sarifka SOS:' : 'SOS Rate:'}</span>
            <input
              type="number"
              value={sosExchangeRate}
              onChange={(e) => setSosExchangeRate(e.target.value)}
              className="w-20 px-1.5 py-0.5 border border-slate-300 rounded font-mono text-xs text-right"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
