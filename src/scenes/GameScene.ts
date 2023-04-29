// GameScene.ts
import Phaser from 'phaser';
import Bunny from '../game-objects/Bunny';
import Letter from '../game-objects/Letter';
import Background from '../game-objects/Background';

const BUNNY_KEY = 'bunny';

type KeyMaps = {
  [key: string]: {
    emitOnRepeat:boolean;
    enabled: boolean;
    isDown: boolean
    isUp: boolean;
    keyCode: number;

  };
};

export default class GameScene extends Phaser.Scene {
  private bunny!: Bunny;
  private background!: Background;
  private keyMaps: KeyMaps = {};
  private letters!: Array<Letter>;
  private letterPressed: string | undefined;
  private letterSpeed = 200;
  constructor() {
    super('game-scene');
  }

  preload() {
    this.bunny = new Bunny(this);
    this.background = new Background(this, this.letterSpeed);

    this.bunny.preload();
    this.background.preload();
  }

  create() {
    this.background.create();
    this.bunny.create();

    this.letters = [];
    this.input.keyboard?.on('keyup', (event: any) => {
      this.letterPressed = event.key;
    });

    // Create text assets for letters and add them to the letters array
    const letterTexts = ['A', 'B', 'C', 'D'];
    letterTexts.forEach((letter, index) => {
      const letterInstance = new Letter(this, letter, 500 + index * 400, 300, this.letterSpeed);
      this.letters.push(letterInstance);
    });
  }

  update(time: number, delta: number): void {
    // Move letters to the left
    if (this.letterPressed && this.letterPressed.toLowerCase() === this.letters[0].letter.toLowerCase()) {
      const removedLetter = this.letters.splice(0, 1);
      removedLetter[0].destroy();
      this.bunny.hop();
      this.letterPressed = undefined;
    }
    this.bunny.update(time, delta);

    const reachedLetter = this.inJumpDistance(this.letters[0].getGameObject());
    if (!reachedLetter) {
      this.background.update(delta);
      this.letters.forEach((letter) => {
        letter.update(time, delta);
      });
    }
  }

  inJumpDistance(letter: Phaser.GameObjects.Text): boolean {
    const distance = Phaser.Math.Distance.Between(
      this.bunny.bunny.x,
      this.bunny.bunny.y,
      letter.x,
      letter.y
    );

    return distance < 50;
  }
}
