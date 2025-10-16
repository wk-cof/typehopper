import Phaser from 'phaser';
import { LEVELS } from '../levels/level-data';
import {
  getHighestUnlockedLevel,
  setHighestUnlockedLevel,
} from '../utils/progress';

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
  private highestUnlockedLevel = 0;

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
    this.add
      .text(this.scale.width / 2, 40, 'Level Map', {
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
    LEVELS.forEach((level, index) => {
      const unlocked = index <= this.highestUnlockedLevel;
      const container = this.add.container(level.mapPosition.x, level.mapPosition.y);

      const circle = this.add.circle(0, 0, NODE_RADIUS, unlocked ? UNLOCKED_COLOR : LOCKED_COLOR);
      circle.setStrokeStyle(6, index === this.highestUnlockedLevel ? ACTIVE_COLOR : 0x222222);

      const emojiText = this.add
        .text(0, -10, level.badgeEmoji, { fontSize: '32px' })
        .setOrigin(0.5, 0.5);

      const numberText = this.add
        .text(0, 25, `#${level.id + 1}`, {
          fontSize: '18px',
          color: unlocked ? '#000000' : '#bbbbbb',
          fontStyle: 'bold',
        })
        .setOrigin(0.5, 0.5);

      container.add([circle, emojiText, numberText]);

      const animalPreview = level.animals.map(animal => animal.emoji).join(' ');

      container.setSize(NODE_RADIUS * 2, NODE_RADIUS * 2);
      container.setInteractive(
        new Phaser.Geom.Circle(NODE_RADIUS/2 + 20, NODE_RADIUS/2 + 20, NODE_RADIUS * 1.2),
        Phaser.Geom.Circle.Contains
      );

      container.on('pointerover', () => {
        circle.setScale(1.08);
        this.descriptionText.setText(
          `${level.title}\n${level.description}\n${animalPreview}`
        );
        if (!unlocked) {
          this.lockedHintText.setText('Complete previous levels to unlock.');
        } else {
          this.lockedHintText.setText('Click to begin!');
        }
      });

      container.on('pointerout', () => {
        circle.setScale(1);
        this.descriptionText.setText('');
        this.lockedHintText.setText('');
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
}
