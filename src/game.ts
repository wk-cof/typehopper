import Phaser from 'phaser';
import GameScene from './scenes/GameScene';
import GameMenuScene from './scenes/GameMenuScene';
import LevelMapScene from './scenes/LevelMapScene';

export const LEVEL_DIMENSIONS = {
  x: 780,
  y: 384,
};

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: LEVEL_DIMENSIONS.x,
  height: LEVEL_DIMENSIONS.y,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 450 },
    },
  },
  scene: [LevelMapScene, GameScene, GameMenuScene],
};

const game = new Phaser.Game(config);
export default game;
