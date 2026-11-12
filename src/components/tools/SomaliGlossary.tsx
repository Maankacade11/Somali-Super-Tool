import React, { useState } from 'react';
import { Language } from '../../types';
import { Search, Copy, Check, BookOpen } from 'lucide-react';

interface Props {
  language: Language;
}

interface TermItem {
  somali: string;
  english: string;
  category: string;
  definitionSo: string;
  definitionEn: string;
}

const GLOSSARY_TERMS: TermItem[] = [
  {
    somali: 'Qaansheeg',
    english: 'Invoice',
    category: 'Ganacsi',
    definitionSo: 'Warqad faahfaahinaysa badeecada ama adeegga la iibiyay iyo lacagta laga rabo macmiilka.',
    definitionEn: 'A commercial document detailing products or services delivered and payment due.',
  },
  {
    somali: 'Rasiid',
    english: 'Receipt',
    category: 'Ganacsi',
    definitionSo: 'Caddayn qoraal ah oo muujinaysa in lacagtii la bixiyay lana guddoomay.',
    definitionEn: 'Written acknowledgment that a specified payment has been received.',
  },
  {
    somali: 'Faa\'iido Saafi ah',
    english: 'Net Profit',
    category: 'Ganacsi',
    definitionSo: 'Dakhliga soo haray marka laga jaro dhammaan kharashaadka ganacsiga.',
    definitionEn: 'The actual profit remaining after subtracting all business expenses and taxes.',
  },
  {
    somali: 'Dakhli Guud',
    english: 'Gross Revenue',
    category: 'Ganacsi',
    definitionSo: 'Isu-geynta guud ee dhammaan lacagaha ka soo xarooday iibka badeecada ama adeegga.',
    definitionEn: 'The total amount of money brought in by the company’s operations before deductions.',
  },
  {
    somali: 'Xisaab-xir',
    english: 'Financial Audit / Closing',
    category: 'Maamul',
    definitionSo: 'Dib-u-eegis iyo xaqiijin rasmi ah oo lagu sameeyo diiwaannada maaliyadeed ee muddada dhammaatay.',
    definitionEn: 'Official inspection and settlement of financial accounts for a given fiscal period.',
  },
  {
    somali: 'Amaah / Dayn',
    english: 'Debt / Loan',
    category: 'Maaliyad',
    definitionSo: 'Hanti ama lacag qof ama hay\'ad laga soo amaahday oo waqti cayiman dib loo celinayo.',
    definitionEn: 'Money borrowed by one party from another with agreed repayment terms.',
  },
  {
    somali: 'Maalgelin',
    english: 'Investment',
    category: 'Maaliyad',
    definitionSo: 'Gelinta hanti ama raasamaal mashruuc iyada oo laga filayo faa\'iido mustaqbalka.',
    definitionEn: 'Allocating capital to assets or business ventures with the expectation of generating income.',
  },
  {
    somali: 'Murabaxo',
    english: 'Cost-Plus Financing (Murabaha)',
    category: 'Maaliyad',
    definitionSo: 'Heshiis iib Islaami ah oo bangigu ku iibiyo badeecad isaga oo macaashka ku daraya qiimihii uu ku soo iibsaday.',
    definitionEn: 'Islamic financing structure where the seller discloses cost and markup profit openly.',
  },
  {
    somali: 'Kayd-xogeed',
    english: 'Database',
    category: 'IT & Farsamo',
    definitionSo: 'Hab habaysan oo kombiyuutarka loogu keydiyo xog tiro badan si fududna loogu baarto.',
    definitionEn: 'An organized collection of structured data stored electronically in a computer system.',
  },
  {
    somali: 'Barnaamij-Sameeye',
    english: 'Software Developer / Programmer',
    category: 'IT & Farsamo',
    definitionSo: 'Qofka qora koodhka lagu dhiso barnaamijyada, shabakadaha iyo abka taleefannada.',
    definitionEn: 'A specialist who creates and programs software applications and systems.',
  },
  {
    somali: 'Fure Sir ah',
    english: 'Password / Passcode',
    category: 'IT & Farsamo',
    definitionSo: 'Xuruuf iyo calaamado gaar ah oo loo adeegsado ilaalinta amniga xogta qofka ama koontada.',
    definitionEn: 'A secret sequence of characters used to confirm identity and access secure systems.',
  },
  {
    somali: 'Shabakad',
    english: 'Network / Website',
    category: 'IT & Farsamo',
    definitionSo: 'Nidaam isku xira kombiyuutarro ama aalado kala duwan si ay xogta u wadaagaan.',
    definitionEn: 'Interconnected systems or platforms that exchange data and communication.',
  },
  {
    somali: 'Celcelis (GPA)',
    english: 'Grade Point Average',
    category: 'Waxbarasho',
    definitionSo: 'Tirada lagu cabbiro heerka guud ee natiijada ardaygu ka gaaray dhammaan maaddooyinka uu bartay.',
    definitionEn: 'A calculated average score of letter grades earned by a student across coursework.',
  },
  {
    somali: 'Saacad-barasho',
    english: 'Credit Hour',
    category: 'Waxbarasho',
    definitionSo: 'Halbeeg lagu qiyaaso waqtiga iyo miisaanka maaddo jaamacadeed leedahay toddobaad kasta.',
    definitionEn: 'Unit that measures the weekly instructional time or workload of a university course.',
  },
];

export const SomaliGlossary: React.FC<Props> = ({ language }) => {
  const isSo = language === 'so';

  const [query, setQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('All');
  const [copiedTerm, setCopiedTerm] = useState<string | null>(null);

  const categories = ['All', 'Ganacsi', 'Maaliyad', 'IT & Farsamo', 'Waxbarasho', 'Maamul'];

  const filtered = GLOSSARY_TERMS.filter((term) => {
    const matchesCat = selectedCat === 'All' || term.category === selectedCat;
    const matchesQuery =
      term.somali.toLowerCase().includes(query.toLowerCase()) ||
      term.english.toLowerCase().includes(query.toLowerCase()) ||
      term.definitionSo.toLowerCase().includes(query.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTerm(text);
    setTimeout(() => setCopiedTerm(null), 2000);
  };

  return (
    <div className="space-y-5">
      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={isSo ? 'Baar eray-bixinnada (Soomaali ama Ingiriisi)...' : 'Search terms in Somali or English...'}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:border-[#1E88E5]"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto pb-1">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCat(c)}
              className={`px-2.5 py-1.5 text-xs font-medium rounded whitespace-nowrap transition-colors ${
                selectedCat === c ? 'bg-[#0A2342] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c === 'All' ? (isSo ? 'Dhammaan' : 'All') : c}
            </button>
          ))}
        </div>
      </div>

      {/* Terms List */}
      <div className="space-y-2.5 max-h-96 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500">
            {isSo ? 'Wax eray ah oo ku habboon baaritaankaaga lama helin.' : 'No matching terms found.'}
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.somali}
              className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h5 className="text-sm font-bold text-[#0A2342]">{item.somali}</h5>
                    <span className="text-xs text-slate-400">/</span>
                    <span className="text-xs font-medium text-slate-600">{item.english}</span>
                  </div>
                  <span className="text-[11px] text-slate-500 mt-0.5 block">
                    {isSo ? item.definitionSo : item.definitionEn}
                  </span>
                </div>

                <button
                  onClick={() => handleCopy(`${item.somali} (${item.english}): ${isSo ? item.definitionSo : item.definitionEn}`)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 bg-white border border-slate-200 rounded shrink-0"
                  title={isSo ? 'Guri eraygan' : 'Copy term'}
                >
                  {copiedTerm?.includes(item.somali) ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
