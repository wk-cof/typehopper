type LanguageMap = Record<string, string>;

export type LanguageCode = 'en' | 'ru';

const LANGUAGE_STORAGE_KEY = 'typehopper-language';
const DEFAULT_LANGUAGE: LanguageCode = 'en';

export type LocalizedText = Partial<Record<LanguageCode, string>> & {
  en: string;
};

const translations: Record<LanguageCode, LanguageMap> = {
  en: {
    'ui.levelMap.title': 'Level Map',
    'ui.levelMap.lockedHint': 'Complete previous levels to unlock.',
    'ui.levelMap.unlockedHint': 'Click to begin!',
    'ui.languageToggle.label': 'Language',
    'ui.languageToggle.english': 'English',
    'ui.languageToggle.russian': 'Russian',
    'ui.game.levelComplete': 'Level Complete!',
    'ui.game.greatJob': 'Great job!',
    'ui.game.start': 'Start Game',
    'ui.game.levelLabel': 'Level {levelNumber}: {levelTitle} ({stage}/{totalStages})',
    'ui.game.score': 'Score: {score}',
    'ui.levelMap.levelNumber': '#{levelNumber}',
    'ui.dialog.confirmExit': 'Leave level and return to map?',
    'ui.dialog.confirm': 'Confirm',
    'ui.dialog.cancel': 'Cancel',
  },
  ru: {
    'ui.levelMap.title': 'Карта уровней',
    'ui.levelMap.lockedHint': 'Пройдите предыдущие уровни, чтобы открыть.',
    'ui.levelMap.unlockedHint': 'Нажмите, чтобы начать!',
    'ui.languageToggle.label': 'Язык',
    'ui.languageToggle.english': 'Английский',
    'ui.languageToggle.russian': 'Русский',
    'ui.game.levelComplete': 'Уровень пройден!',
    'ui.game.greatJob': 'Отлично!',
    'ui.game.start': 'Начать игру',
    'ui.game.levelLabel': 'Уровень {levelNumber}: {levelTitle} ({stage}/{totalStages})',
    'ui.game.score': 'Счёт: {score}',
    'ui.levelMap.levelNumber': '№{levelNumber}',
    'ui.dialog.confirmExit': 'Выйти из уровня и вернуться на карту?',
    'ui.dialog.confirm': 'Подтвердить',
    'ui.dialog.cancel': 'Отмена',
  },
};

export type TranslationKey = keyof typeof translations.en;

type TranslationListener = (language: LanguageCode) => void;

const listeners = new Set<TranslationListener>();

let activeLanguage: LanguageCode = loadStoredLanguage();

function loadStoredLanguage(): LanguageCode {
  if (typeof window === 'undefined' || !window.localStorage) {
    return DEFAULT_LANGUAGE;
  }

  const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (stored && isLanguageCode(stored)) {
    return stored;
  }

  return DEFAULT_LANGUAGE;
}

function persistLanguage(language: LanguageCode): void {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }

  window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
}

function isLanguageCode(value: string): value is LanguageCode {
  return value === 'en' || value === 'ru';
}

function formatTemplate(template: string, params?: Record<string, string | number>): string {
  if (!params) {
    return template;
  }

  return template.replace(/\{(\w+)\}/g, (match, key) => {
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      const replacement = params[key];
      return replacement != null ? String(replacement) : '';
    }
    return match;
  });
}

export function translate(key: TranslationKey, params?: Record<string, string | number>): string {
  const byLanguage = translations[activeLanguage] ?? translations[DEFAULT_LANGUAGE];
  const fallbackLanguage = translations[DEFAULT_LANGUAGE];
  const template = byLanguage[key] ?? fallbackLanguage[key] ?? key;

  return formatTemplate(template, params);
}

export function getLanguage(): LanguageCode {
  return activeLanguage;
}

export function setLanguage(language: LanguageCode): void {
  if (language === activeLanguage) {
    return;
  }

  activeLanguage = language;
  persistLanguage(language);
  listeners.forEach(listener => listener(language));
}

export function toggleLanguage(): void {
  setLanguage(activeLanguage === 'en' ? 'ru' : 'en');
}

export function onLanguageChange(listener: TranslationListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getSupportedLanguages(): LanguageCode[] {
  return Object.keys(translations) as LanguageCode[];
}

export function getLanguageLabel(language: LanguageCode): string {
  const key =
    language === 'en' ? 'ui.languageToggle.english' : 'ui.languageToggle.russian';
  const current = translations[activeLanguage]?.[key];
  return current ?? translations[DEFAULT_LANGUAGE][key];
}

export function registerAdditionalTranslations(
  language: LanguageCode,
  values: Record<string, string>
): void {
  translations[language] = {
    ...translations[language],
    ...values,
  };
}

export function translateText(value: LocalizedText): string {
  const current = value[activeLanguage];
  if (current) {
    return current;
  }
  return value.en;
}
