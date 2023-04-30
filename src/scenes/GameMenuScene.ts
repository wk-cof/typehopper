import Phaser from 'phaser';

export default class GameMenuScene extends Phaser.Scene {
  constructor() {
    super('game-menu-scene');
  }

  preload() {
    // Load background image here
    // this.load.image('menu-background', 'path/to/menu-background.png');
  }

  create() {
    // Add background image here
    // this.add.image(0, 0, 'menu-background').setOrigin(0, 0);

    // Create a start game button
    const startButton = this.add.text(
      this.scale.width / 2,
      this.scale.height / 2,
      'Start Game',
      {
        fontSize: '32px',
        color: '#ffffff',
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
