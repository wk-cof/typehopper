import {
  Animal,
  getAnimalByEnglishName,
  getAnimalByRussianName,
} from '../utils/animal-dictionary';
import { LanguageCode, LocalizedText } from '../utils/localization';

export interface LevelDefinition {
  id: number;
  title: LocalizedText;
  description: LocalizedText;
  animalsByLanguage: Record<LanguageCode, Animal[]>;
  baseLetterSpeed: number;
  speedIncrement: number;
  backgroundVariant: number;
  mapPosition: { x: number; y: number };
  badgeEmoji: string;
}

export function getLevelAnimals(
  level: LevelDefinition,
  language: LanguageCode
): Animal[] {
  return level.animalsByLanguage[language] ?? level.animalsByLanguage.en;
}

function animalsByLanguageFromNames(
  localizedNames: Record<LanguageCode, string[]>
): Record<LanguageCode, Animal[]> {
  return {
    en: localizedNames.en.map(name => {
      const animal = getAnimalByEnglishName(name);
      if (!animal) {
        throw new Error(`Unknown English animal: ${name}`);
      }
      return animal;
    }),
    ru: localizedNames.ru.map(name => {
      const animal = getAnimalByRussianName(name);
      if (!animal) {
        throw new Error(`Unknown Russian animal: ${name}`);
      }
      return animal;
    }),
  };
}

export const LEVELS: LevelDefinition[] = [
  {
    id: 0,
    title: {
      en: 'Forest Friends',
      ru: 'Лесные друзья',
    },
    description: {
      en: 'Quick three to four letter words to get you hopping.',
      ru: 'Быстрые слова из трёх-четырёх букв, чтобы размяться.',
    },
    animalsByLanguage: animalsByLanguageFromNames({
      en: ['fox', 'owl', 'wolf'],
      ru: ['ёж', 'лев', 'волк'],
    }),
    baseLetterSpeed: 120,
    speedIncrement: 10,
    backgroundVariant: 1,
    mapPosition: { x: 220, y: 640 },
    badgeEmoji: '🌱',
  },
  {
    id: 1,
    title: {
      en: 'Twilight Trees',
      ru: 'Сумеречные деревья',
    },
    description: {
      en: 'Slightly longer names to warm up your paws.',
      ru: 'Чуть более длинные слова, чтобы размять лапы.',
    },
    animalsByLanguage: animalsByLanguageFromNames({
      en: ['deer', 'bear', 'zebra'],
      ru: ['лиса', 'сова', 'заяц'],
    }),
    baseLetterSpeed: 130,
    speedIncrement: 15,
    backgroundVariant: 2,
    mapPosition: { x: 255, y: 345 },
    badgeEmoji: '🌲',
  },
  {
    id: 2,
    title: {
      en: 'Jungle Breeze',
      ru: 'Джунглевая прохлада',
    },
    description: {
      en: 'Medium-length words that test your rhythm.',
      ru: 'Слова средней длины, проверяющие ваш ритм.',
    },
    animalsByLanguage: animalsByLanguageFromNames({
      en: ['shark', 'turtle', 'dolphin'],
      ru: ['игуана', 'кролик', 'медуза'],
    }),
    baseLetterSpeed: 150,
    speedIncrement: 15,
    backgroundVariant: 3,
    mapPosition: { x: 533, y: 240 },
    badgeEmoji: '🍃',
  },
  {
    id: 3,
    title: {
      en: 'Polar Gusts',
      ru: 'Полярные порывы',
    },
    description: {
      en: 'Seven-letter tongue twisters from chilly biomes.',
      ru: 'Семибуквенные скороговорки из холодных краёв.',
    },
    animalsByLanguage: animalsByLanguageFromNames({
      en: ['penguin', 'reindeer', 'narwhal'],
      ru: ['пингвин', 'носорог', 'ленивец'],
    }),
    baseLetterSpeed: 165,
    speedIncrement: 20,
    backgroundVariant: 4,
    mapPosition: { x: 571, y: 480 },
    badgeEmoji: '❄️',
  },
  {
    id: 4,
    title: {
      en: 'Desert Storm',
      ru: 'Пустынная буря',
    },
    description: {
      en: 'Eight-letter critters, stay focused!',
      ru: 'Восьмибуквенные создания — сохраняйте концентрацию!',
    },
    animalsByLanguage: animalsByLanguageFromNames({
      en: ['camel', 'fennec', 'lizard'],
      ru: ['скорпион', 'крокодил', 'черепаха'],
    }),
    baseLetterSpeed: 180,
    speedIncrement: 20,
    backgroundVariant: 1,
    mapPosition: { x: 845, y: 290 },
    badgeEmoji: '🏜️',
  },
  {
    id: 5,
    title: {
      en: 'Savanna Sunrise',
      ru: 'Рассвет саванны',
    },
    description: {
      en: 'The longest names—finish the journey!',
      ru: 'Самые длинные имена — доведите путешествие до конца!',
    },
    animalsByLanguage: animalsByLanguageFromNames({
      en: ['elephant', 'giraffe', 'wildebeest'],
      ru: ['орангутан', 'гиппопотам', 'шимпанзе'],
    }),
    baseLetterSpeed: 195,
    speedIncrement: 25,
    backgroundVariant: 2,
    mapPosition: { x: 925, y: 590 },
    badgeEmoji: '🌅',
  },
];

export function getLevelById(id: number): LevelDefinition {
  const level = LEVELS.find(l => l.id === id);
  if (!level) {
    throw new Error(`Unknown level id ${id}`);
  }
  return level;
}
