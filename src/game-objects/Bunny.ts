// Bunny.ts
import Phaser from 'phaser';
import { LEVEL_DIMENSIONS } from '../game';
const BUNNY_KEY = 'bunny';

export default class Bunny {
  private scene: Phaser.Scene;
  private physicsBunny!: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
  private defaultPosition = new Phaser.Math.Vector2(100, LEVEL_DIMENSIONS.y - 100);

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
}
