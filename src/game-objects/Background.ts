// Background.ts
import Phaser from 'phaser';

const BACKGROUND_KEY = 'background';

export default class Background {
  private scene: Phaser.Scene;
  private background!: Phaser.GameObjects.Image;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  preload() {
    this.scene.load.image(BACKGROUND_KEY, 'assets/background.jpg');
  }

  create() {
    this.background = this.scene.add.image(400, 300, BACKGROUND_KEY);
  }
}
