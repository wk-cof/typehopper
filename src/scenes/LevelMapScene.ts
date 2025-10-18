import Phaser from 'phaser';
import {
  LEVELS,
  LevelDefinition,
  getLevelAnimals,
} from '../levels/level-data';
import {
  getHighestUnlockedLevel,
  setHighestUnlockedLevel,
} from '../utils/progress';
import {
  LanguageCode,
  getLanguage,
  getSupportedLanguages,
  onLanguageChange,
  setLanguage,
  translate,
  translateText,
} from '../utils/localization';

interface LevelMapSceneData {
  lastCompletedLevelId?: number;
}

const NODE_RADIUS = 40;
const LOCKED_COLOR = 0x666666;
const UNLOCKED_COLOR = 0x66ccff;
const ACTIVE_COLOR = 0xffcc33;
const PATH_COLOR = 0xfaf0c6;
const MAP_BACKGROUND_KEY = 'map-background';
const MAP_DIMENSIONS = { width: 1152, height: 768 };

export default class LevelMapScene extends Phaser.Scene {
  private descriptionText!: Phaser.GameObjects.Text;
  private lockedHintText!: Phaser.GameObjects.Text;
  private titleText!: Phaser.GameObjects.Text;
  private languageLabelText!: Phaser.GameObjects.Text;
  private languageToggleContainer!: Phaser.GameObjects.Container;
  private languageToggleBackground!: Phaser.GameObjects.Rectangle;
  private languageTexts = new Map<LanguageCode, Phaser.GameObjects.Text>();
  private levelNumberTexts = new Map<number, Phaser.GameObjects.Text>();
  private highestUnlockedLevel = 0;
  private hoveredLevelId: number | null = null;
  private hoveredLevelUnlocked = false;
  private languageChangeCleanup?: () => void;
  private readonly languageTogglePadding = 18;
  private readonly languageToggleY = 30;

  constructor() {
    super('level-map-scene');
  }

  init(data: LevelMapSceneData) {
    const maxIndex = LEVELS.length - 1;
    const storedProgress = Math.min(getHighestUnlockedLevel(), maxIndex);
    if (typeof data.lastCompletedLevelId === 'number') {
      const potentialUnlock = Math.min(data.lastCompletedLevelId + 1, maxIndex);
      this.highestUnlockedLevel = Math.max(storedProgress, potentialUnlock);
      setHighestUnlockedLevel(this.highestUnlockedLevel);
    } else {
      this.highestUnlockedLevel = storedProgress;
    }
  }

  preload() {
    this.loadBackground();
    this.cameras.main.setBackgroundColor('#1b2f33');
  }

  private loadBackground(): void {
    if (!this.textures.exists(MAP_BACKGROUND_KEY)) {
      this.load.image(MAP_BACKGROUND_KEY, 'assets/map/map.png');
    }
  }

  create() {
    this.resizeForMap();
    this.createBackground();
    const titlePaddingX = 60;

    this.titleText = this.add
      .text(titlePaddingX, 40, translate('ui.levelMap.title'), {
        fontSize: '38px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 6,
      })
      .setOrigin(0, 0.5)
      .setDepth(10);

    this.descriptionText = this.add
      .text(this.scale.width / 2, this.scale.height - 60, '', {
        fontSize: '20px',
        color: '#ffffff',
        align: 'center',
        wordWrap: { width: this.scale.width - 80 },
      })
      .setOrigin(0.5, 0.5)
      .setDepth(10);

    this.lockedHintText = this.add
      .text(this.scale.width / 2, this.scale.height - 30, '', {
        fontSize: '18px',
        color: '#ffaaaa',
      })
      .setOrigin(0.5, 0.5)
      .setDepth(10);

    this.drawPaths();
    this.createNodes();
    this.createLanguageToggle();
    this.refreshLanguageTexts();

    this.languageChangeCleanup = onLanguageChange(() => {
      this.refreshLanguageTexts();
    });
    this.events.once('shutdown', () => {
      this.languageChangeCleanup?.();
    });
  }

  private resizeForMap(): void {
    if (
      this.scale.width !== MAP_DIMENSIONS.width ||
      this.scale.height !== MAP_DIMENSIONS.height
    ) {
      this.scale.setGameSize(MAP_DIMENSIONS.width, MAP_DIMENSIONS.height);
      this.scale.refresh();
    }
    this.cameras.main.setViewport(0, 0, MAP_DIMENSIONS.width, MAP_DIMENSIONS.height);
    this.cameras.main.setSize(MAP_DIMENSIONS.width, MAP_DIMENSIONS.height);
  }

  private createBackground(): void {
    if (!this.textures.exists(MAP_BACKGROUND_KEY)) {
      return;
    }
    const texture = this.textures.get(MAP_BACKGROUND_KEY);
    const source = texture.getSourceImage() as HTMLImageElement | HTMLCanvasElement;
    const width = source ? source.width : this.scale.width;
    const height = source ? source.height : this.scale.height;

    const background = this.add
      .image(this.scale.width / 2, this.scale.height / 2, MAP_BACKGROUND_KEY)
      .setOrigin(0.5, 0.5);

    const scale = Math.max(this.scale.width / width, this.scale.height / height);
    background.setDisplaySize(width * scale, height * scale);
    background.setDepth(-20);
  }

  private drawPaths(): void {
    const graphics = this.add.graphics();
    graphics.setDepth(-5);
    graphics.lineStyle(6, PATH_COLOR, 0.85);

    LEVELS.forEach((level, index) => {
      if (index === 0) {
        return;
      }
      const previous = LEVELS[index - 1];
      graphics.lineBetween(
        previous.mapPosition.x,
        previous.mapPosition.y,
        level.mapPosition.x,
        level.mapPosition.y
      );
    });
  }

  private createNodes(): void {
    this.levelNumberTexts.clear();

    LEVELS.forEach((level, index) => {
      const unlocked = index <= this.highestUnlockedLevel;
      const container = this.add.container(level.mapPosition.x, level.mapPosition.y);
      container.setDepth(5);

      const circle = this.add.circle(0, 0, NODE_RADIUS, unlocked ? UNLOCKED_COLOR : LOCKED_COLOR);
      circle.setStrokeStyle(6, index === this.highestUnlockedLevel ? ACTIVE_COLOR : 0x222222);

      const emojiText = this.add
        .text(0, -10, level.badgeEmoji, { fontSize: '32px' })
        .setOrigin(0.5, 0.5);

      const numberText = this.add
        .text(0, 25, '', {
          fontSize: '18px',
          color: unlocked ? '#000000' : '#bbbbbb',
          fontStyle: 'bold',
        })
        .setOrigin(0.5, 0.5);
      this.levelNumberTexts.set(level.id, numberText);

      container.add([circle, emojiText, numberText]);

      const hitRadius = NODE_RADIUS + 24;
      container.setSize(hitRadius * 2, hitRadius * 2);
      // don't change the first 2 params in the Geom.Circle constructor, they are used for the hitbox
      // setting 0 is incorrect!
      container.setInteractive(
        new Phaser.Geom.Circle(NODE_RADIUS, NODE_RADIUS, hitRadius),
        Phaser.Geom.Circle.Contains
      );
      if (container.input) {
        container.input.cursor = 'pointer';
      }

      container.on('pointerover', () => {
        circle.setScale(1.08);
        this.hoveredLevelId = level.id;
        this.hoveredLevelUnlocked = unlocked;
        this.updateLevelHoverText(level, unlocked);
      });

      container.on('pointerout', () => {
        circle.setScale(1);
        this.descriptionText.setText('');
        this.lockedHintText.setText('');
        this.hoveredLevelId = null;
        this.hoveredLevelUnlocked = false;
      });

      if (unlocked) {
        container.on('pointerdown', () => {
          this.scene.start('game-scene', {
            levelId: level.id,
            highestUnlockedLevel: this.highestUnlockedLevel,
          });
        });
      } else {
        container.setAlpha(0.6);
      }
    });
  }

  private updateLevelHoverText(level: LevelDefinition, unlocked: boolean): void {
    const animals = getLevelAnimals(level, getLanguage());
    const animalPreview = animals.map(animal => animal.emoji).join(' ');
    this.descriptionText.setText(
      `${translateText(level.title)}\n${translateText(level.description)}\n${animalPreview}`
    );
    this.lockedHintText.setText(
      unlocked ? translate('ui.levelMap.unlockedHint') : translate('ui.levelMap.lockedHint')
    );
  }

  private createLanguageToggle(): void {
    this.languageToggleContainer?.destroy(true);
    this.languageTexts.clear();

    this.languageToggleContainer = this.add.container(0, this.languageToggleY);
    this.languageToggleContainer.setDepth(100);

    this.languageToggleBackground = this.add
      .rectangle(0, 0, 220, 40, 0x000000, 0.45)
      .setOrigin(0, 0);
    this.languageToggleBackground.setStrokeStyle(1, 0xffffff, 0.15);

    this.languageLabelText = this.add
      .text(12, 20, '', {
        fontSize: '16px',
        color: '#ffffff',
      })
      .setOrigin(0, 0.5);

    this.languageToggleContainer.add([this.languageToggleBackground, this.languageLabelText]);

    const languages = getSupportedLanguages();
    languages.forEach(language => {
      const languageText = this.add
        .text(0, 20, '', {
          fontSize: '16px',
          color: '#dddddd',
        })
        .setOrigin(0, 0.5)
        .setInteractive({ useHandCursor: true });

      languageText.on('pointerdown', () => {
        setLanguage(language);
      });

      this.languageTexts.set(language, languageText);
      this.languageToggleContainer.add(languageText);
    });
  }

  private refreshLanguageTexts(): void {
    this.titleText.setText(translate('ui.levelMap.title'));

    const activeLanguage = getLanguage();

    this.languageLabelText.setText(`${translate('ui.languageToggle.label')}:`);
    const labelLeft = 12;
    this.languageLabelText.setX(labelLeft);
    const labelRight = labelLeft + this.languageLabelText.displayWidth;

    let offsetX = labelRight + 16;
    const languages = getSupportedLanguages();
    languages.forEach(language => {
      const languageText = this.languageTexts.get(language);
      if (!languageText) {
        return;
      }

      const translationKey =
        language === 'en'
          ? 'ui.languageToggle.english'
          : 'ui.languageToggle.russian';

      languageText.setText(translate(translationKey));
      languageText.setFontStyle(language === activeLanguage ? 'bold' : 'normal');
      languageText.setColor(language === activeLanguage ? '#ffcc33' : '#dddddd');
      languageText.setX(offsetX);

      offsetX += languageText.displayWidth + 14;
    });

    const totalWidth = offsetX + 12;
    this.languageToggleBackground.width = Math.max(totalWidth, 160);
    this.languageToggleBackground.height = 40;
    const toggleX =
      this.scale.width - this.languageToggleBackground.width - this.languageTogglePadding - 80;
    const toggleY = this.languageToggleY + 10;
    this.languageToggleContainer.setPosition(toggleX, toggleY);

    this.levelNumberTexts.forEach((text, levelId) => {
      text.setText(translate('ui.levelMap.levelNumber', { levelNumber: levelId + 1 }));
    });

    if (this.hoveredLevelId != null) {
      const level = LEVELS.find(l => l.id === this.hoveredLevelId);
      if (level) {
        this.updateLevelHoverText(level, this.hoveredLevelUnlocked);
      }
    }
  }
}
