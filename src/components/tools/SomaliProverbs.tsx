import React, { useState } from 'react';
import { Language } from '../../types';
import { Search, Copy, Check, Sparkles, BookOpen } from 'lucide-react';

interface Props {
  language: Language;
}

interface ProverbItem {
  id: string;
  somali: string;
  english: string;
  meaningSo: string;
  meaningEn: string;
  category: string;
}

const PROVERBS: ProverbItem[] = [
  {
    id: '1',
    somali: 'Nin wax garanayaa talo ma daayo, kii aan wax garanayna talo ma qaato.',
    english: 'A wise person never stops seeking counsel; an ignorant person never takes it.',
    meaningSo: 'Qofka caqliga lihi markasta wuxuu la tashadaa dadka kale, halka kan jaahilka ahi is bidayo.',
    meaningEn: 'Wisdom lies in consulting others and being humble enough to listen.',
    category: 'Cilmi & Xikmad',
  },
  {
    id: '2',
    somali: 'Far keliya fool ma dhaqdo.',
    english: 'A single finger cannot wash a face.',
    meaningSo: 'Qof kaliya ma wada qaban karo howlo waaweyn; wadajirka iyo gacmo wadaagga ayaa wax lagu gaaraa.',
    meaningEn: 'Cooperation and teamwork are essential for accomplishing meaningful goals.',
    category: 'Wadajir & Nabad',
  },
  {
    id: '3',
    somali: 'Biyo sacabadaada ayaa looga dhergaa.',
    english: 'You can only quench your thirst with water cupped in your own hands.',
    meaningSo: 'Isku-tashiga ayaa wax kasta ka qiimo badan; ha ku tiirsanaan wax dad kale kuu qabtaan.',
    meaningEn: 'Self-reliance and personal effort yield true, lasting satisfaction.',
    category: 'Samir & Dadaal',
  },
  {
    id: '4',
    somali: 'Ganacsi aan xisaab lahayni, waa geel aan xeradiisii la ogeyn.',
    english: 'Business without proper bookkeeping is like camels wandering without an enclosure.',
    meaningSo: 'Ganacsiga guuleystaa wuxuu ku dhisan yahay qoraal sax ah, dabagal dakhli iyo kharash la hubiyo.',
    meaningEn: 'Diligent financial accounting and inventory records are the backbone of sustainable commerce.',
    category: 'Ganacsi & Xoolo',
  },
  {
    id: '5',
    somali: 'Nin daad qaaday xumbo cuskay.',
    english: 'A drowning person reaches even for foam.',
    meaningSo: 'Qofka dhibtu haysato wuxuu miciin bidaa wax kasta xitaa haddii aysan waxba u tarayn.',
    meaningEn: 'A desperate individual will grasp at any fragile chance of survival or solution.',
    category: 'Samir & Dadaal',
  },
  {
    id: '6',
    somali: 'Runi ama ku noolaysaa ama ku dishaa.',
    english: 'The truth will either sustain your life or bring your doom.',
    meaningSo: 'Xaqa iyo runtu waa lama huraan, qofka run sheegaana wuu badbaadaa mustaqbalka.',
    meaningEn: 'Honesty is non-negotiable; truthfulness carries absolute consequence.',
    category: 'Run & Cadaalad',
  },
  {
    id: '7',
    somali: 'Geel duqowday ma laha, qof daalana lama yiraahdo.',
    english: 'Camels have endless resilience; a hardworking human should never be dismissed.',
    meaningSo: 'Dadaalka iyo khibraddu marnaba ma duugoobaan; qofka hawl-karka ahi markasta waa la qiimeeyaa.',
    meaningEn: 'Endurance, diligence, and experience never lose their value.',
    category: 'Samir & Dadaal',
  },
  {
    id: '8',
    somali: 'Nin kaa fadhiya waxba kuuma taro, nin kula hadlana waxba kama fogaatid.',
    english: 'An inactive person brings no benefit; an engaging conversationalist is always close.',
    meaningSo: 'Dhaqdhaqaaqa iyo xiriirka wanaagsan ee dadka ayaa nolosha iyo shaqada hormariya.',
    meaningEn: 'Proactivity and transparent communication foster productive relationships.',
    category: 'Cilmi & Xikmad',
  },
  {
    id: '9',
    somali: 'Gacmo wadajir bay wax ku gooyaan.',
    english: 'Hands together can cut through anything.',
    meaningSo: 'Isku-duubnidu waxay awood u leedahay inay ka guuleysato dhibaato kasta.',
    meaningEn: 'Collective strength triumphs over individual limitations.',
    category: 'Wadajir & Nabad',
  },
  {
    id: '10',
    somali: 'Hal libaax aragtay ma godol baa?',
    english: 'Will a she-camel that has seen a lion let down her milk?',
    meaningSo: 'Qofka cabsi ama qalqal ku jiro ma soo saari karo natiijo buuxda.',
    meaningEn: 'Peace of mind and security are prerequisites for productivity.',
    category: 'Wadajir & Nabad',
  },
  {
    id: '11',
    somali: 'Aqal libaax lafo ma waayo.',
    english: 'A lion’s den is never devoid of bones.',
    meaningSo: 'Qofka kartida iyo dadaalka leh meel kasta oo uu joogo ma waayo wax-soo-saar iyo guul.',
    meaningEn: 'True ability and initiative inevitably produce evidence of success.',
    category: 'Ganacsi & Xoolo',
  },
  {
    id: '12',
    somali: 'Beeni raad ma laha.',
    english: 'A lie leaves no durable footprints.',
    meaningSo: 'Beentu muddo gaaban ayey shaqeysaa, laakiin runta ayaa ugu dambeyn daaha ka qaadaysa.',
    meaningEn: 'Falsehood is transient; truth inevitably outlasts deception.',
    category: 'Run & Cadaalad',
  },
];

export const SomaliProverbs: React.FC<Props> = ({ language }) => {
  const isSo = language === 'so';

  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [randomProverb, setRandomProverb] = useState<ProverbItem>(PROVERBS[0]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    'All',
    'Ganacsi & Xoolo',
    'Samir & Dadaal',
    'Run & Cadaalad',
    'Wadajir & Nabad',
    'Cilmi & Xikmad',
  ];

  const filtered = PROVERBS.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesQuery =
      p.somali.toLowerCase().includes(query.toLowerCase()) ||
      p.english.toLowerCase().includes(query.toLowerCase()) ||
      p.meaningSo.toLowerCase().includes(query.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const pickRandom = () => {
    const idx = Math.floor(Math.random() * PROVERBS.length);
    setRandomProverb(PROVERBS[idx]);
  };

  const handleCopy = (p: ProverbItem) => {
    const text = `"${p.somali}"\n— ${isSo ? p.meaningSo : p.meaningEn}`;
    navigator.clipboard.writeText(text);
    setCopiedId(p.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Featured Proverb Card */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#1E88E5] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            {isSo ? 'Xikmadda & Maahmaahda Doorka ah' : 'Featured Wisdom & Proverb'}
          </span>
          <button
            onClick={pickRandom}
            className="text-xs text-slate-600 hover:text-[#0A2342] font-medium underline"
          >
            {isSo ? 'Mid kale soo saar' : 'Pick another'}
          </button>
        </div>

        <blockquote className="text-base sm:text-lg font-bold text-[#0A2342] leading-snug">
          "{randomProverb.somali}"
        </blockquote>
        <p className="text-xs text-slate-600 mt-2 leading-relaxed">
          <strong>{isSo ? 'Dulucda:' : 'Meaning:'}</strong> {isSo ? randomProverb.meaningSo : randomProverb.meaningEn}
        </p>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={isSo ? 'Baar maahmaahyo, erayo ama xikmado...' : 'Search proverbs or meanings...'}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:border-[#1E88E5]"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1.5 text-xs font-medium rounded whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#0A2342] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'All' ? (isSo ? 'Dhammaan' : 'All') : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Proverbs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="p-4 bg-white border border-slate-200 rounded-lg hover:border-[#1E88E5] transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <span className="text-[10px] font-mono text-slate-400 uppercase">
                  {item.category}
                </span>
                <button
                  onClick={() => handleCopy(item)}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded"
                  title={isSo ? 'Guri maahmaahdan' : 'Copy proverb'}
                >
                  {copiedId === item.id ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              <h4 className="text-sm font-bold text-[#0A2342] leading-snug">
                "{item.somali}"
              </h4>

              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {isSo ? item.meaningSo : item.meaningEn}
              </p>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-400 italic">
              "{item.english}"
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
