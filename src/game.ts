// import { useEffect, useState } from 'react';
import Phaser from 'phaser';
import GameScene from './scenes/GameScene';

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
      gravity: { y: 300 },
    },
  },
  scene: [GameScene],
};

const game = new Phaser.Game(config);
export default game;

// function App() {
//   const [game, setGame] = useState<Phaser.Game>(null as any);

//   useEffect(() => {
//     setGame(new Phaser.Game(config));
//   }, []);
//   return (
//     <>
//       <div>Hello world</div>
//     </>
//   );
// }

// export default App;
