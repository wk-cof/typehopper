// ProgressBar.ts

import Phaser from 'phaser';
import Letter from './Letter';
import { Animal } from '../utils/animal-dictionary';
import { AnimalEmoji } from './AnimalEmoji';

export default class ProgressBar {
  private scene: Phaser.Scene;
  private progressLetters: Array<Letter>;
  private progress: number;
  private animalEmoji?: AnimalEmoji;
  private static readonly LETTER_PADDING = 16;
  private static readonly LETTER_Y = 40;
  private static readonly EMOJI_X = 60;
  private static readonly EMOJI_Y = 60;
  private static readonly EMOJI_GAP = 20;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.progressLetters = [];
    this.progress = 0;
  }

  create(letters: Array<Letter>, animal: Animal): void {
    this.reset(letters, animal);
  }

  reset(letters: Array<Letter>, animal: Animal): void {
    this.clearUI();
    this.populate(letters, animal);
  }

  private populate(letters: Array<Letter>, animal: Animal): void {
    this.animalEmoji = new AnimalEmoji(
      this.scene,
      ProgressBar.EMOJI_X,
      ProgressBar.EMOJI_Y,
      animal.emoji
    );

    let currentX =
      this.animalEmoji.x +
      this.animalEmoji.displayWidth / 2 +
      ProgressBar.EMOJI_GAP;

    letters.forEach(letter => {
      const progressLetter = new Letter(
        this.scene,
        letter.letter,
        currentX,
        ProgressBar.LETTER_Y,
        0
      );
      progressLetter.getGameObject().setColor('#808080');
      this.progressLetters.push(progressLetter);
      currentX +=
        progressLetter.getWidth() + ProgressBar.LETTER_PADDING;
    });
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
    this.animalEmoji?.update();
  }

  won() {
    this.progressLetters.length === this.progress;
  }

  private clearUI(): void {
    this.progressLetters.forEach(letter => letter.destroy());
    this.progressLetters = [];
    this.progress = 0;
    this.animalEmoji?.destroy();
    this.animalEmoji = undefined;
  }
}
