import Phaser from 'phaser';

export default class CarrotCollectible {
  private scene: Phaser.Scene;
  private sprite?: Phaser.GameObjects.Image;
  private liftTween?: Phaser.Tweens.Tween;
  private hoverTween?: Phaser.Tweens.Tween;
  private readonly horizontalSpeed: number;
  private collected = false;
  private lastKnownPosition: Phaser.Math.Vector2;

  constructor(scene: Phaser.Scene, start: Phaser.Math.Vector2, horizontalSpeed: number) {
    this.scene = scene;
    this.horizontalSpeed = horizontalSpeed;
    this.lastKnownPosition = start.clone();

    this.sprite = this.scene.add
      .image(start.x, start.y, 'carrot-coin')
      .setScale(0.08)
      .setDepth(5);

    const floatOffset = 80;
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
  }

  destroy(): void {
    this.collect();
  }
}
