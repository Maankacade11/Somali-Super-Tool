import React, { useEffect } from 'react';
import { Tool, Language, Category } from '../types';
import { X, Star, ExternalLink, Bookmark } from 'lucide-react';

// Tool components
import { ProfitCalculator } from './tools/ProfitCalculator';
import { InvoiceGenerator } from './tools/InvoiceGenerator';
import { ExpenseSplitter } from './tools/ExpenseSplitter';
import { GpaCalculator } from './tools/GpaCalculator';
import { WordCounter } from './tools/WordCounter';
import { UnitConverter } from './tools/UnitConverter';
import { DailyTasks } from './tools/DailyTasks';
import { PomodoroTimer } from './tools/PomodoroTimer';
import { QuickNotepad } from './tools/QuickNotepad';
import { CurrencyConverter } from './tools/CurrencyConverter';
import { LoanCalculator } from './tools/LoanCalculator';
import { ZakatCalculator } from './tools/ZakatCalculator';
import { DateConverter } from './tools/DateConverter';
import { AgeCalculator } from './tools/AgeCalculator';
import { PasswordGenerator } from './tools/PasswordGenerator';
import { QrGenerator } from './tools/QrGenerator';
import { CaseConverter } from './tools/CaseConverter';
import { TextDiff } from './tools/TextDiff';
import { SomaliGlossary } from './tools/SomaliGlossary';
import { CvBuilder } from './tools/CvBuilder';
import { SalaryCalculator } from './tools/SalaryCalculator';
import { RemittanceEstimator } from './tools/RemittanceEstimator';
import { ScientificCalculator } from './tools/ScientificCalculator';
import { BmiCalculator } from './tools/BmiCalculator';
import { WorldClock } from './tools/WorldClock';
import { PrayerTimes } from './tools/PrayerTimes';
import { InheritanceCalculator } from './tools/InheritanceCalculator';
import { UssdBuilder } from './tools/UssdBuilder';
import { ConstructionEstimator } from './tools/ConstructionEstimator';
import { FuelCalculator } from './tools/FuelCalculator';
import { SomaliProverbs } from './tools/SomaliProverbs';
import { WaterTracker } from './tools/WaterTracker';
import { MealPlanner } from './tools/MealPlanner';
import { BloodPressureGuide } from './tools/BloodPressureGuide';
import { WalkingCalculator } from './tools/WalkingCalculator';
import { SleepCalculator } from './tools/SleepCalculator';
import { TasbeehCounter } from './tools/TasbeehCounter';

interface Props {
  tool: Tool | null;
  category: Category | undefined;
  language: Language;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export const ToolWorkbenchModal: React.FC<Props> = ({
  tool,
  category,
  language,
  onClose,
  isFavorite,
  onToggleFavorite,
}) => {
  const isSo = language === 'so';

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (tool) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [tool, onClose]);

  if (!tool) return null;

  const renderToolBody = () => {
    switch (tool.id) {
      case 'profit-calc':
        return <ProfitCalculator language={language} />;
      case 'invoice-gen':
        return <InvoiceGenerator language={language} />;
      case 'expense-split':
        return <ExpenseSplitter language={language} />;
      case 'salary-calc':
        return <SalaryCalculator language={language} />;
      case 'ussd-builder':
        return <UssdBuilder language={language} />;
      case 'construction-calc':
        return <ConstructionEstimator language={language} />;
      case 'gpa-calc':
        return <GpaCalculator language={language} />;
      case 'scientific-calc':
        return <ScientificCalculator language={language} />;
      case 'word-counter':
        return <WordCounter language={language} />;
      case 'unit-converter':
        return <UnitConverter language={language} />;
      case 'cv-builder':
        return <CvBuilder language={language} />;
      case 'daily-tasks':
        return <DailyTasks language={language} />;
      case 'pomodoro-timer':
        return <PomodoroTimer language={language} />;
      case 'quick-notepad':
        return <QuickNotepad language={language} />;
      case 'currency-converter':
        return <CurrencyConverter language={language} />;
      case 'remittance-calc':
        return <RemittanceEstimator language={language} />;
      case 'loan-calc':
        return <LoanCalculator language={language} />;
      case 'zakat-calc':
        return <ZakatCalculator language={language} />;
      case 'inheritance-calc':
        return <InheritanceCalculator language={language} />;
      case 'prayer-times':
        return <PrayerTimes language={language} />;
      case 'date-converter':
        return <DateConverter language={language} />;
      case 'world-clock':
        return <WorldClock language={language} />;
      case 'fuel-calc':
        return <FuelCalculator language={language} />;
      case 'bmi-calc':
        return <BmiCalculator language={language} />;
      case 'age-calc':
        return <AgeCalculator language={language} />;
      case 'password-gen':
        return <PasswordGenerator language={language} />;
      case 'qr-gen':
        return <QrGenerator language={language} />;
      case 'case-converter':
        return <CaseConverter language={language} />;
      case 'text-diff':
        return <TextDiff language={language} />;
      case 'somali-proverbs':
        return <SomaliProverbs language={language} />;
      case 'somali-glossary':
        return <SomaliGlossary language={language} />;
      case 'water-tracker':
        return <WaterTracker language={language} />;
      case 'meal-planner':
        return <MealPlanner language={language} />;
      case 'blood-pressure':
        return <BloodPressureGuide language={language} />;
      case 'walking-calc':
        return <WalkingCalculator language={language} />;
      case 'sleep-calc':
        return <SleepCalculator language={language} />;
      case 'tasbeeh-counter':
        return <TasbeehCounter language={language} />;
      default:
        return <div>Tool not found</div>;
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-white shrink-0">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-0.5">
              <span>{isSo ? category?.labelSo : category?.labelEn}</span>
              <span>/</span>
              <span className="text-[#1E88E5] font-medium">{isSo ? 'Qalab Shaqeynaya' : 'Active Tool'}</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-[#0A2342]">
              {isSo ? tool.nameSo : tool.nameEn}
            </h3>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onToggleFavorite(tool.id)}
              className={`p-2 rounded hover:bg-slate-100 transition-colors ${
                isFavorite ? 'text-amber-500' : 'text-slate-400'
              }`}
              title={isFavorite ? (isSo ? 'Ka saar kuwa aad jeceshahay' : 'Remove favorite') : (isSo ? 'Ku dar kuwa aad jeceshahay' : 'Add favorite')}
            >
              <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-500' : ''}`} />
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors"
              title={isSo ? 'Xir (Esc)' : 'Close (Esc)'}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Description Banner */}
        <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-200 text-xs text-slate-600 shrink-0">
          {isSo ? tool.descriptionSo : tool.descriptionEn}
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 bg-white">
          {renderToolBody()}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            <span>{isSo ? 'Qalab Offline ah • Ammaan' : 'Offline Ready • 100% Private'}</span>
          </div>

          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-100 transition-colors"
          >
            {isSo ? 'Xir' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
