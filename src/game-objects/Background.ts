// Background.ts
import Phaser from 'phaser';
import { LEVEL_DIMENSIONS } from '../game';

const BACKGROUND_KEY = 'background';

export default class Background {
  private scene: Phaser.Scene;
  private background1!: Phaser.GameObjects.Image;
  private background2!: Phaser.GameObjects.Image;
  private scrollSpeed: number;

  constructor(scene: Phaser.Scene, scrollSpeed: number) {
    this.scene = scene;
    this.scrollSpeed = scrollSpeed;
  }

  preload() {
    // this.scene.load.image(BACKGROUND_KEY, 'assets/background.jpg');
    this.scene.load.image(BACKGROUND_KEY, 'assets/level-2.png');
  }

  create() {
    this.background1 = this.scene.add.image(
      LEVEL_DIMENSIONS.x / 2,
      LEVEL_DIMENSIONS.y / 2,
      BACKGROUND_KEY
    );
    this.background2 = this.scene.add.image(
      LEVEL_DIMENSIONS.x / 2 + LEVEL_DIMENSIONS.x,
      LEVEL_DIMENSIONS.y / 2,
      BACKGROUND_KEY
    );
  }

  update(delta: number) {
    this.background1.x -= (this.scrollSpeed * delta) / 1000;
    this.background2.x -= (this.scrollSpeed * delta) / 1000;

    if (this.background1.x < -LEVEL_DIMENSIONS.x / 2) {
      this.background1.x = LEVEL_DIMENSIONS.x / 2 + LEVEL_DIMENSIONS.x;
    }

    if (this.background2.x < -LEVEL_DIMENSIONS.x / 2) {
      this.background2.x = LEVEL_DIMENSIONS.x / 2 + LEVEL_DIMENSIONS.x;
    }
  }
}
