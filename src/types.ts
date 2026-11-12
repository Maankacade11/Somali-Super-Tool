export type Language = 'so' | 'en';

export type CategoryId = 'ganacsi' | 'waxbarasho' | 'shaqo' | 'maaliyad' | 'nolol' | 'qoraal';

export interface Category {
  id: CategoryId;
  labelSo: string;
  labelEn: string;
  descriptionSo: string;
  descriptionEn: string;
  icon: string;
}

export interface Tool {
  id: string;
  nameSo: string;
  nameEn: string;
  descriptionSo: string;
  descriptionEn: string;
  category: CategoryId;
  icon: string;
  tagsSo: string[];
  tagsEn: string[];
  isPopular?: boolean;
}

export interface AppSettings {
  language: Language;
  defaultCurrency: 'USD' | 'SOS' | 'EUR' | 'KES' | 'AED';
  compactMode: boolean;
}
