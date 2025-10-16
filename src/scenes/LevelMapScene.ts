import Phaser from 'phaser';
import { LEVELS, LevelDefinition } from '../levels/level-data';
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
const PATH_COLOR = 0xffffff;

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
    this.cameras.main.setBackgroundColor('#1b2f33');
  }

  create() {
    this.titleText = this.add
      .text(this.scale.width / 2, 40, translate('ui.levelMap.title'), {
        fontSize: '38px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 6,
      })
      .setOrigin(0.5, 0.5);

    this.descriptionText = this.add
      .text(this.scale.width / 2, this.scale.height - 60, '', {
        fontSize: '20px',
        color: '#ffffff',
        align: 'center',
        wordWrap: { width: this.scale.width - 80 },
      })
      .setOrigin(0.5, 0.5);

    this.lockedHintText = this.add
      .text(this.scale.width / 2, this.scale.height - 30, '', {
        fontSize: '18px',
        color: '#ffaaaa',
      })
      .setOrigin(0.5, 0.5);

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

  private drawPaths(): void {
    const graphics = this.add.graphics();
    graphics.lineStyle(4, PATH_COLOR, 0.5);

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

      container.setSize(NODE_RADIUS * 2, NODE_RADIUS * 2);
      container.setInteractive(
        new Phaser.Geom.Circle(NODE_RADIUS/2 + 20, NODE_RADIUS/2 + 20, NODE_RADIUS * 1.2),
        Phaser.Geom.Circle.Contains
      );

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
    const animalPreview = level.animals.map(animal => animal.emoji).join(' ');
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
    this.languageToggleContainer.setPosition(
      this.scale.width - this.languageToggleBackground.width - this.languageTogglePadding,
      this.languageToggleY
    );

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
