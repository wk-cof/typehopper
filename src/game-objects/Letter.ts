// Letter.ts
import Phaser from 'phaser';

export default class Letter {
  private scene: Phaser.Scene;
  public letter: string;
  private text: Phaser.GameObjects.Text;
  private letterSpeed: number;

  constructor(
    scene: Phaser.Scene,
    letter: string,
    x: number,
    y: number,
    letterSpeed: number
  ) {
    this.scene = scene;
    this.letter = letter;
    this.letterSpeed = letterSpeed;

    // Generate a random color for the letter
    const randomColor = Phaser.Display.Color.RandomRGB().rgba;

    this.text = this.scene.add.text(x, y, this.letter.toUpperCase(), {
      fontSize: '64px',
      color: randomColor,
      fontStyle: 'bold',
      stroke: '#000',
      strokeThickness: 2,
    });
  }

  get letterObject(): Phaser.GameObjects.Text {
    return this.text;
  }

  update(_time: number, delta: number, lockThreshold?: number): void {
    if (
      typeof lockThreshold === 'number' &&
      this.text.x <= lockThreshold
    ) {
      this.text.x = lockThreshold;
      return;
    }

    this.text.x -= (this.letterSpeed * delta) / 1000;
  }

  getGameObject(): Phaser.GameObjects.Text {
    return this.text;
  }

  destroy(): void {
    this.text.destroy();
  }
}
