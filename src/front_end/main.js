import { Start } from './scenes/Start.js';
import { Home } from './scenes/Home.js'
import { UserInfo } from './scenes/UserInfo.js'
import { YouLose } from './scenes/YouLose.js';
import { YouWin } from './scenes/YouWin.js';

const config = {
    type: Phaser.AUTO,
    title: 'Flua',
    parent: 'game-container',
    width: 1280,
    height: 720,
    pixelArt: true,
    physics: {
        default: 'arcade', //the physics engine the game will use
        arcade: {
          debug: false
        }
    },
    scene: [
        Home,
        UserInfo,
        Start, 
        YouLose,
        YouWin 
    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
}
new Phaser.Game(config);