import React, { useState } from 'react';
import { Language } from '../../types';
import { Plus, Trash2, Printer, RotateCcw, FileText, Check } from 'lucide-react';

interface Props {
  language: Language;
}

interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  details: string;
}

interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  year: string;
}

export const CvBuilder: React.FC<Props> = ({ language }) => {
  const isSo = language === 'so';

  const [fullName, setFullName] = useState('Cabdiraxmaan Cali Xasan');
  const [jobTitle, setJobTitle] = useState('Sarkaalka Maaliyadda & Xisaabaadka (Finance Officer)');
  const [email, setEmail] = useState('abdirahman.ali@example.so');
  const [phone, setPhone] = useState('+252 61 555 1234');
  const [location, setLocation] = useState('Muqdisho, Soomaaliya');

  const [summary, setSummary] = useState(
    isSo
      ? 'Xirfadle maaliyadeed oo leh khibrad 5+ sano ah oo ku saabsan xisaabaadka ganacsiga, maareynta qaansheegyada, xisaab-xirka billeedka ah iyo diyaarinta warbixinnada maaliyadeed.'
      : 'Detail-oriented Finance Officer with 5+ years of experience in corporate bookkeeping, invoice management, payroll administration, and financial reporting.'
  );

  const [skills, setSkills] = useState('QuickBooks, Excel (Advanced), Maareynta Miisaaniyadda, Xisaab-xirka, Xiriirka Macaamiisha');

  const [experiences, setExperiences] = useState<ExperienceItem[]>([
    {
      id: '1',
      role: isSo ? 'Madaxa Xisaabaadka (Senior Accountant)' : 'Senior Accountant',
      company: 'Dahabshiil Bank International',
      period: '2023 — Joogto',
      details: isSo
        ? 'Maareynta socodka lacagta caddaanka ah, xaqiijinta xisaabaadka maalinlaha ah iyo kormeerka diyaarinta qaansheegyada shirkadda.'
        : 'Supervised daily ledger reconciliations, oversaw corporate invoice cycles, and managed audit compliance.',
    },
    {
      id: '2',
      role: isSo ? 'Kaaliyaha Maaliyadda (Finance Assistant)' : 'Finance Assistant',
      company: 'Horn Logistics Co.',
      period: '2021 — 2023',
      details: isSo
        ? 'Diiwaangelinta rasiidhadha iyo biilasha, diyaarinta mushaharka shaqaalaha iyo dabagalka lacagaha la leeyahay.'
        : 'Maintained accounts payable and receivable ledgers, processed monthly staff payroll, and tracked vendor invoices.',
    },
  ]);

  const [educations, setEducations] = useState<EducationItem[]>([
    {
      id: '1',
      degree: isSo ? 'Shahaadada Koowaad (BSc) ee Xisaabaadka & Maaliyadda' : 'BSc in Accounting & Finance',
      institution: isSo ? 'Jaamacadda Muqdisho' : 'Mogadishu University',
      year: '2017 — 2021',
    },
  ]);

  const addExperience = () => {
    setExperiences((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role: '',
        company: '',
        period: '',
        details: '',
      },
    ]);
  };

  const removeExperience = (id: string) => {
    if (experiences.length > 1) {
      setExperiences((prev) => prev.filter((e) => e.id !== id));
    }
  };

  const updateExperience = (id: string, field: keyof ExperienceItem, val: string) => {
    setExperiences((prev) =>
      prev.map((e) => (e.id === id ? { ...e, [field]: val } : e))
    );
  };

  const addEducation = () => {
    setEducations((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        degree: '',
        institution: '',
        year: '',
      },
    ]);
  };

  const removeEducation = (id: string) => {
    if (educations.length > 1) {
      setEducations((prev) => prev.filter((e) => e.id !== id));
    }
  };

  const updateEducation = (id: string, field: keyof EducationItem, val: string) => {
    setEducations((prev) =>
      prev.map((e) => (e.id === id ? { ...e, [field]: val } : e))
    );
  };

  const handlePrint = () => {
    window.print();
  };

  const handleReset = () => {
    if (window.confirm(isSo ? 'Ma hubtaa inaad tirtirto xogta CV-ga?' : 'Reset CV form?')) {
      setFullName('');
      setJobTitle('');
      setEmail('');
      setPhone('');
      setLocation('');
      setSummary('');
      setSkills('');
      setExperiences([{ id: '1', role: '', company: '', period: '', details: '' }]);
      setEducations([{ id: '1', degree: '', institution: '', year: '' }]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg no-print">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <FileText className="w-4 h-4 text-[#1E88E5]" />
          <span>{isSo ? 'Dhisaha CV-ga & Taariikh-Nololeedka (Print Ready)' : 'Professional CV & Resume Builder'}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 bg-white rounded"
          >
            <RotateCcw className="w-3 h-3 inline mr-1" />
            {isSo ? 'Dib u deji' : 'Reset'}
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#1E88E5] hover:bg-[#1976D2] rounded transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            {isSo ? 'Daabac ama PDF u rogo' : 'Print / Export PDF'}
          </button>
        </div>
      </div>

      {/* Two-Column Editor & Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Form Fields (no-print) */}
        <div className="space-y-4 no-print text-xs">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
            <span className="font-bold text-slate-700 uppercase tracking-wider block">
              {isSo ? 'Xogta Qofka' : 'Personal Information'}
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="text-slate-600 block mb-1">{isSo ? 'Magaca Buuxa' : 'Full Name'}</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs focus:outline-none focus:border-[#1E88E5]"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1">{isSo ? 'Cinwaanka Shaqada' : 'Job Title / Headline'}</label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs focus:outline-none focus:border-[#1E88E5]"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs focus:outline-none focus:border-[#1E88E5]"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1">{isSo ? 'Telefoon' : 'Phone'}</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs focus:outline-none focus:border-[#1E88E5]"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-600 block mb-1">{isSo ? 'Magaalada / Dalka' : 'City / Location'}</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs focus:outline-none focus:border-[#1E88E5]"
              />
            </div>

            <div>
              <label className="text-slate-600 block mb-1">{isSo ? 'Hordhac Gaaban (Summary)' : 'Professional Summary'}</label>
              <textarea
                rows={3}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs focus:outline-none focus:border-[#1E88E5]"
              />
            </div>
          </div>

          {/* Work Experience Form */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700 uppercase tracking-wider">
                {isSo ? 'Khibradda Shaqada' : 'Work Experience'}
              </span>
              <button
                type="button"
                onClick={addExperience}
                className="text-xs text-[#1E88E5] font-semibold hover:underline inline-flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                {isSo ? 'Kudar Shaqo' : 'Add Experience'}
              </button>
            </div>

            {experiences.map((exp, idx) => (
              <div key={exp.id} className="p-3 bg-white border border-slate-200 rounded space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-700">{isSo ? `Shaqada #${idx + 1}` : `Role #${idx + 1}`}</span>
                  <button
                    type="button"
                    onClick={() => removeExperience(exp.id)}
                    disabled={experiences.length <= 1}
                    className="text-slate-400 hover:text-rose-600 disabled:opacity-30"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder={isSo ? 'Magaca Shaqada (Role)' : 'Role / Position'}
                    value={exp.role}
                    onChange={(e) => updateExperience(exp.id, 'role', e.target.value)}
                    className="w-full px-2 py-1 border border-slate-300 rounded text-xs"
                  />
                  <input
                    type="text"
                    placeholder={isSo ? 'Shirkadda (Company)' : 'Company'}
                    value={exp.company}
                    onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                    className="w-full px-2 py-1 border border-slate-300 rounded text-xs"
                  />
                </div>

                <input
                  type="text"
                  placeholder={isSo ? 'Muddada (Tusaale: 2022 — 2024)' : 'Period (e.g. 2022 — 2024)'}
                  value={exp.period}
                  onChange={(e) => updateExperience(exp.id, 'period', e.target.value)}
                  className="w-full px-2 py-1 border border-slate-300 rounded text-xs font-mono"
                />

                <textarea
                  rows={2}
                  placeholder={isSo ? 'Mas\'uuliyadaha iyo waxyaabaha aad qabatay...' : 'Key duties and achievements...'}
                  value={exp.details}
                  onChange={(e) => updateExperience(exp.id, 'details', e.target.value)}
                  className="w-full px-2 py-1 border border-slate-300 rounded text-xs"
                />
              </div>
            ))}
          </div>

          {/* Education Form */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700 uppercase tracking-wider">
                {isSo ? 'Waxbarashada' : 'Education'}
              </span>
              <button
                type="button"
                onClick={addEducation}
                className="text-xs text-[#1E88E5] font-semibold hover:underline inline-flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                {isSo ? 'Kudar Shahaado' : 'Add Degree'}
              </button>
            </div>

            {educations.map((edu, idx) => (
              <div key={edu.id} className="p-3 bg-white border border-slate-200 rounded space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-700">{isSo ? `Heerka #${idx + 1}` : `Degree #${idx + 1}`}</span>
                  <button
                    type="button"
                    onClick={() => removeEducation(edu.id)}
                    disabled={educations.length <= 1}
                    className="text-slate-400 hover:text-rose-600 disabled:opacity-30"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>

                <input
                  type="text"
                  placeholder={isSo ? 'Shahaadada (Degree)' : 'Degree / Field'}
                  value={edu.degree}
                  onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                  className="w-full px-2 py-1 border border-slate-300 rounded text-xs"
                />

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder={isSo ? 'Jaamacadda / Dugsiga' : 'Institution / College'}
                    value={edu.institution}
                    onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                    className="w-full px-2 py-1 border border-slate-300 rounded text-xs"
                  />
                  <input
                    type="text"
                    placeholder={isSo ? 'Sanadka' : 'Year'}
                    value={edu.year}
                    onChange={(e) => updateEducation(edu.id, 'year', e.target.value)}
                    className="w-full px-2 py-1 border border-slate-300 rounded text-xs font-mono"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Skills Form */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
              {isSo ? 'Xirfadaha Muhiimka ah' : 'Core Skills'}
            </span>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="Skill 1, Skill 2, Skill 3..."
              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs focus:outline-none focus:border-[#1E88E5]"
            />
          </div>
        </div>

        {/* Right Column: Live Clean Resume Sheet (Printable Document) */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-xs text-slate-900 print:border-none print:shadow-none print:p-0">
          {/* Header */}
          <div className="border-b-2 border-[#0A2342] pb-4">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0A2342] uppercase">
              {fullName || (isSo ? 'MAGACAAGA BUUXA' : 'YOUR FULL NAME')}
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-[#1E88E5] mt-0.5">
              {jobTitle || (isSo ? 'Cinwaanka Shaqada' : 'Professional Title')}
            </p>

            <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-[11px] text-slate-600 mt-2">
              {email && <span>{email}</span>}
              {phone && <span>· {phone}</span>}
              {location && <span>· {location}</span>}
            </div>
          </div>

          {/* Summary */}
          {summary && (
            <div className="mt-4 pb-3 border-b border-slate-100">
              <h4 className="text-xs font-bold text-[#0A2342] uppercase tracking-wider mb-1">
                {isSo ? 'Hordhac Xirfadeed' : 'Professional Summary'}
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed">{summary}</p>
            </div>
          )}

          {/* Experience */}
          <div className="mt-4 pb-3 border-b border-slate-100">
            <h4 className="text-xs font-bold text-[#0A2342] uppercase tracking-wider mb-2">
              {isSo ? 'Khibradda Shaqada' : 'Work Experience'}
            </h4>
            <div className="space-y-3">
              {experiences.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline text-xs">
                    <span className="font-bold text-slate-900">{exp.role}</span>
                    <span className="text-[11px] font-mono text-slate-500">{exp.period}</span>
                  </div>
                  <span className="text-[11px] text-[#1E88E5] font-medium block">{exp.company}</span>
                  {exp.details && (
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{exp.details}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="mt-4 pb-3 border-b border-slate-100">
            <h4 className="text-xs font-bold text-[#0A2342] uppercase tracking-wider mb-2">
              {isSo ? 'Waxbarashada' : 'Education'}
            </h4>
            <div className="space-y-2">
              {educations.map((edu) => (
                <div key={edu.id} className="flex justify-between items-baseline text-xs">
                  <div>
                    <span className="font-bold text-slate-900 block">{edu.degree}</span>
                    <span className="text-[11px] text-slate-600">{edu.institution}</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">{edu.year}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          {skills && (
            <div className="mt-4">
              <h4 className="text-xs font-bold text-[#0A2342] uppercase tracking-wider mb-1.5">
                {isSo ? 'Xirfadaha' : 'Skills & Competencies'}
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {skills}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
