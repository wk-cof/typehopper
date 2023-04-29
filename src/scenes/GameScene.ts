// GameScene.ts
import Phaser from 'phaser';
import Bunny from '../game-objects/Bunny';
import Letter from '../game-objects/Letter';
import Background from '../game-objects/Background';

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
  private letters!: Array<Letter>;
  private letterPressed: string | undefined;
  private letterSpeed = 150;
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

    // Create initial letters
    for (let i = 0; i < 4; i++) {
      this.createNewLetter(500 + i * 400);
    }
  }

  update(time: number, delta: number): void {
    if (this.letterPressed && this.letterPressed.toLowerCase() === this.letters[0].letter.toLowerCase()) {
      const removedLetter = this.letters.shift();
      removedLetter?.destroy();
      this.createNewLetter(this.letters[this.letters.length - 1].getGameObject().x + 400);
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

  createNewLetter(x?: number): void {
    const letters = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ';
    const randomLetter = letters.charAt(Math.floor(Math.random() * letters.length));
    const xPos = x || 1500;
    const newLetter = new Letter(this, randomLetter, xPos, 300, this.letterSpeed);
    this.letters.push(newLetter);
  }
}
