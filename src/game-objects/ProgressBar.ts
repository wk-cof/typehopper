// ProgressBar.ts

import Phaser from 'phaser';
import Letter from './Letter';

export default class ProgressBar {
  private scene: Phaser.Scene;
  private progressLetters: Array<Letter>;
  private totalProgress: number;
  private progress: number;

  constructor(scene: Phaser.Scene, totalProgress: number) {
    this.scene = scene;
    this.totalProgress = totalProgress;
    this.progressLetters = [];
    this.progress = 0;
  }

  createProgressLetters(letters: Array<Letter>): void {
    letters.forEach((letter, index) => {
      const progressLetter = new Letter(
        this.scene,
        letter.letter,
        50 + index * 40,
        20,
        0
      );
      progressLetter.getGameObject().setColor('#808080');
      this.progressLetters.push(progressLetter);
    });
  }

  updateProgressLetter(): void {
    if (this.progressLetters.length > 0) {
      this.progressLetters[this.progress].getGameObject().setColor('#00ff00');
      this.progress++;
      // const removedLetter = this.progressLetters.shift();
      // removedLetter?.destroy();
    }
  }

  update(time: number, delta: number): void {
    this.progressLetters.forEach(letter => {
      letter.update(time, delta);
    });
  }
}
