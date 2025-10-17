// Letters.ts

import Phaser from 'phaser';
import Letter from './Letter';
import { Animal } from '../utils/animal-dictionary';
import { getLanguage, LanguageCode } from '../utils/localization';

export default class Letters {
  private scene: Phaser.Scene;
  private letterSpeed: number;
  public letters: Array<Letter>;
  private currentAnimalName!: string;
  private static readonly LETTER_PADDING = 30;
  private static readonly START_X = 500;
  private static readonly LETTER_X_SPACING = 400;

  constructor(scene: Phaser.Scene, letterSpeed: number, animal: Animal) {
    this.scene = scene;
    this.letterSpeed = letterSpeed;
    this.letters = [];
    this.createAnimalLetters(animal);
  }

  createAnimalLetters(animal: Animal): void {
    const language = getLanguage();
    this.currentAnimalName = Letters.getAnimalNameByLanguage(animal, language);

    Array.from(this.currentAnimalName).forEach((character, index) => {
      const xPosition =
        Letters.START_X + index * Letters.LETTER_X_SPACING;
      this.createNewLetter(xPosition, character);
    });
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

  update(time: number, delta: number, lockX?: number): void {
    this.letters.forEach((letter, index) => {
      let lockThreshold: number | undefined;

      if (typeof lockX === 'number' && index === 0) {
        lockThreshold = lockX;
      } else if (index > 0) {
        const previousLetter = this.letters[index - 1];
        lockThreshold =
          previousLetter.getRightEdge() + Letters.LETTER_PADDING;
      }

      letter.update(time, delta, lockThreshold);
    });
  }

  getFirstLetter(): Letter | undefined {
    return this.letters[0];
  }

  removeFirstLetter(): void {
    const removedLetter = this.letters.shift();
    removedLetter?.destroy();
  }

  destroyAll(): void {
    this.letters.forEach(letter => letter.destroy());
    this.letters = [];
  }

  isEmpty(): boolean {
    return this.letters.length === 0;
  }

  private static getAnimalNameByLanguage(
    animal: Animal,
    language: LanguageCode
  ): string {
    if (language === 'ru') {
      return animal.ru;
    }
    return animal.en;
  }
}
