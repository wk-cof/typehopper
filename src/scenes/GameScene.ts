import Phaser from 'phaser';

const BUNNY_KEY = 'bunny';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('game-scene');
  }

  preload() {
    this.load.image(BUNNY_KEY, 'assets/bunny.gif');
  }

  create() {
    this.add.image(400, 300, BUNNY_KEY).setScale(0.1);
  }
}