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
import CarrotCollectible from '../game-objects/CarrotCollectible';
import Letter from '../game-objects/Letter';

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
  private activeCollectibles = new Set<CarrotCollectible>();
  private pendingStageCompletion = false;
  private suppressNextKeyboardInput = false;
  private exitDialogOverlay?: Phaser.GameObjects.Rectangle;
  private exitDialogContainer?: Phaser.GameObjects.Container;
  private exitDialogActive = false;

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
    this.pendingStageCompletion = false;
    this.activeCollectibles.clear();
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
    this.load.image('carrot-coin', 'assets/carrot.png');

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
        this.suppressNextKeyboardInput = true;
      }
    });

    this.progressBar = new ProgressBar(this);
    this.background.create();
    this.bunny.create();

    const padding = 8;
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

    this.createExitControls();
    this.startStage();

    this.input.keyboard?.on('keyup', (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (this.exitDialogActive) {
          this.closeExitDialog();
        } else {
          this.openExitDialog();
        }
        this.suppressNextKeyboardInput = false;
        return;
      }

      if (this.suppressNextKeyboardInput) {
        this.suppressNextKeyboardInput = false;
        return;
      }

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
    this.updateCollectibles(delta);
  }

  private handleLetterInput(rawInput: string): void {
    if (
      !rawInput ||
      rawInput.length !== 1 ||
      !this.letters ||
      this.stageTransitioning ||
      this.exitDialogActive
    ) {
      return;
    }

    const firstLetter = this.letters.getFirstLetter();
    if (!firstLetter) {
      return;
    }

    if (rawInput.toLowerCase() === firstLetter.letter.toLowerCase()) {
      const removedLetter = this.letters.removeFirstLetter();
      if (!removedLetter) {
        return;
      }

      this.launchCollectibleFromLetter(removedLetter);
      this.progressBar.updateProgressLetter();
      this.addScore(LETTER_POINTS);

      this.pendingStageCompletion = this.letters.isEmpty();
      if (this.pendingStageCompletion && this.activeCollectibles.size === 0) {
        this.completeStage();
        this.pendingStageCompletion = false;
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

    this.clearCollectibles();

    this.letters = new Letters(this, this.letterSpeed, this.currentAnimal);
    this.progressBar.create(this.letters.letters, this.currentAnimal);
    this.bunny.resetPosition();
    this.levelLabel.setText(this.getLevelLabelText());
    this.pendingStageCompletion = false;
  }

  private createExitControls(): void {
    const padding = 20;
    const buttonWidth = 60;
    const buttonHeight = 40;

    const background = this.add
      .rectangle(0, 0, buttonWidth, buttonHeight, 0x000000, 0.55)
      .setOrigin(0.5, 0.5)
      .setStrokeStyle(2, 0xffffff, 0.6);

    const label = this.add
      .text(0, 0, 'X', {
        fontSize: '26px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 2,
      })
      .setOrigin(0.5, 0.5);

    const container = this.add
      .container(padding + buttonWidth / 2, padding + buttonHeight / 2, [
        background,
        label,
      ])
      .setDepth(6);

    container.setSize(buttonWidth, buttonHeight);
    container.setInteractive(
      new Phaser.Geom.Rectangle(
        -buttonWidth / 2,
        -buttonHeight / 2,
        buttonWidth,
        buttonHeight
      ),
      Phaser.Geom.Rectangle.Contains
    );
    if (container.input) {
      container.input.cursor = 'pointer';
    }
    container.on('pointerover', () => {
      background.setFillStyle(0x2b2b33, 0.75);
    });
    container.on('pointerout', () => {
      background.setFillStyle(0x000000, 0.55);
    });
    container.on('pointerup', (_pointer: Phaser.Input.Pointer, _x: number, _y: number, event?: Phaser.Types.Input.EventData) => {
      event?.stopPropagation();
      this.openExitDialog();
    });

  }

  private openExitDialog(): void {
    if (this.exitDialogActive) {
      return;
    }

    this.exitDialogActive = true;

    this.exitDialogOverlay = this.add
      .rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0.5)
      .setOrigin(0, 0)
      .setDepth(40)
      .setInteractive();

    this.exitDialogOverlay.on('pointerup', (_pointer: Phaser.Input.Pointer, _x: number, _y: number, event?: Phaser.Types.Input.EventData) => {
      event?.stopPropagation();
      this.closeExitDialog();
    });

    const dialogWidth = 440;
    const dialogHeight = 220;
    const container = this.add
      .container(this.scale.width / 2, this.scale.height / 2)
      .setDepth(50);

    const background = this.add
      .rectangle(0, 0, dialogWidth, dialogHeight, 0x1b2f33, 0.95)
      .setOrigin(0.5, 0.5)
      .setStrokeStyle(4, 0xffffff, 0.65);

    const message = this.add
      .text(0, -40, translate('ui.dialog.confirmExit'), {
        fontSize: '24px',
        color: '#ffffff',
        align: 'center',
        wordWrap: { width: dialogWidth - 60 },
      })
      .setOrigin(0.5, 0.5);

    const confirmButton = this.createDialogButton(
      translate('ui.dialog.confirm'),
      () => {
        this.closeExitDialog();
        this.performExitToMap();
      }
    );
    confirmButton.setPosition(-90, 55);

    const cancelButton = this.createDialogButton(
      translate('ui.dialog.cancel'),
      () => {
        this.closeExitDialog();
      }
    );
    cancelButton.setPosition(90, 55);

    container.add([background, message, confirmButton, cancelButton]);

    this.exitDialogContainer = container;
  }

  private closeExitDialog(): void {
    if (!this.exitDialogActive) {
      return;
    }

    this.exitDialogActive = false;
    this.exitDialogOverlay?.destroy();
    this.exitDialogContainer?.destroy();
    this.exitDialogOverlay = undefined;
    this.exitDialogContainer = undefined;
  }

  private performExitToMap(): void {
    this.transitionTimer?.remove();
    this.clearCollectibles();
    this.letters?.destroyAll();
    this.scene.start('level-map-scene');
  }

  private createDialogButton(
    label: string,
    onClick: () => void
  ): Phaser.GameObjects.Container {
    const width = 160;
    const height = 56;
    const background = this.add
      .rectangle(0, 0, width, height, 0xffffff, 0.18)
      .setOrigin(0.5, 0.5)
      .setStrokeStyle(2, 0xffffff, 0.7);
    const text = this.add
      .text(0, 0, label, {
        fontSize: '22px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 3,
      })
      .setOrigin(0.5, 0.5);

    const container = this.add.container(0, 0, [background, text]);
    container.setSize(width, height);
    container.setInteractive(
      new Phaser.Geom.Rectangle(0, 0, width, height),
      Phaser.Geom.Rectangle.Contains
    );

    container.on('pointerover', () => {
      background.setFillStyle(0xffffff, 0.28);
    });
    container.on('pointerout', () => {
      background.setFillStyle(0xffffff, 0.18);
    });
    container.on('pointerup', (_pointer: Phaser.Input.Pointer, _x: number, _y: number, event?: Phaser.Types.Input.EventData) => {
      event?.stopPropagation();
      onClick();
    });

    return container;
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

  private launchCollectibleFromLetter(letter: Letter): void {
    const gameObject = letter.getGameObject();
    const startPoint = new Phaser.Math.Vector2();
    gameObject.getCenter(startPoint);

    const collectible = new CarrotCollectible(
      this,
      startPoint,
      this.letterSpeed,
      gameObject
    );

    this.activeCollectibles.add(collectible);
  }

  private onCollectibleArrived(position: Phaser.Math.Vector2): void {
    this.spawnCollectibleBurst(position);
    this.bunny.consumeCollectible();

    if (this.pendingStageCompletion && this.activeCollectibles.size === 0) {
      this.completeStage();
      this.pendingStageCompletion = false;
    }
  }

  private spawnCollectibleBurst(position: Phaser.Math.Vector2): void {
    const emitter = this.add.particles(position.x, position.y, 'carrot-coin', {
      lifespan: 260,
      speed: { min: 120, max: 220 },
      angle: { min: 200, max: 340 },
      scale: { start: 0.25, end: 0.05 },
      gravityY: 320,
      emitting: false,
    });
    emitter.setDepth(6);
    emitter.explode(6, position.x, position.y);

    this.time.delayedCall(260, () => {
      emitter.destroy();
    });
  }

  private clearCollectibles(): void {
    this.activeCollectibles.forEach(collectible => collectible.destroy());
    this.activeCollectibles.clear();
  }

  private updateCollectibles(delta: number): void {
    if (this.activeCollectibles.size === 0) {
      return;
    }

    const catchPoint = this.bunny.getCatchPoint();
    const toCollect: CarrotCollectible[] = [];

    this.activeCollectibles.forEach(collectible => {
      collectible.update(delta);
      if (collectible.shouldCollect(catchPoint)) {
        toCollect.push(collectible);
      }
    });

    toCollect.forEach(collectible => {
      this.activeCollectibles.delete(collectible);
      const position = collectible.getPosition();
      collectible.collect();
      this.onCollectibleArrived(position);
    });
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
