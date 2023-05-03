// Background.ts
import Phaser from 'phaser';
import { LEVEL_DIMENSIONS } from '../game';

const SKY_KEY = 'sky';
const BG_DECOR_KEY = 'bg_decor';
const MIDDLE_DECOR_KEY = 'middle_decor';
const FOREGROUND_KEY = 'foreground';
const GROUND_KEY = 'ground';

export default class Background {
  private scene: Phaser.Scene;
  private scrollSpeed: number;
  private layers: {
    key: string;
    image1: Phaser.GameObjects.Image;
    image2: Phaser.GameObjects.Image;
    speed: number;
  }[];
  private level: number;

  constructor(scene: Phaser.Scene, scrollSpeed: number, level = 4) {
    this.scene = scene;
    this.scrollSpeed = scrollSpeed;
    this.layers = [];
    this.level = level;
  }

  preload() {
    this.scene.load.image(
      SKY_KEY,
      `assets/Cartoon_Forest_BG_0${this.level}/Layers/Sky.png`
    );
    this.scene.load.image(
      BG_DECOR_KEY,
      `assets/Cartoon_Forest_BG_0${this.level}/Layers/BG_Decor.png`
    );
    this.scene.load.image(
      MIDDLE_DECOR_KEY,
      `assets/Cartoon_Forest_BG_0${this.level}/Layers/Middle_Decor.png`
    );
    this.scene.load.image(
      FOREGROUND_KEY,
      `assets/Cartoon_Forest_BG_0${this.level}/Layers/Foreground.png`
    );
    this.scene.load.image(
      GROUND_KEY,
      `assets/Cartoon_Forest_BG_0${this.level}/Layers/Ground.png`
    );
  }

  create() {
    this.layers = [
      {
        key: SKY_KEY,
        image1: this.createImage(SKY_KEY, LEVEL_DIMENSIONS.x / 2),
        image2: this.createImage(SKY_KEY, LEVEL_DIMENSIONS.x * 1.5),
        speed: 0.1,
      },
      {
        key: BG_DECOR_KEY,
        image1: this.createImage(BG_DECOR_KEY, LEVEL_DIMENSIONS.x / 2),
        image2: this.createImage(BG_DECOR_KEY, LEVEL_DIMENSIONS.x * 1.5),
        speed: 0.3,
      },
      {
        key: MIDDLE_DECOR_KEY,
        image1: this.createImage(MIDDLE_DECOR_KEY, LEVEL_DIMENSIONS.x / 2),
        image2: this.createImage(MIDDLE_DECOR_KEY, LEVEL_DIMENSIONS.x * 1.5),
        speed: 0.5,
      },
      {
        key: FOREGROUND_KEY,
        image1: this.createImage(FOREGROUND_KEY, LEVEL_DIMENSIONS.x / 2),
        image2: this.createImage(FOREGROUND_KEY, LEVEL_DIMENSIONS.x * 1.5),
        speed: 0.7,
      },
      {
        key: GROUND_KEY,
        image1: this.createImage(GROUND_KEY, LEVEL_DIMENSIONS.x / 2),
        image2: this.createImage(GROUND_KEY, LEVEL_DIMENSIONS.x * 1.5),
        speed: 1.0,
      },
    ];
  }

  private createImage(key: string, x: number): Phaser.GameObjects.Image {
    const image = this.scene.add
      .image(x, LEVEL_DIMENSIONS.y / 2, key)
      .setOrigin(0.5, 0.5);
    // image.setScale(LEVEL_DIMENSIONS.x / image.width);
    return image;
  }

  update(delta: number) {
    this.layers.forEach(layer => {
      layer.image1.x -= (this.scrollSpeed * layer.speed * delta) / 1000;
      layer.image2.x -= (this.scrollSpeed * layer.speed * delta) / 1000;
      if (layer.image1.x < -LEVEL_DIMENSIONS.x / 2) {
        layer.image1.x = LEVEL_DIMENSIONS.x / 2 + LEVEL_DIMENSIONS.x;
      }

      if (layer.image2.x < -LEVEL_DIMENSIONS.x / 2) {
        layer.image2.x = LEVEL_DIMENSIONS.x / 2 + LEVEL_DIMENSIONS.x;
      }
    });
  }
}
