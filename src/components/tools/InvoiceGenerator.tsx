import React, { useState } from 'react';
import { Language } from '../../types';
import { Plus, Trash2, Printer, RotateCcw, FileText } from 'lucide-react';

interface Props {
  language: Language;
}

interface ItemRow {
  id: string;
  description: string;
  quantity: number;
  rate: number;
}

export const InvoiceGenerator: React.FC<Props> = ({ language }) => {
  const isSo = language === 'so';

  const [businessName, setBusinessName] = useState('Dahab & Kaamil Tech Solutions');
  const [businessContact, setBusinessContact] = useState('+252 61 500 0000 | info@dahabkaamil.so');
  const [businessAddress, setBusinessAddress] = useState('Maka Al Mukarama Road, Mogadishu');

  const [customerName, setCustomerName] = useState('Bilaal Trading Co.');
  const [customerContact, setCustomerContact] = useState('+252 61 711 2233');

  const [invoiceNumber, setInvoiceNumber] = useState('INV-2026-089');
  const [invoiceDate, setInvoiceDate] = useState('2026-11-12');
  const [dueDate, setDueDate] = useState('2026-11-26');
  const [currency, setCurrency] = useState('USD ($)');

  const [items, setItems] = useState<ItemRow[]>([
    { id: '1', description: 'Design & Web Development Service', quantity: 1, rate: 450 },
    { id: '2', description: 'Cloud Hosting Setup & Domain (1 Year)', quantity: 1, rate: 85 },
    { id: '3', description: 'System Training & Support Hours', quantity: 5, rate: 30 },
  ]);

  const [discountPercent, setDiscountPercent] = useState<number>(5);
  const [taxPercent, setTaxPercent] = useState<number>(0);
  const [notes, setNotes] = useState(
    isSo
      ? 'Mahadsanid ganacsigaaga. Lacagta waxaa lagu bixin karaa EVC Plus, Zaad ama Koontada Bangiga.'
      : 'Thank you for your business. Payment can be made via EVC Plus, Zaad, or Direct Bank Transfer.'
  );

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      { id: Date.now().toString(), description: '', quantity: 1, rate: 0 },
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof ItemRow, value: any) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  const discountAmount = (subtotal * (discountPercent || 0)) / 100;
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = (taxableAmount * (taxPercent || 0)) / 100;
  const grandTotal = taxableAmount + taxAmount;

  const handlePrint = () => {
    window.print();
  };

  const handleLoadSample = () => {
    setBusinessName(isSo ? 'Golis Logistics & Trading' : 'Horn Logistics Ltd');
    setBusinessContact('+252 63 440 1234 | billing@hornlogistics.so');
    setBusinessAddress('Airport Road, Hargeisa');
    setCustomerName('Somali Wholesale Market');
    setCustomerContact('+252 63 422 9988');
    setInvoiceNumber(`INV-${Math.floor(1000 + Math.random() * 9000)}`);
    setItems([
      { id: '1', description: 'Container Freight Clearance', quantity: 2, rate: 320 },
      { id: '2', description: 'Local Warehousing Storage (30 days)', quantity: 1, rate: 150 },
    ]);
    setDiscountPercent(0);
    setTaxPercent(0);
  };

  return (
    <div className="space-y-6">
      {/* Top toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg no-print">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <FileText className="w-4 h-4 text-[#1E88E5]" />
          <span>{isSo ? 'Qaabka Qaansheegta & Rasiidka' : 'Printable Invoice Document'}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleLoadSample}
            className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-100 transition-colors"
          >
            {isSo ? 'Tusaale Ku Shub' : 'Load Sample'}
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#1E88E5] hover:bg-[#1976D2] rounded transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            {isSo ? 'Daabac ama PDF' : 'Print / Save PDF'}
          </button>
        </div>
      </div>

      {/* Printable Invoice Container */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 text-slate-900 shadow-sm print:shadow-none print:border-none print:p-0">
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-slate-200">
          <div>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="text-xl sm:text-2xl font-bold text-[#0A2342] tracking-tight w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:border-[#1E88E5] focus:outline-none"
              placeholder={isSo ? 'Magaca Ganacsiga' : 'Business Name'}
            />
            <input
              type="text"
              value={businessContact}
              onChange={(e) => setBusinessContact(e.target.value)}
              className="text-xs text-slate-600 mt-1 w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:border-[#1E88E5] focus:outline-none"
              placeholder={isSo ? 'Telefoon / Email' : 'Phone / Email'}
            />
            <input
              type="text"
              value={businessAddress}
              onChange={(e) => setBusinessAddress(e.target.value)}
              className="text-xs text-slate-500 w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:border-[#1E88E5] focus:outline-none"
              placeholder={isSo ? 'Cinwaanka' : 'Address'}
            />
          </div>

          <div className="text-left sm:text-right">
            <h2 className="text-xl font-bold tracking-wider text-[#0A2342] uppercase font-mono">
              {isSo ? 'QAANSHEEG' : 'INVOICE'}
            </h2>
            <div className="mt-2 space-y-1 text-xs">
              <div className="flex sm:justify-end items-center gap-2">
                <span className="text-slate-500">{isSo ? 'Lambarka:' : 'Invoice #:'}</span>
                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="w-28 text-right font-mono font-medium text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-[#1E88E5] focus:outline-none"
                />
              </div>
              <div className="flex sm:justify-end items-center gap-2">
                <span className="text-slate-500">{isSo ? 'Taariikhda:' : 'Date:'}</span>
                <input
                  type="date"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  className="font-mono text-slate-700 bg-transparent border-b border-transparent hover:border-slate-300 focus:outline-none"
                />
              </div>
              <div className="flex sm:justify-end items-center gap-2">
                <span className="text-slate-500">{isSo ? 'U Dambayn:' : 'Due Date:'}</span>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="font-mono text-slate-700 bg-transparent border-b border-transparent hover:border-slate-300 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bill To Block */}
        <div className="py-4 border-b border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              {isSo ? 'Ku Socota (Macmiilka)' : 'Billed To (Client)'}
            </span>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="text-sm font-semibold text-slate-900 w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:border-[#1E88E5] focus:outline-none"
              placeholder={isSo ? 'Magaca Macmiilka / Shirkadda' : 'Customer Name / Entity'}
            />
            <input
              type="text"
              value={customerContact}
              onChange={(e) => setCustomerContact(e.target.value)}
              className="text-xs text-slate-600 mt-1 w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:border-[#1E88E5] focus:outline-none"
              placeholder={isSo ? 'Telefoonka Macmiilka' : 'Client Phone / Email'}
            />
          </div>

          <div className="sm:text-right flex sm:flex-col justify-end items-start sm:items-end">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              {isSo ? 'Lacagta (Currency)' : 'Currency'}
            </span>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="text-xs font-medium border border-slate-300 rounded px-2 py-1 bg-white focus:outline-none focus:border-[#1E88E5]"
            >
              <option value="USD ($)">USD ($)</option>
              <option value="SOS (Sh.So)">Somali Shilling (SOS)</option>
              <option value="EUR (€)">EUR (€)</option>
              <option value="GBP (£)">GBP (£)</option>
            </select>
          </div>
        </div>

        {/* Items Table */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-300 text-slate-500 uppercase tracking-wider font-semibold">
                <th className="py-2.5 pr-2 w-1/2">{isSo ? 'Faahfaahinta Alaabta / Adeegga' : 'Description'}</th>
                <th className="py-2.5 px-2 text-center w-20">{isSo ? 'Tirada' : 'Qty'}</th>
                <th className="py-2.5 px-2 text-right w-28">{isSo ? 'Qiimaha' : 'Rate'}</th>
                <th className="py-2.5 pl-2 text-right w-28">{isSo ? 'Wadarta' : 'Total'}</th>
                <th className="py-2.5 pl-2 w-8 no-print"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="py-2 pr-2">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      placeholder={isSo ? 'Qor waxa la bixiyay...' : 'Service or item description...'}
                      className="w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:border-[#1E88E5] focus:outline-none text-slate-800 text-xs py-0.5"
                    />
                  </td>
                  <td className="py-2 px-2 text-center">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                      className="w-16 text-center font-mono tabular-nums bg-transparent border border-slate-200 rounded py-0.5 focus:outline-none focus:border-[#1E88E5]"
                    />
                  </td>
                  <td className="py-2 px-2 text-right">
                    <input
                      type="number"
                      step="any"
                      value={item.rate}
                      onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                      className="w-24 text-right font-mono tabular-nums bg-transparent border border-slate-200 rounded py-0.5 focus:outline-none focus:border-[#1E88E5]"
                    />
                  </td>
                  <td className="py-2 pl-2 text-right font-mono font-medium text-slate-900 tabular-nums">
                    {(item.quantity * item.rate).toFixed(2)}
                  </td>
                  <td className="py-2 pl-2 text-right no-print">
                    <button
                      onClick={() => removeItem(item.id)}
                      disabled={items.length <= 1}
                      className="text-slate-400 hover:text-rose-600 disabled:opacity-30 transition-colors p-1"
                      title={isSo ? 'Tir' : 'Remove item'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-2 no-print">
            <button
              onClick={addItem}
              className="inline-flex items-center gap-1 text-xs font-medium text-[#1E88E5] hover:text-[#1976D2] py-1"
            >
              <Plus className="w-3.5 h-3.5" />
              {isSo ? 'Kudar Saf Cusub' : 'Add Line Item'}
            </button>
          </div>
        </div>

        {/* Calculation summary block */}
        <div className="mt-6 pt-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="w-full sm:w-1/2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              {isSo ? 'Fariin / Shuruudaha Lacag-Bixinta' : 'Notes & Payment Terms'}
            </span>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded p-2 focus:outline-none focus:border-[#1E88E5]"
              placeholder={isSo ? 'Qor macluumaad dheeraad ah...' : 'Payment methods, bank details, thank you notes...'}
            />
          </div>

          <div className="w-full sm:w-64 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>{isSo ? 'Wadarta Hore' : 'Subtotal'}:</span>
              <span className="font-mono tabular-nums">{subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center text-slate-600">
              <span className="flex items-center gap-1">
                {isSo ? 'Qiimo-dhimis' : 'Discount'} (%):
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(parseFloat(e.target.value) || 0)}
                  className="w-12 text-center border border-slate-200 rounded px-1 py-0.5 no-print"
                />
              </span>
              <span className="font-mono tabular-nums text-rose-600">-{discountAmount.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center text-slate-600">
              <span className="flex items-center gap-1">
                {isSo ? 'Canshuur/Kharash' : 'Tax'} (%):
                <input
                  type="number"
                  min="0"
                  value={taxPercent}
                  onChange={(e) => setTaxPercent(parseFloat(e.target.value) || 0)}
                  className="w-12 text-center border border-slate-200 rounded px-1 py-0.5 no-print"
                />
              </span>
              <span className="font-mono tabular-nums">+{taxAmount.toFixed(2)}</span>
            </div>

            <div className="pt-2 border-t border-slate-300 flex justify-between items-center text-sm font-bold text-[#0A2342]">
              <span>{isSo ? 'WADARTA GUUD' : 'GRAND TOTAL'}:</span>
              <span className="font-mono text-base tabular-nums">
                {currency.split(' ')[0]} {grandTotal.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
