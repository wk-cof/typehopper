import Phaser from 'phaser';
import Bunny from '../game-objects/Bunny'

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
  private letters!: Array<any>;
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
    // this.bunny = this.add.image(400, 300, BUNNY_KEY).setScale(0.1);
    // this.physicsBunny = this.physics.add.image(this.bunny.x, this.bunny.y, BUNNY_KEY).setScale(0.1);
    this.bunny = new Bunny(this);
    this.bunny.create();
    this.letters = [];
    this.input.keyboard?.on('keyup', (event: any) => {
      this.letterPressed = event.key;
    });

    // Create text assets for letters and add them to the letters array
    const letterTexts = ['A', 'B', 'C', 'D'];
    letterTexts.forEach((letter, index) => {
      const text = this.add.text(500 + index * 100, 300, letter, { fontSize: '32px', color: '#000' });
      this.letters.push(text);
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
      letter.x -= this.letterSpeed * delta / 1000;
    });


    // if (!this.letterPressed) {
    //   // todo: handle jump end
    //   if (this.physicsBunny.body.allowGravity === true && this.bunny.y >= this.physicsBunny.y) {
    //     this.physicsBunny.body.allowGravity = false;
    //   }
    //   return;
    // }
    // const closestLetter = this.letters[0];
    // if (this.physicsBunny.body.allowGravity === false && this.inJumpDistance(closestLetter)) {
    //     this.physicsBunny = this.physics.add.image(this.bunny.x, this.bunny.y, BUNNY_KEY).setScale(0.1);
    //     this.physicsBunny.body.allowGravity = true;
    //     this.physicsBunny.setVelocity(100, -400);
    //     this.letterPressed = undefined;
    // }
  }

  inJumpDistance(letter: any) {
    // todo
    return true;
  }
}