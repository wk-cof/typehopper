import Phaser from 'phaser';

const BUNNY_KEY = 'bunny';
const BACKGROUND_KEY = 'backgroudn';

type KeyMaps = {
  [key: string]: {
    emitOnRepeat:boolean;
    enabled: boolean;
    isDown: boolean
    isUp: boolean;
    keyCode: number;

  };
};

export default class GameScene extends Phaser.Scene {
  private bunny!: Phaser.GameObjects.Image;
  private physicsBunny!: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
  private background!: Phaser.GameObjects.Image;
  private keyMaps: KeyMaps = {};
  private letters!: Array<any>;
  private letterPressed: string | undefined;
  constructor() {
    super('game-scene');
  }

  preload() {
    this.load.image(BUNNY_KEY, 'assets/bunny.gif');
    this.load.image(BACKGROUND_KEY, 'assets/background.jpg');

  }

  create() {
    this.background = this.add.image(400, 300, BACKGROUND_KEY);
    this.bunny = this.add.image(400, 300, BUNNY_KEY).setScale(0.1);
    this.physicsBunny = this.physics.add.image(this.bunny.x, this.bunny.y, BUNNY_KEY).setScale(0.1);
    this.letters = [];
    this.input.keyboard?.on('keyup', (event: any) => {
      this.letterPressed = event.key;
    });
  }

  update(time: number, delta: number): void {
    if (!this.letterPressed) {
      // todo: handle jump end
      if (this.physicsBunny.body.allowGravity === true && this.bunny.y >= this.physicsBunny.y) {
        this.physicsBunny.body.allowGravity = false;
      }
      return;
    }
    const closestLetter = this.letters[0];
    if (this.physicsBunny.body.allowGravity === false && this.inJumpDistance(closestLetter)) {
        this.physicsBunny = this.physics.add.image(this.bunny.x, this.bunny.y, BUNNY_KEY).setScale(0.1);
        this.physicsBunny.body.allowGravity = true;
        this.physicsBunny.setVelocity(100, -400);
        this.letterPressed = undefined;
    }
  }

  inJumpDistance(letter: any) {
    // todo
    return true;
  }
}