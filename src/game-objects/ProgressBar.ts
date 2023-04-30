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
    this.bar = this.scene.add.graphics({
      lineStyle: { width: 0 },
      fillStyle: { color: 0x808080 },
    });
    this.bar.setDepth(10); // Set the depth to a higher value to ensure it's drawn on top of other objects
  }

  draw(x: number, y: number): void {
    const backgroundColor = 0x778899;
    this.bar.clear();

    // Background
    this.bar.fillStyle(backgroundColor, 1);
    this.drawRoundedRect(x, y, 200, 20, 5);
    this.bar.fillPath();

    if (this.progress > 0) {
      // Progress fill
      this.bar.fillStyle(0x008000, 1);
      this.drawRoundedRect(
        x,
        y,
        (this.progress / this.totalProgress) * 200,
        20,
        5
      );
      this.bar.fillPath();
    }
  }

  drawRoundedRect(
    x: number,
    y: number,
    width: number,
    height: number,
    cornerRadius: number
  ): void {
    this.bar.beginPath();
    this.bar.arc(
      x + cornerRadius,
      y + cornerRadius,
      cornerRadius,
      Math.PI,
      1.5 * Math.PI
    );
    this.bar.lineTo(x + width - cornerRadius, y);
    this.bar.arc(
      x + width - cornerRadius,
      y + cornerRadius,
      cornerRadius,
      1.5 * Math.PI,
      2 * Math.PI
    );
    this.bar.lineTo(x + width, y + height - cornerRadius);
    this.bar.arc(
      x + width - cornerRadius,
      y + height - cornerRadius,
      cornerRadius,
      0,
      0.5 * Math.PI
    );
    this.bar.lineTo(x + cornerRadius, y + height);
    this.bar.arc(
      x + cornerRadius,
      y + height - cornerRadius,
      cornerRadius,
      0.5 * Math.PI,
      Math.PI
    );
    this.bar.closePath();
  }

  updateProgress(): void {
    this.progress += 1;
  }
}
