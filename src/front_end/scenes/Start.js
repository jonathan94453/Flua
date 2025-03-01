export class Start extends Phaser.Scene
{
    constructor()
    {
        super('Start');
    }

    preload()
    {
        this.load.image("background", "/assets/GrassTexture.jpg");
        this.load.image('logo', '/assets/phaser.png');
        this.load.image('player', '/assets/WhiteCircle.png');

        //  The ship sprite is CC0 from https://ansimuz.itch.io - check out his other work!
        this.load.spritesheet('ship', '/assets/spaceship.png', { frameWidth: 176, frameHeight: 96 });
    }

    create()
    {
        this.background = this.add.tileSprite(640, 360, 1280, 720, 'background');

        const logo = this.add.image(640, 200, 'logo');

        const player = this.add.sprite(640, 360, 'player');
        player.setDisplaySize(100, 100);

        this.cursors = this.input.keyboard.createCursorKeys();

    }

    update()
    {
        if (this.cursors.right.isDown) {
            this.background.tilePositionX += 5;
        }

        if (this.cursors.left.isDown) {
            this.background.tilePositionX -= 5;
        }

        if (this.cursors.down.isDown) {
            this.background.tilePositionY += 5;
        }

        if (this.cursors.up.isDown) {
            this.background.tilePositionY -= 5;
        }
        
    }
}

