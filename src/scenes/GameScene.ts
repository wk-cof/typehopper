import Phaser from 'phaser';
import Bunny from '../game-objects/Bunny';
import Background from '../game-objects/Background';
import Letters from '../game-objects/Letters';
import ProgressBar from '../game-objects/ProgressBar';
import { createHiddenInput } from '../utils/utils';
import { Animal } from '../utils/animal-dictionary';
import { LEVEL_DIMENSIONS } from '../game';
import {
  LEVELS,
  LevelDefinition,
  getLevelAnimals,
  getLevelById,
} from '../levels/level-data';
import {
  getHighestUnlockedLevel,
  setHighestUnlockedLevel,
} from '../utils/progress';
import { getLanguage, translate, translateText } from '../utils/localization';

// Scoring awards 10 points per correctly typed letter and a 50 point bonus per completed stage.
const LETTER_POINTS = 10;
const STAGE_COMPLETION_BONUS = 50;

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
  private levelAnimals: Animal[] = [];
  private stageIndex = 0;
  private stageTransitioning = false;
  private levelMessageText?: Phaser.GameObjects.Text;
  private transitionTimer?: Phaser.Time.TimerEvent;
  private levelLabel!: Phaser.GameObjects.Text;
  private highestUnlockedLevel = 0;
  private score = 0;
  private scoreText?: Phaser.GameObjects.Text;

  constructor() {
    super('game-scene');
  }

  init(data: GameSceneInitData): void {
    const levelId = data.levelId ?? 0;
    this.levelDefinition = getLevelById(levelId);
    this.levelAnimals = getLevelAnimals(this.levelDefinition, getLanguage());
    this.highestUnlockedLevel =
      data.highestUnlockedLevel ?? getHighestUnlockedLevel();
    this.stageIndex = 0;
    this.letterSpeed = this.levelDefinition.baseLetterSpeed;
    this.score = 0;
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
    this.resizeForGameplay();
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

    const scoreYOffset = 12;
    this.scoreText = this.add
      .text(
        this.scale.width - padding,
        this.levelLabel.y + this.levelLabel.displayHeight + scoreYOffset,
        this.getScoreLabelText(),
        {
          fontSize: '32px',
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
      this.addScore(LETTER_POINTS);

      if (this.letters.isEmpty()) {
        this.completeStage();
      }
    }
  }

  private startStage(): void {
    this.levelAnimals = getLevelAnimals(this.levelDefinition, getLanguage());
    this.transitionTimer?.remove();
    this.transitionTimer = undefined;
    this.levelMessageText?.destroy();
    this.levelMessageText = undefined;
    this.stageTransitioning = false;

    this.currentAnimal = this.levelAnimals[this.stageIndex];
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

    this.addScore(STAGE_COMPLETION_BONUS);
    this.stageTransitioning = true;

    const isFinalStage =
      this.stageIndex >= this.levelAnimals.length - 1;

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
    const totalStages = this.levelAnimals.length;
    return translate('ui.game.levelLabel', {
      levelNumber: this.levelDefinition.id + 1,
      levelTitle: translateText(this.levelDefinition.title),
      stage: this.stageIndex + 1,
      totalStages,
    });
  }

  private addScore(points: number): void {
    this.score += points;
    if (this.scoreText) {
      this.scoreText.setText(this.getScoreLabelText());
    }
  }

  private getScoreLabelText(): string {
    return translate('ui.game.score', { score: this.score });
  }

  private resizeForGameplay(): void {
    if (
      this.scale.width !== LEVEL_DIMENSIONS.x ||
      this.scale.height !== LEVEL_DIMENSIONS.y
    ) {
      this.scale.setGameSize(LEVEL_DIMENSIONS.x, LEVEL_DIMENSIONS.y);
      this.scale.refresh();
    }
    this.cameras.main.setViewport(0, 0, LEVEL_DIMENSIONS.x, LEVEL_DIMENSIONS.y);
    this.cameras.main.setSize(LEVEL_DIMENSIONS.x, LEVEL_DIMENSIONS.y);
  }
}
