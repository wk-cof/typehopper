import Phaser from 'phaser';
import Bunny from '../game-objects/Bunny';
import Background from '../game-objects/Background';
import Letters from '../game-objects/Letters';
import ProgressBar from '../game-objects/ProgressBar';
import { createHiddenInput } from '../utils/utils';

export default class GameScene extends Phaser.Scene {
  private bunny!: Bunny;
  private background!: Background;
  private letters!: Letters;
  private letterPressed: string | undefined;
  private letterSpeed = 150;
  private progressBar!: ProgressBar;
  private backgroundMusic!: Phaser.Sound.BaseSound;

  constructor() {
    super('game-scene');
  }

  preload() {
    this.bunny = new Bunny(this);
    this.background = new Background(this, this.letterSpeed);

    this.bunny.preload();
    this.background.preload();

    this.load.audio('background-music', 'music/level-2-background.mp3');
  }

  create() {
    createHiddenInput(event => {
      const inputEvent = event as InputEvent;
      const inputValue = (inputEvent.target as HTMLInputElement).value;

      if (inputValue.length > 0) {
        this.letterPressed = inputValue[inputValue.length - 1];
        (inputEvent.target as HTMLInputElement).value = '';
      }
    });
    this.progressBar = new ProgressBar(this);
    this.background.create();
    this.bunny.create();

    this.letters = new Letters(this, this.letterSpeed, this.progressBar);
    this.input.keyboard?.on('keyup', (event: any) => {
      this.letterPressed = event.key;
    });

    // Play the background music
    this.backgroundMusic = this.sound.add('background-music', {
      loop: true,
      volume: 0.5,
    });
    // this.backgroundMusic.play();
  }

  update(time: number, delta: number): void {
    const reachedLetter = this.inJumpDistance(
      this.letters.getFirstLetter().getGameObject()
    );
    if (!reachedLetter) {
      this.background.update(delta);
      this.letters.update(time, delta);
      return;
    }

    if (
      this.letterPressed &&
      this.letterPressed.toLowerCase() ===
        this.letters.getFirstLetter().letter.toLowerCase()
    ) {
      this.letters.removeFirstLetter();
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
