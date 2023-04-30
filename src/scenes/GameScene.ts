import Phaser from 'phaser';
import Bunny from '../game-objects/Bunny';
import Letter from '../game-objects/Letter';
import Background from '../game-objects/Background';
import Letters from '../game-objects/Letters';

export default class GameScene extends Phaser.Scene {
  private bunny!: Bunny;
  private background!: Background;
  private letters!: Letters;
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

    this.letters = new Letters(this, this.letterSpeed);
    this.letters.createInitialLetters();

    this.input.keyboard?.on('keyup', (event: any) => {
      this.letterPressed = event.key;
    });
  }

  update(time: number, delta: number): void {
    const reachedLetter = this.inJumpDistance(this.letters.getFirstLetter().getGameObject());
    if (!reachedLetter) {
      this.background.update(delta);
      this.letters.update(time, delta);
      return;
    }

    if (this.letterPressed && this.letterPressed.toLowerCase() === this.letters.getFirstLetter().letter.toLowerCase()) {
      this.letters.removeFirstLetter();
      this.letters.addNewLetterAfterLast();
      this.bunny.hop();
      this.letterPressed = undefined;
    }
    this.bunny.update(time, delta);

  }

  inJumpDistance(letter: Phaser.GameObjects.Text): boolean {
    const distance = Phaser.Math.Distance.Between(
      this.bunny.bunny.x,
      this.bunny.bunny.y,
      letter.x,
      letter.y
    );

    return distance < 100;
  }
}

