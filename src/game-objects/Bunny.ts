import Phaser from 'phaser';
const BUNNY_KEY = 'bunny';

export default class Bunny {
  private scene: Phaser.Scene;
  private physicsBunny!: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
  private defaultPosition = new Phaser.Math.Vector2(100, 400);

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  create() {
    this.physicsBunny = this.scene.physics.add.image(this.defaultPosition.x, this.defaultPosition.y, BUNNY_KEY).setScale(0.1);
    const customBounds = new Phaser.Geom.Rectangle(0, -150, 800, 600);
    this.physicsBunny.body.setBoundsRectangle(customBounds);

    this.physicsBunny.setCollideWorldBounds(true);
  }

  update(time: number, delta: number): void {
    // nothing for now
  }

  hop() {
    this.physicsBunny.setVelocityY(-300);
  }
}
