import Phaser from 'phaser';
import { translate } from '../utils/localization';

export default class GameMenuScene extends Phaser.Scene {
  constructor() {
    super('game-menu-scene');
  }

  preload() {
    this.load.image('menu-background', '../assets/menu-background.png');
  }

  create() {
    // Add background image here
    this.add.image(0, 0, 'menu-background').setOrigin(0, 0);

    // Create a start game button
    const startButton = this.add.text(
      this.scale.width / 2,
      this.scale.height / 2,
      translate('ui.game.start'),
      {
        fontSize: '32px',
        color: '#000',
      }
    );
    startButton.setOrigin(0.5, 0.5);

    // Make the button interactive
    startButton.setInteractive();

    // Listen for the pointer down event on the start button
    startButton.on('pointerdown', () => {
      // Start the game scene
      this.scene.start('game-scene');
    });
  }
}
