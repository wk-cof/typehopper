import Phaser from 'phaser';
import Bunny from '../game-objects/Bunny';
import Letter from '../game-objects/Letter';
const BUNNY_KEY = 'bunny';
const BACKGROUND_KEY = 'backgroudn';

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
  private background!: Phaser.GameObjects.Image;
  private keyMaps: KeyMaps = {};
  private letters!: Array<Letter>;
  private letterPressed: string | undefined;
  private letterSpeed = 100;
  constructor() {
    super('game-scene');
  }

  preload() {
    this.load.image(BUNNY_KEY, 'assets/bunny.gif');
    this.load.image(BACKGROUND_KEY, 'assets/background.jpg');

  }

  create() {
    this.background = this.add.image(400, 300, BACKGROUND_KEY);
    this.bunny = new Bunny(this);
    this.bunny.create();
    this.letters = [];
    this.input.keyboard?.on('keyup', (event: any) => {
      this.letterPressed = event.key;
    });

    // Create text assets for letters and add them to the letters array
    const letterTexts = ['A', 'B', 'C', 'D'];
    letterTexts.forEach((letter, index) => {
      const letterInstance = new Letter(this, letter, 500 + index * 100, 300, this.letterSpeed);
      this.letters.push(letterInstance);
    });
  }

  update(time: number, delta: number): void {
    // Move letters to the left
    if (this.letterPressed) {
      this.bunny.hop();

      this.letterPressed = undefined
    }
    this.bunny.update(time, delta);
    this.letters.forEach((letter) => {
      letter.update(time, delta);
    });
  }

  inJumpDistance(letter: any) {
    // todo
    return true;
  }
}