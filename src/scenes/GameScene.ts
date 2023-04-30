import Phaser from 'phaser';
import Bunny from '../game-objects/Bunny';
import Background from '../game-objects/Background';
import Letters from '../game-objects/Letters';
import ProgressBar from '../game-objects/ProgressBar';

export default class GameScene extends Phaser.Scene {
  private bunny!: Bunny;
  private background!: Background;
  private letters!: Letters;
  private letterPressed: string | undefined;
  private letterSpeed = 150;
  private progressBar!: ProgressBar;
  private lettersGuessed = 0;

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
    this.createHiddenInput();
    this.progressBar = new ProgressBar(this, 10);
    this.background.create();
    this.bunny.create();
    this.progressBar.draw(20, 20);

    this.letters = new Letters(this, this.letterSpeed);
    this.letters.createInitialLetters();
  }

  update(time: number, delta: number): void {
    const reachedLetter = this.inJumpDistance(
      this.letters.getFirstLetter().getGameObject()
    );
    if (!reachedLetter) {
      this.background.update(delta);
      this.letters.update(time, delta);
      this.progressBar.draw(20, 20);
      return;
    }

    if (
      this.letterPressed &&
      this.letterPressed.toLowerCase() ===
        this.letters.getFirstLetter().letter.toLowerCase()
    ) {
      this.letters.removeFirstLetter();
      this.letters.addNewLetterAfterLast();
      this.bunny.hop();
      this.letterPressed = undefined;

      // Update progress bar
      this.lettersGuessed += 1;
      this.progressBar.updateProgress();
    }

    // Check if progress is complete
    if (this.lettersGuessed >= 10) {
      console.log('Level complete!');
      // Move to the next level or show a level complete screen
    }
    this.bunny.update(time, delta);
    this.progressBar.draw(20, 20);
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

  createHiddenInput() {
    const hiddenInput = document.createElement('input');
    hiddenInput.type = 'text';
    hiddenInput.style.position = 'absolute';
    hiddenInput.style.top = '0';
    hiddenInput.style.left = '0';
    hiddenInput.style.opacity = '0.01';
    hiddenInput.style.pointerEvents = 'auto';
    hiddenInput.style.zIndex = '1000';
    hiddenInput.autocapitalize = 'off';
    hiddenInput.spellcheck = false;
    document.body.appendChild(hiddenInput);
    hiddenInput.focus();

    // Listen to input events on the hidden input element
    hiddenInput.addEventListener('input', event => {
      const inputEvent = event as InputEvent;
      const inputValue = (inputEvent.target as HTMLInputElement).value;

      if (inputValue.length > 0) {
        this.letterPressed = inputValue[inputValue.length - 1];
        (inputEvent.target as HTMLInputElement).value = '';
      }
    });
  }
}
