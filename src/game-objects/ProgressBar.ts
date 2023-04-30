// ProgressBar.ts
import Phaser from 'phaser';

export default class ProgressBar {
  private scene: Phaser.Scene;
  private bar: Phaser.GameObjects.Graphics;
  private progress: number;
  private totalProgress: number;

  constructor(scene: Phaser.Scene, totalProgress: number) {
    this.scene = scene;
    this.totalProgress = totalProgress;
    this.progress = 0;
    this.bar = this.scene.add.graphics({ lineStyle: { width: 0 }, fillStyle: { color: 0x808080 } });
    this.bar.setDepth(10); // Set the depth to a higher value to ensure it's drawn on top of other objects
  }


  draw(x: number, y: number): void {
    this.bar.clear();
    this.bar.fillStyle(0x808080, 1);
    this.bar.fillRect(x, y, 200, 20);
    this.bar.fillStyle(0x00ff00, 1);
    this.bar.fillRect(x, y, (this.progress / this.totalProgress) * 200, 20);
  }

  updateProgress(): void {
    this.progress += 1;
  }
}
