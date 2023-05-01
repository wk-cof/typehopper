// Letters.ts

import Phaser from 'phaser';
import Letter from './Letter';
import { Animal, Habitat } from '../utils/animal-dictionary';
import ProgressBar from './ProgressBar';

export default class Letters {
  private scene: Phaser.Scene;
  private letterSpeed: number;
  private letters: Array<Letter>;
  private currentAnimalName!: string;
  private progressBar!: ProgressBar;

  constructor(
    scene: Phaser.Scene,
    letterSpeed: number,
    progressBar: ProgressBar,
    animal: Animal
  ) {
    this.scene = scene;
    this.letterSpeed = letterSpeed;
    this.letters = [];
    this.progressBar = progressBar;
    this.createAnimalLetters(animal);
  }

  createAnimalLetters(animal: Animal): void {
    this.currentAnimalName = animal.ru;
    for (let i = 0; i < this.currentAnimalName.length; i++) {
      this.createNewLetter(500 + i * 400, this.currentAnimalName[i]);
    }

    this.progressBar.createProgressLetters(this.letters, animal);
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
  }

  getFirstLetter(): Letter {
    return this.letters[0];
  }

  removeFirstLetter(): void {
    const removedLetter = this.letters.shift();
    removedLetter?.destroy();

    this.progressBar.updateProgressLetter();
  }
}
