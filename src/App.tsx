import Phaser from 'phaser';

import { HelloWorldScene } from './scenes/HelloWorldScene';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  pysics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 },
    },
  },
};

const dumbstring = 'asdf';

function App() {
  return (
    <>
      <div>Hello world</div>
    </>
  );
}

export default App;
