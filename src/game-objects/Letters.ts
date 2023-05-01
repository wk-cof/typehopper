import Phaser from 'phaser';
import Letter from './Letter';
import { Habitat, animals, habitats } from '../utils/animal-dictionary';
import { AnimalEmoji } from './AnimalEmoji';

export default class Letters {
  private scene: Phaser.Scene;
  private letterSpeed: number;
  private letters: Array<Letter>;
  private currentAnimalName!: string;
  private animalEmoji!: AnimalEmoji;

  constructor(scene: Phaser.Scene, letterSpeed: number, habitat?: string) {
    this.scene = scene;
    this.letterSpeed = letterSpeed;
    this.letters = [];
    if (habitat) {
      const specifiedHabitat = habitats.find(h => h.en === habitat);
      if (specifiedHabitat) {
        this.createAnimalLetters(specifiedHabitat);
      }
    } else {
      // create with a random habitat
      this.createAnimalLetters(
        habitats[Math.floor(Math.random() * habitats.length)]
      );
    }
  }

  createAnimalLetters(habitat: Habitat): void {
    const randomAnimal =
      habitat.animals[Math.floor(Math.random() * habitat.animals.length)];
    this.currentAnimalName = randomAnimal.ru; // Choose the language, "en" for English, "ru" for Russian
    for (let i = 0; i < this.currentAnimalName.length; i++) {
      this.createNewLetter(500 + i * 400, this.currentAnimalName[i]);
    }

    // Display the animal emoji
    const emojiX = 50;
    const emojiY = 60;
    this.animalEmoji = new AnimalEmoji(
      this.scene,
      emojiX,
      emojiY,
      randomAnimal.emoji
    );
  }

  private createNewLetter(x: number, letter: string): void {
    const xPos = x;
    const newLetter = new Letter(
      this.scene,
      letter,
      xPos,
      290,
      this.letterSpeed
    );
    this.letters.push(newLetter);
  }

  update(time: number, delta: number): void {
    this.letters.forEach(letter => {
      letter.update(time, delta);
    });
    this.animalEmoji.update();
  }

  getFirstLetter(): Letter {
    return this.letters[0];
  }

  removeFirstLetter(): void {
    const removedLetter = this.letters.shift();
    removedLetter?.destroy();
  }
}
