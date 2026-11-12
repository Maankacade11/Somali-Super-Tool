import { Category } from '../types';

export const CATEGORIES: Category[] = [
  {
    id: 'ganacsi',
    labelSo: 'Ganacsi',
    labelEn: 'Business',
    descriptionSo: 'Xisaabaadka ganacsiga, qiimaynta faa\'iidada iyo qaansheegyada.',
    descriptionEn: 'Business calculations, profit margins, and invoice generation.',
    icon: 'Briefcase',
  },
  {
    id: 'waxbarasho',
    labelSo: 'Waxbarasho',
    labelEn: 'Education',
    descriptionSo: 'Xisaabinta buundooyinka GPA, tirinta qoraalka iyo beddelaha halbeegyada.',
    descriptionEn: 'GPA calculation, text counting, and unit conversion.',
    icon: 'GraduationCap',
  },
  {
    id: 'shaqo',
    labelSo: 'Shaqo',
    labelEn: 'Work',
    descriptionSo: 'Maareynta hawlaha maalinlaha ah, diirad-saarista Pomodoro iyo qoraalada.',
    descriptionEn: 'Task management, Pomodoro focus timer, and quick notes.',
    icon: 'CheckSquare',
  },
  {
    id: 'maaliyad',
    labelSo: 'Maaliyad',
    labelEn: 'Finance',
    descriptionSo: 'Beddelaha lacagaha, xisaabiyaha amaahda iyo xisaabinta sakada.',
    descriptionEn: 'Currency conversions, loan installments, and Zakat calculation.',
    icon: 'Coins',
  },
  {
    id: 'nolol',
    labelSo: 'Nolol Maalmeed',
    labelEn: 'Daily Life',
    descriptionSo: 'Taariikhda Hijriga/Miilaadiga, da\'da, furayaasha sirta ah iyo QR Code.',
    descriptionEn: 'Hijri/Gregorian dates, age calculation, passwords, and QR codes.',
    icon: 'Compass',
  },
  {
    id: 'qoraal',
    labelSo: 'Qoraal',
    labelEn: 'Writing',
    descriptionSo: 'Beddelaha xarfaha qoraalka, isbarbardhiga qoraallada iyo higgaadda.',
    descriptionEn: 'Text case formatting, diff comparator, and Somali spelling references.',
    icon: 'FileText',
  },
];
