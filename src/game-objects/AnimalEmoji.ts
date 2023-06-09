import Phaser from 'phaser';

export class AnimalEmoji extends Phaser.GameObjects.Text {
  constructor(scene: Phaser.Scene, x: number, y: number, emoji: string) {
    const style = {
      fontSize: '64px',
      color: '#000000',
      padding: { top: 20, bottom: 20, left: 20, right: 20 },
    };

    super(scene, x, y, emoji, style);
    scene.add.existing(this);
    this.setOrigin(0.5, 0.5);
  }

  create() {
    // Add any setup code you need here
  }

  update() {
    // Add any update logic you need here
  }
}
