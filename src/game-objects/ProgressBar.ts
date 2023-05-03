// ProgressBar.ts

import Phaser from 'phaser';
import Letter from './Letter';
import { Animal } from '../utils/animal-dictionary';
import { AnimalEmoji } from './AnimalEmoji';

export default class ProgressBar {
  private scene: Phaser.Scene;
  private progressLetters: Array<Letter>;
  private progress: number;
  private animalEmoji!: AnimalEmoji;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.progressLetters = [];
    this.progress = 0;
  }

  create(letters: Array<Letter>, animal: Animal): void {
    letters.forEach((letter, index) => {
      const progressLetter = new Letter(
        this.scene,
        letter.letter,
        80 + index * 40,
        20,
        0
      );
      progressLetter.getGameObject().setColor('#808080');
      this.progressLetters.push(progressLetter);
    });

    const emojiX = 40;
    const emojiY = 50;
    this.animalEmoji = new AnimalEmoji(
      this.scene,
      emojiX,
      emojiY,
      animal.emoji
    );
  }

  updateProgressLetter(): void {
    if (this.progressLetters.length > 0) {
      this.progressLetters[this.progress].getGameObject().setColor('#00ff00');
      this.progress++;
    }
  }

  update(time: number, delta: number): void {
    this.progressLetters.forEach(letter => {
      letter.update(time, delta);
    });
    this.animalEmoji.update();
  }

  won() {
    this.progressLetters.length === this.progress;
  }
}
