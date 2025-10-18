import Phaser from 'phaser';

export default class CarrotCollectible {
  private scene: Phaser.Scene;
  private sprite?: Phaser.GameObjects.Image;
  private liftTween?: Phaser.Tweens.Tween;
  private hoverTween?: Phaser.Tweens.Tween;
  private readonly horizontalSpeed: number;
  private collected = false;
  private lastKnownPosition: Phaser.Math.Vector2;
  private readonly letterText?: Phaser.GameObjects.Text;
  private readonly letterVerticalOffset: number;

  constructor(
    scene: Phaser.Scene,
    start: Phaser.Math.Vector2,
    horizontalSpeed: number,
    letterText?: Phaser.GameObjects.Text
  ) {
    this.scene = scene;
    this.horizontalSpeed = horizontalSpeed;
    this.lastKnownPosition = start.clone();
    this.letterText = letterText;

    this.sprite = this.scene.add
      .image(start.x, start.y, 'carrot-coin')
      .setScale(0.08)
      .setDepth(5);

    const floatOffset = 100;
    this.letterVerticalOffset = floatOffset - 70;
    if (this.letterText) {
      this.letterText.setOrigin(0.5, 1);
      this.letterText.setDepth(6);
      this.letterText.setFontSize(36);
      this.letterText.setPosition(
        start.x,
        start.y - this.letterVerticalOffset
      );
    }
    this.liftTween = this.scene.tweens.add({
      targets: this.sprite,
      y: start.y - floatOffset,
      duration: 200,
      ease: 'Sine.easeOut',
      onComplete: () => {
        if (!this.sprite) {
          return;
        }
        this.hoverTween = this.scene.tweens.add({
          targets: this.sprite,
          y: this.sprite.y + 8,
          duration: 420,
          ease: 'Sine.easeInOut',
          yoyo: true,
          repeat: -1,
        });
      },
    });
  }

  update(delta: number): void {
    if (this.collected || !this.sprite) {
      return;
    }

    const distance = (this.horizontalSpeed * delta) / 1000;
    this.sprite.x -= distance;
    this.lastKnownPosition.set(this.sprite.x, this.sprite.y);

    if (this.letterText) {
      this.letterText.setPosition(
        this.sprite.x,
        this.sprite.y - this.letterVerticalOffset
      );
    }
  }

  shouldCollect(catchPoint: Phaser.Math.Vector2): boolean {
    if (this.collected || !this.sprite) {
      return false;
    }

    if (this.sprite.x > catchPoint.x) {
      return false;
    }

    const verticalDelta = Math.abs(this.sprite.y - catchPoint.y);
    return verticalDelta <= 90;
  }

  getPosition(): Phaser.Math.Vector2 {
    if (this.sprite) {
      return new Phaser.Math.Vector2(this.sprite.x, this.sprite.y);
    }
    return this.lastKnownPosition.clone();
  }

  collect(): void {
    if (this.collected) {
      return;
    }

    this.collected = true;
    if (this.sprite) {
      this.lastKnownPosition.set(this.sprite.x, this.sprite.y);
      this.liftTween?.stop();
      this.hoverTween?.stop();
      this.scene.tweens.killTweensOf(this.sprite);
      this.sprite.destroy();
      this.sprite = undefined;
    }
    if (this.letterText) {
      this.scene.tweens.killTweensOf(this.letterText);
      this.letterText.destroy();
    }
  }

  destroy(): void {
    this.collect();
  }
}
