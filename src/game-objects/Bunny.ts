// Bunny.ts
import Phaser from 'phaser';
import { LEVEL_DIMENSIONS } from '../game';
const BUNNY_KEY = 'bunny';

export default class Bunny {
  private scene: Phaser.Scene;
  private physicsBunny!: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
  private defaultPosition = new Phaser.Math.Vector2(100, LEVEL_DIMENSIONS.y - 100);
  private chompTween?: Phaser.Tweens.Tween;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  get bunny(): Phaser.Types.Physics.Arcade.ImageWithDynamicBody {
    return this.physicsBunny;
  }

  preload() {
    this.scene.load.image(BUNNY_KEY, 'assets/bunny.gif');
  }

  create() {
    this.physicsBunny = this.scene.physics.add.image(this.defaultPosition.x, this.defaultPosition.y, BUNNY_KEY).setScale(0.1);
    const customBounds = new Phaser.Geom.Rectangle(0, -40, LEVEL_DIMENSIONS.x, LEVEL_DIMENSIONS.y);
    this.physicsBunny.body.setBoundsRectangle(customBounds);

    this.physicsBunny.setCollideWorldBounds(true);
  }

  update(): void {
    // nothing for now
  }

  hop() {
    this.physicsBunny.setVelocityY(-300);
  }

  consumeCollectible(): void {
    if (!this.physicsBunny) {
      return;
    }

    this.hop();

    const startX = this.physicsBunny.x;
    this.chompTween?.stop();
    this.chompTween = this.scene.tweens.add({
      targets: this.physicsBunny,
      x: startX + 28,
      duration: 140,
      ease: 'Sine.easeOut',
      yoyo: true,
    });

    this.scene.tweens.add({
      targets: this.physicsBunny,
      scale: { from: 0.1, to: 0.115 },
      duration: 120,
      ease: 'Sine.easeOut',
      yoyo: true,
    });
  }

  getCatchPoint(): Phaser.Math.Vector2 {
    if (!this.physicsBunny) {
      return this.defaultPosition.clone();
    }

    const forwardOffset = this.physicsBunny.displayWidth * 0.6;
    const verticalOffset = this.physicsBunny.displayHeight * 0.35;

    return new Phaser.Math.Vector2(
      this.physicsBunny.x + forwardOffset,
      this.physicsBunny.y - verticalOffset
    );
  }

  resetPosition(): void {
    if (!this.physicsBunny) {
      return;
    }

    this.physicsBunny.setVelocity(0, 0);
    this.physicsBunny.setPosition(this.defaultPosition.x, this.defaultPosition.y);
    this.physicsBunny.setScale(0.1);
  }
}
