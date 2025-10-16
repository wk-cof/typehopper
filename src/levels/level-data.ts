import { Animal, getAnimalByEnglishName } from '../utils/animal-dictionary';

export interface LevelDefinition {
  id: number;
  title: string;
  description: string;
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
    title: 'Forest Friends',
    description: 'Quick three to four letter words to get you hopping.',
    animals: animalsFromNames(['hedgehog', 'lion', 'wolf']),
    baseLetterSpeed: 120,
    speedIncrement: 10,
    backgroundVariant: 1,
    mapPosition: { x: 110, y: 300 },
    badgeEmoji: '🌱',
  },
  {
    id: 1,
    title: 'Twilight Trees',
    description: 'Slightly longer names to warm up your paws.',
    animals: animalsFromNames(['fox', 'owl', 'hare']),
    baseLetterSpeed: 130,
    speedIncrement: 15,
    backgroundVariant: 2,
    mapPosition: { x: 220, y: 220 },
    badgeEmoji: '🌲',
  },
  {
    id: 2,
    title: 'Jungle Breeze',
    description: 'Medium-length words that test your rhythm.',
    animals: animalsFromNames(['iguana', 'rabbit', 'jellyfish']),
    baseLetterSpeed: 150,
    speedIncrement: 15,
    backgroundVariant: 3,
    mapPosition: { x: 340, y: 160 },
    badgeEmoji: '🍃',
  },
  {
    id: 3,
    title: 'Polar Gusts',
    description: 'Seven-letter tongue twisters from chilly biomes.',
    animals: animalsFromNames(['penguin', 'rhinoceros', 'sloth']),
    baseLetterSpeed: 165,
    speedIncrement: 20,
    backgroundVariant: 4,
    mapPosition: { x: 470, y: 220 },
    badgeEmoji: '❄️',
  },
  {
    id: 4,
    title: 'Desert Storm',
    description: 'Eight-letter critters, stay focused!',
    animals: animalsFromNames(['scorpion', 'crocodile', 'turtle']),
    baseLetterSpeed: 180,
    speedIncrement: 20,
    backgroundVariant: 1,
    mapPosition: { x: 600, y: 150 },
    badgeEmoji: '🏜️',
  },
  {
    id: 5,
    title: 'Savanna Sunrise',
    description: 'The longest names—finish the journey!',
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
