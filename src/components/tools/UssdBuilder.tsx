import React, { useState } from 'react';
import { Language } from '../../types';
import { Phone, Copy, Check, QrCode, Smartphone, ExternalLink } from 'lucide-react';

interface Props {
  language: Language;
}

type ProviderId = 'evc' | 'zaad' | 'sahal' | 'edahab';

export const UssdBuilder: React.FC<Props> = ({ language }) => {
  const isSo = language === 'so';

  const [provider, setProvider] = useState<ProviderId>('evc');
  const [recipientNumber, setRecipientNumber] = useState('615000000');
  const [amount, setAmount] = useState('10');
  const [paymentType, setPaymentType] = useState<'send' | 'merchant' | 'bundle'>('send');
  const [copied, setCopied] = useState(false);

  // Generate exact USSD string
  const getUssdCode = () => {
    const cleanNumber = recipientNumber.replace(/\D/g, '');
    const cleanAmount = parseFloat(amount) || 0;

    switch (provider) {
      case 'evc':
        if (paymentType === 'send') return `*712*${cleanNumber}*${cleanAmount}#`;
        if (paymentType === 'merchant') return `*789*${cleanNumber}*${cleanAmount}#`;
        return `*770#`; // Data bundles
      case 'zaad':
        if (paymentType === 'send') return `*880*${cleanNumber}*${cleanAmount}#`;
        if (paymentType === 'merchant') return `*222*${cleanNumber}*${cleanAmount}#`;
        return `*880#`;
      case 'sahal':
        if (paymentType === 'send') return `*888*${cleanNumber}*${cleanAmount}#`;
        if (paymentType === 'merchant') return `*888*${cleanNumber}*${cleanAmount}#`;
        return `*888#`;
      case 'edahab':
        if (paymentType === 'send') return `*111*${cleanNumber}*${cleanAmount}#`;
        if (paymentType === 'merchant') return `*111*${cleanNumber}*${cleanAmount}#`;
        return `*111#`;
      default:
        return '*712#';
    }
  };

  const ussdCode = getUssdCode();

  const handleCopy = () => {
    navigator.clipboard.writeText(ussdCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDial = () => {
    // Encodes hash for phone protocol
    window.location.href = `tel:${encodeURIComponent(ussdCode)}`;
  };

  return (
    <div className="space-y-6">
      {/* Provider Selector Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg overflow-x-auto">
        {[
          { id: 'evc', label: 'EVC Plus (Hormuud)' },
          { id: 'zaad', label: 'Zaad (Telesom)' },
          { id: 'sahal', label: 'Sahal (Golis)' },
          { id: 'edahab', label: 'e-Dahab (Somtel)' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setProvider(tab.id as ProviderId)}
            className={`flex-1 py-1.5 px-2.5 text-xs font-semibold rounded whitespace-nowrap transition-colors ${
              provider === tab.id
                ? 'bg-white text-[#0A2342] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Payment Type */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        <button
          onClick={() => setPaymentType('send')}
          className={`py-2 px-2 text-center rounded border transition-colors ${
            paymentType === 'send'
              ? 'bg-[#E3F2FD] border-[#1E88E5] text-[#0A2342] font-semibold'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          {isSo ? 'Lacag Diris (P2P)' : 'Send Money (P2P)'}
        </button>

        <button
          onClick={() => setPaymentType('merchant')}
          className={`py-2 px-2 text-center rounded border transition-colors ${
            paymentType === 'merchant'
              ? 'bg-[#E3F2FD] border-[#1E88E5] text-[#0A2342] font-semibold'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          {isSo ? 'Biil / Ganacsi' : 'Merchant Pay'}
        </button>

        <button
          onClick={() => setPaymentType('bundle')}
          className={`py-2 px-2 text-center rounded border transition-colors ${
            paymentType === 'bundle'
              ? 'bg-[#E3F2FD] border-[#1E88E5] text-[#0A2342] font-semibold'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          {isSo ? 'Xirmo Internet / Data' : 'Data Bundles'}
        </button>
      </div>

      {/* Input fields */}
      {paymentType !== 'bundle' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              {paymentType === 'merchant'
                ? isSo ? 'Aqoonsiga Ganacsiga (Merchant ID)' : 'Merchant ID / Number'
                : isSo ? 'Lambarka Taleefanka ee Qofka' : 'Recipient Phone Number'}
            </label>
            <div className="relative">
              <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="tel"
                value={recipientNumber}
                onChange={(e) => setRecipientNumber(e.target.value)}
                placeholder="615XXXXXX / 634XXXXXX"
                className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-md font-mono tabular-nums focus:outline-none focus:border-[#1E88E5]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              {isSo ? 'Qaddarka Lacagta ($ USD)' : 'Amount ($ USD)'}
            </label>
            <input
              type="number"
              step="any"
              min="0.1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md font-mono tabular-nums focus:outline-none focus:border-[#1E88E5]"
            />
          </div>
        </div>
      )}

      {/* Generated Code Display Box */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 text-center">
        <span className="text-xs uppercase tracking-wider text-slate-500 block mb-1">
          {isSo ? 'Koodhka Diyaarka ah ee Taleefanka (USSD Dial String)' : 'Generated USSD Dial String'}
        </span>

        <div className="text-2xl sm:text-3xl font-mono font-bold text-[#0A2342] tracking-wider my-3 select-all bg-white py-3 px-4 rounded border border-slate-200 inline-block max-w-full overflow-x-auto">
          {ussdCode}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
          <button
            onClick={handleDial}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded transition-colors shadow-xs"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>{isSo ? 'Toos u Wac (Dial Now)' : 'Dial Directly on Phone'}</span>
          </button>

          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? (isSo ? 'Waa la guriyay!' : 'Copied!') : (isSo ? 'Guri Koodhka' : 'Copy Code')}
          </button>
        </div>

        <p className="text-[11px] text-slate-400 mt-4">
          {isSo
            ? 'Qofka ku isticmaalaya taleefanka gacanta wuxuu riixi karaa "Toos u Wac" si uu toos ugu furmo dialer-ka.'
            : 'Mobile phone users can tap "Dial Directly" to open the native dialer instantly with the full syntax.'}
        </p>
      </div>
    </div>
  );
};
