import { Animal, getAnimalByEnglishName } from '../utils/animal-dictionary';
import { LocalizedText } from '../utils/localization';

export interface LevelDefinition {
  id: number;
  title: LocalizedText;
  description: LocalizedText;
  animals: Animal[];
  baseLetterSpeed: number;
  speedIncrement: number;
  backgroundVariant: number;
  mapPosition: { x: number; y: number };
  badgeEmoji: string;
}

function animalsFromNames(names: string[]): Animal[] {
  return names.map(name => {
    const animal = getAnimalByEnglishName(name);
    if (!animal) {
      throw new Error(`Unknown animal: ${name}`);
    }
    return animal;
  });
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
    animals: animalsFromNames(['hedgehog', 'lion', 'wolf']),
    baseLetterSpeed: 120,
    speedIncrement: 10,
    backgroundVariant: 1,
    mapPosition: { x: 110, y: 300 },
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
    animals: animalsFromNames(['fox', 'owl', 'hare']),
    baseLetterSpeed: 130,
    speedIncrement: 15,
    backgroundVariant: 2,
    mapPosition: { x: 220, y: 220 },
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
    animals: animalsFromNames(['iguana', 'rabbit', 'jellyfish']),
    baseLetterSpeed: 150,
    speedIncrement: 15,
    backgroundVariant: 3,
    mapPosition: { x: 340, y: 160 },
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
    animals: animalsFromNames(['penguin', 'rhinoceros', 'sloth']),
    baseLetterSpeed: 165,
    speedIncrement: 20,
    backgroundVariant: 4,
    mapPosition: { x: 470, y: 220 },
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
    animals: animalsFromNames(['scorpion', 'crocodile', 'turtle']),
    baseLetterSpeed: 180,
    speedIncrement: 20,
    backgroundVariant: 1,
    mapPosition: { x: 600, y: 150 },
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
    animals: animalsFromNames(['orangutan', 'hippopotamus', 'chimpanzee']),
    baseLetterSpeed: 195,
    speedIncrement: 25,
    backgroundVariant: 2,
    mapPosition: { x: 710, y: 230 },
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
