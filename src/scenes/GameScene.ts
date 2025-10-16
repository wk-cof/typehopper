import Phaser from 'phaser';
import Bunny from '../game-objects/Bunny';
import Background from '../game-objects/Background';
import Letters from '../game-objects/Letters';
import ProgressBar from '../game-objects/ProgressBar';
import { createHiddenInput } from '../utils/utils';
import { Animal, habitats } from '../utils/animal-dictionary';

export default class GameScene extends Phaser.Scene {
  private bunny!: Bunny;
  private background!: Background;
  private letters!: Letters;
  private letterSpeed = 150;
  private progressBar!: ProgressBar;
  private currentAnimal!: Animal;
  private level = 1;
  private levelComplete = false;
  private levelCompleteText?: Phaser.GameObjects.Text;
  private levelTransitionTimer?: Phaser.Time.TimerEvent;
  private levelLabel!: Phaser.GameObjects.Text;
  // private backgroundMusic!: Phaser.Sound.BaseSound;

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
        const lastCharacter = inputValue[inputValue.length - 1];
        this.handleLetterInput(lastCharacter);
        (inputEvent.target as HTMLInputElement).value = '';
      }
    });
    this.progressBar = new ProgressBar(this);
    this.background.create();
    this.bunny.create();

    const padding = 20;
    this.levelLabel = this.add.text(this.scale.width - padding, padding, `Level ${this.level}`, {
      fontSize: '28px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4,
    }).setOrigin(1, 0);

    this.startLevel();

    this.input.keyboard?.on('keyup', (event: KeyboardEvent) => {
      this.handleLetterInput(event.key);
    });

    // Play the background music
    // this.backgroundMusic = this.sound.add('background-music', {
    //   loop: true,
    //   volume: 0.5,
    // });
    // this.backgroundMusic.play();
  }

  private handleLetterInput(rawInput: string): void {
    if (
      !rawInput ||
      rawInput.length !== 1 ||
      !this.letters ||
      this.levelComplete
    ) {
      return;
    }

    const firstLetter = this.letters.getFirstLetter();
    if (!firstLetter) {
      return;
    }

    if (rawInput.toLowerCase() === firstLetter.letter.toLowerCase()) {
      this.letters.removeFirstLetter();
      this.progressBar.updateProgressLetter();
      this.bunny.hop();

      if (this.letters.isEmpty()) {
        this.completeLevel();
      }
    }
  }

  update(time: number, delta: number): void {
    const bunnyRightEdge = this.bunny.bunny.x + this.bunny.bunny.displayWidth / 2;
    const letterLockX = bunnyRightEdge + 30;
    this.background.update(delta);
    this.letters.update(time, delta, letterLockX);
    this.bunny.update();
  }

  private createRandomAnimal(): Animal {
    const randomHabitat = habitats[Math.floor(Math.random() * habitats.length)];
    const randomAnimal =
      randomHabitat.animals[
        Math.floor(Math.random() * randomHabitat.animals.length)
      ];
    return randomAnimal;
  }

  private startLevel(): void {
    this.levelTransitionTimer?.remove();
    this.levelTransitionTimer = undefined;
    this.levelCompleteText?.destroy();
    this.levelCompleteText = undefined;
    this.levelComplete = false;

    const nextAnimal = this.createRandomAnimal();
    this.currentAnimal = nextAnimal;

    if (this.letters) {
      this.letters.destroyAll();
    }

    this.letters = new Letters(this, this.letterSpeed, this.currentAnimal);
    this.progressBar.create(this.letters.letters, this.currentAnimal);
    this.bunny.resetPosition();
    this.levelLabel.setText(`Level ${this.level}`);
  }

  private completeLevel(): void {
    if (this.levelComplete) {
      return;
    }

    this.levelComplete = true;
    this.levelCompleteText = this.add
      .text(this.scale.width / 2, this.scale.height / 2, 'Level Complete!', {
        fontSize: '48px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 6,
      })
      .setOrigin(0.5, 0.5);

    this.level += 1;

    this.levelTransitionTimer = this.time.delayedCall(1500, () => {
      this.startLevel();
    });
  }
}
