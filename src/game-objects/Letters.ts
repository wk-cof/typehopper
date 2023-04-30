import Phaser from 'phaser';
import Letter from './Letter';

export default class Letters {
  private scene: Phaser.Scene;
  private letterSpeed: number;
  private letters: Array<Letter>;

  constructor(scene: Phaser.Scene, letterSpeed: number) {
    this.scene = scene;
    this.letterSpeed = letterSpeed;
    this.letters = [];
  }

  createInitialLetters(): void {
    for (let i = 0; i < 4; i++) {
      this.createNewLetter(500 + i * 400);
    }
  }

  createNewLetter(x: number): void {
    const letters = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ';
    const randomLetter = letters.charAt(
      Math.floor(Math.random() * letters.length)
    );
    const xPos = x;
    const newLetter = new Letter(
      this.scene,
      randomLetter,
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
  }

  addNewLetterAfterLast(): void {
    const lastLetter = this.letters[this.letters.length - 1].getGameObject().x;
    this.createNewLetter(lastLetter + 400);
  }
}
