export class Animal {
  public en: string;
  public ru: string;
  public emoji: string;
  public sound: string;
  constructor(en: string, ru: string, emoji: string, sound: string) {
    this.en = en;
    this.ru = ru;
    this.emoji = emoji;
    this.sound = sound;
  }
}

export class Habitat {
  public en: string;
  public ru: string;
  public emoji: string;
  public animals: Animal[];
  constructor(en: string, ru: string, emoji: string, animals: Animal[]) {
    this.en = en;
    this.ru = ru;
    this.emoji = emoji;
    this.animals = animals;
  }
}

interface HabitatInfo {
  en: string;
  ru: string;
  emoji: string;
}

interface AnimalInfo {
  en: string;
  ru: string;
  emoji: string;
}

export const animals: Record<string, AnimalInfo[]> = {
  jungle: [
    { en: 'jaguar', ru: 'ягуар', emoji: '🐆' },
    { en: 'gorilla', ru: 'горилла', emoji: '🦍' },
    { en: 'toucan', ru: 'тукан', emoji: '🐦' },
    { en: 'orangutan', ru: 'орангутан', emoji: '🦧' },
    { en: 'macaw', ru: 'макао', emoji: '🦜' },
    { en: 'sloth', ru: 'ленивец', emoji: '🦥' },
    { en: 'chimpanzee', ru: 'шимпанзе', emoji: '🐵' },
    { en: 'anaconda', ru: 'анаконда', emoji: '🐍' },
    { en: 'piranha', ru: 'пиранья', emoji: '🐟' },
    { en: 'iguana', ru: 'игуана', emoji: '🦎' },
  ],
  poles: [
    { en: 'polar bear', ru: 'белый медведь', emoji: '🐻‍❄️' },
    { en: 'penguin', ru: 'пингвин', emoji: '🐧' },
    { en: 'walrus', ru: 'морж', emoji: '🦭' },
    { en: 'arctic fox', ru: 'полярная лиса', emoji: '🦊' },
    { en: 'snowy owl', ru: 'снежная сова', emoji: '🦉' },
    { en: 'arctic hare', ru: 'полярный заяц', emoji: '🐇' },
    { en: 'reindeer', ru: 'северный олень', emoji: '🦌' },
    { en: 'narwhal', ru: 'нарвал', emoji: '🐋' },
    { en: 'seal', ru: 'тюлень', emoji: '🦦' },
    { en: 'beluga whale', ru: 'белуга', emoji: '🐳' },
  ],
  savanna: [
    { en: 'lion', ru: 'лев', emoji: '🦁' },
    { en: 'elephant', ru: 'слон', emoji: '🐘' },
    { en: 'giraffe', ru: 'жираф', emoji: '🦒' },
    { en: 'zebra', ru: 'зебра', emoji: '🦓' },
    { en: 'rhinoceros', ru: 'носорог', emoji: '🦏' },
    { en: 'hippopotamus', ru: 'гиппопотам', emoji: '🦛' },
    { en: 'wildebeest', ru: 'гну', emoji: '🐃' },
    { en: 'cheetah', ru: 'гепард', emoji: '🐆' },
    { en: 'hyena', ru: 'гиена', emoji: '🐺' },
    { en: 'meerkat', ru: 'сурикат', emoji: '🐾' },
  ],
  forest: [
    { en: 'deer', ru: 'олень', emoji: '🦌' },
    { en: 'bear', ru: 'медведь', emoji: '🐻' },
    { en: 'fox', ru: 'лиса', emoji: '🦊' },
    { en: 'squirrel', ru: 'белка', emoji: '🐿️' },
    { en: 'rabbit', ru: 'кролик', emoji: '🐇' },
    { en: 'wolf', ru: 'волк', emoji: '🐺' },
    { en: 'beaver', ru: 'бобр', emoji: '🦫' },
    { en: 'raccoon', ru: 'енот', emoji: '🦝' },
    { en: 'owl', ru: 'сова', emoji: '🦉' },
    { en: 'hedgehog', ru: 'ёж', emoji: '🦔' },
  ],
  sea: [
    { en: 'dolphin', ru: 'дельфин', emoji: '🐬' },
    { en: 'shark', ru: 'акула', emoji: '🦈' },
    { en: 'whale', ru: 'кит', emoji: '🐋' },
    { en: 'octopus', ru: 'осьминог', emoji: '🐙' },
    { en: 'jellyfish', ru: 'медуза', emoji: '🎐' },
    { en: 'turtle', ru: 'черепаха', emoji: '🐢' },
    { en: 'seahorse', ru: 'морской конек', emoji: '🐎' },
    { en: 'starfish', ru: 'морская звезда', emoji: '🌟' },
    { en: 'coral', ru: 'коралл', emoji: '🐚' },
    { en: 'clownfish', ru: 'рыба-клоун', emoji: '🐠' },
  ],
  desert: [
    { en: 'camel', ru: 'верблюд', emoji: '🐪' },
    { en: 'fennec fox', ru: 'фенек', emoji: '🦊' },
    { en: 'scorpion', ru: 'скорпион', emoji: '🦂' },
    { en: 'gila monster', ru: 'хила', emoji: '🦎' },
    { en: 'meerkat', ru: 'сурикат', emoji: '🐾' },
    { en: 'dung beetle', ru: 'жук-навозник', emoji: '🪲' },
    { en: 'frilled lizard', ru: 'ящерица с воротником', emoji: '🦎' },
    { en: 'horned viper', ru: 'рогатая гадюка', emoji: '🐍' },
    { en: 'kangaroo rat', ru: 'кенгурья крыса', emoji: '🐀' },
    { en: 'sand gazelle', ru: 'песчаная газель', emoji: '🦌' },
  ],
  wetlands: [
    { en: 'crocodile', ru: 'крокодил', emoji: '🐊' },
    { en: 'flamingo', ru: 'фламинго', emoji: '🦩' },
    { en: 'alligator', ru: 'аллигатор', emoji: '🐊' },
    { en: 'heron', ru: 'цапля', emoji: '🐦' },
    { en: 'beaver', ru: 'бобр', emoji: '🦫' },
    { en: 'frog', ru: 'лягушка', emoji: '🐸' },
    { en: 'platypus', ru: 'утконос', emoji: '🦆' },
    { en: 'swan', ru: 'лебедь', emoji: '🦢' },
    { en: 'egret', ru: 'цапля-белоголовка', emoji: '🐦' },
    { en: 'water snake', ru: 'водяная змея', emoji: '🐍' },
  ],
};

const habitatNames: Record<string, HabitatInfo> = {
  jungle: { en: 'jungle', ru: 'джунгли', emoji: '🌴' },
  poles: { en: 'poles', ru: 'полюса', emoji: '❄️' },
  savanna: { en: 'savanna', ru: 'саванна', emoji: '🌾' },
  forest: { en: 'forest', ru: 'лес', emoji: '🌲' },
  sea: { en: 'sea', ru: 'море', emoji: '🌊' },
  desert: { en: 'desert', ru: 'пустыня', emoji: '🏜️' },
  wetlands: { en: 'wetlands', ru: 'водно-болотные угодья', emoji: '🌧️' },
};

export const habitats: Habitat[] = Object.keys(animals).map(key => {
  const habitatInfo = habitatNames[key];
  const habitatAnimals = animals[key].map(
    animal =>
      new Animal(
        animal.en,
        animal.ru,
        animal.emoji,
        `assets/animals/${key}/${animal.en}.mp3`
      )
  );
  return new Habitat(
    habitatInfo.en,
    habitatInfo.ru,
    habitatInfo.emoji,
    habitatAnimals
  );
});
