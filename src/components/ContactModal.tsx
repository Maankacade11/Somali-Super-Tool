import React, { useState } from 'react';
import { Language } from '../types';
import { X, Mail, Send, Check } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const ContactModal: React.FC<Props> = ({ isOpen, onClose, language }) => {
  if (!isOpen) return null;
  const isSo = language === 'so';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden text-slate-800">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#1E88E5]" />
            <h3 className="text-base font-bold text-[#0A2342]">
              {isSo ? 'Nala Soo Xiriir / Soo Jeedin' : 'Contact & Tool Feedback'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <Check className="w-5 h-5 stroke-[2.5]" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">
              {isSo ? 'Fariintaada waa la helay!' : 'Message Received!'}
            </h4>
            <p className="text-xs text-slate-500">
              {isSo
                ? 'Waad ku mahadsan tahay taageeradaada iyo soo jeedintaada Somali Super Toolkit.'
                : 'Thank you for helping make Somali Super Toolkit better for everyone.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                {isSo ? 'Magacaaga' : 'Your Name'}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={isSo ? 'Magaca' : 'Full name'}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md focus:outline-none focus:border-[#1E88E5]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                {isSo ? 'Email-kaaga' : 'Your Email'}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md focus:outline-none focus:border-[#1E88E5]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                {isSo ? 'Fariinta / Qalabka aad doonayso in lagu daro' : 'Message or Tool Suggestion'}
              </label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={isSo ? 'Qor waxa aad soo jeedinayso ama qalad aad aragtay...' : 'Tell us what tools you need or any feedback...'}
                className="w-full p-3 bg-white border border-slate-300 rounded-md focus:outline-none focus:border-[#1E88E5]"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                info@somalitool.org
              </span>

              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#1E88E5] hover:bg-[#1976D2] rounded transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                {isSo ? 'Dir Fariinta' : 'Send Message'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
