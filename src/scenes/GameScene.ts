import Phaser from 'phaser';
import Bunny from '../game-objects/Bunny';
import Background from '../game-objects/Background';
import Letters from '../game-objects/Letters';
import ProgressBar from '../game-objects/ProgressBar';
import { createHiddenInput } from '../utils/utils';
import { Animal } from '../utils/animal-dictionary';
import { LEVELS, LevelDefinition, getLevelById } from '../levels/level-data';
import {
  getHighestUnlockedLevel,
  setHighestUnlockedLevel,
} from '../utils/progress';
import { translate, translateText } from '../utils/localization';

interface GameSceneInitData {
  levelId?: number;
  highestUnlockedLevel?: number;
}

export default class GameScene extends Phaser.Scene {
  private bunny!: Bunny;
  private background!: Background;
  private letters!: Letters;
  private letterSpeed = 150;
  private progressBar!: ProgressBar;
  private currentAnimal!: Animal;
  private levelDefinition!: LevelDefinition;
  private stageIndex = 0;
  private stageTransitioning = false;
  private levelMessageText?: Phaser.GameObjects.Text;
  private transitionTimer?: Phaser.Time.TimerEvent;
  private levelLabel!: Phaser.GameObjects.Text;
  private highestUnlockedLevel = 0;

  constructor() {
    super('game-scene');
  }

  init(data: GameSceneInitData): void {
    const levelId = data.levelId ?? 0;
    this.levelDefinition = getLevelById(levelId);
    this.highestUnlockedLevel =
      data.highestUnlockedLevel ?? getHighestUnlockedLevel();
    this.stageIndex = 0;
    this.letterSpeed = this.levelDefinition.baseLetterSpeed;
  }

  preload(): void {
    this.bunny = new Bunny(this);
    this.background = new Background(
      this,
      this.letterSpeed,
      this.levelDefinition.backgroundVariant
    );

    this.bunny.preload();
    this.background.preload();

    this.load.audio('background-music', 'music/level-2-background.mp3');
  }

  create(): void {
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
    this.levelLabel = this.add
      .text(
        this.scale.width - padding,
        padding,
        this.getLevelLabelText(),
        {
          fontSize: '28px',
          color: '#ffffff',
          stroke: '#000000',
          strokeThickness: 4,
        }
      )
      .setOrigin(1, 0);

    this.startStage();

    this.input.keyboard?.on('keyup', (event: KeyboardEvent) => {
      this.handleLetterInput(event.key);
    });
  }

  update(time: number, delta: number): void {
    if (!this.letters) {
      return;
    }

    const bunnyRightEdge =
      this.bunny.bunny.x + this.bunny.bunny.displayWidth / 2;
    const letterLockX = bunnyRightEdge + 30;
    this.background.update(delta);
    this.letters.update(time, delta, letterLockX);
    this.bunny.update();
  }

  private handleLetterInput(rawInput: string): void {
    if (
      !rawInput ||
      rawInput.length !== 1 ||
      !this.letters ||
      this.stageTransitioning
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
        this.completeStage();
      }
    }
  }

  private startStage(): void {
    this.transitionTimer?.remove();
    this.transitionTimer = undefined;
    this.levelMessageText?.destroy();
    this.levelMessageText = undefined;
    this.stageTransitioning = false;

    this.currentAnimal = this.levelDefinition.animals[this.stageIndex];
    this.letterSpeed =
      this.levelDefinition.baseLetterSpeed +
      this.stageIndex * this.levelDefinition.speedIncrement;

    this.background.setScrollSpeed(this.letterSpeed);

    if (this.letters) {
      this.letters.destroyAll();
    }

    this.letters = new Letters(this, this.letterSpeed, this.currentAnimal);
    this.progressBar.create(this.letters.letters, this.currentAnimal);
    this.bunny.resetPosition();
    this.levelLabel.setText(this.getLevelLabelText());
  }

  private completeStage(): void {
    if (this.stageTransitioning) {
      return;
    }

    this.stageTransitioning = true;

    const isFinalStage =
      this.stageIndex >= this.levelDefinition.animals.length - 1;

    const message = isFinalStage
      ? translate('ui.game.levelComplete')
      : translate('ui.game.greatJob');

    this.levelMessageText = this.add
      .text(this.scale.width / 2, this.scale.height / 2, message, {
        fontSize: '48px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 6,
      })
      .setOrigin(0.5, 0.5);

    const delay = isFinalStage ? 1800 : 1200;

    if (isFinalStage) {
      this.unlockNextLevel();
      this.transitionTimer = this.time.delayedCall(delay, () => {
        this.scene.start('level-map-scene', {
          lastCompletedLevelId: this.levelDefinition.id,
        });
      });
      return;
    }

    this.transitionTimer = this.time.delayedCall(delay, () => {
      this.stageIndex += 1;
      this.startStage();
    });
  }

  private unlockNextLevel(): void {
    const nextLevelIndex = Math.min(
      this.levelDefinition.id + 1,
      LEVELS.length - 1
    );
    const currentStored = this.highestUnlockedLevel;

    if (nextLevelIndex > currentStored) {
      setHighestUnlockedLevel(nextLevelIndex);
      this.highestUnlockedLevel = nextLevelIndex;
    }
  }

  private getLevelLabelText(): string {
    const totalStages = this.levelDefinition.animals.length;
    return translate('ui.game.levelLabel', {
      levelNumber: this.levelDefinition.id + 1,
      levelTitle: translateText(this.levelDefinition.title),
      stage: this.stageIndex + 1,
      totalStages,
    });
  }
}
