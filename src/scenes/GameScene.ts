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
    const animal = this.createRandomAnimal();
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

    this.letters = new Letters(this, this.letterSpeed, animal);
    this.progressBar.create(this.letters.letters, animal);
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
    if (!rawInput || rawInput.length !== 1 || !this.letters) {
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
    }
  }

  update(time: number, delta: number): void {
    const letterLockX = this.bunny.bunny.x + 40;
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
}
