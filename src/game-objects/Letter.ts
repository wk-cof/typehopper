import Phaser from 'phaser';

export default class Letter {
  private scene: Phaser.Scene;
  private letter: string;
  private text: Phaser.GameObjects.Text;
  private letterSpeed: number;

  constructor(scene: Phaser.Scene, letter: string, x: number, y: number, letterSpeed: number) {
    this.scene = scene;
    this.letter = letter;
    this.letterSpeed = letterSpeed;
    this.text = this.scene.add.text(x, y, this.letter, { fontSize: '32px', color: '#000' });
  }

  update(time: number, delta: number): void {
    this.text.x -= this.letterSpeed * delta / 1000;
  }

  getGameObject(): Phaser.GameObjects.Text {
    return this.text;
  }
}
