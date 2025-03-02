export class YouLose extends Phaser.Scene
{
    constructor()
    {
        super('YouLose');
    }

    preload()
    {
        this.load.image('title', "/assets/Title.png")
    }

    create() {
        this.cameras.main.setBackgroundColor('#4a6fb5')
        const title = this.add.image(640, 200, 'title')
        .setOrigin(0.5)
        .setDisplaySize(500,500)

        const description = this.add.text(640, 430, 'You Lose!', {
            fontFamily: 'Arial',
            fontSize: '80px',
            color: '#FFFF',
            align: 'center',
            wordWrap: { width: 700 }
        }).setOrigin(0.5);

        const description2 = this.add.text(640, 510, '\n maybe you should stick with your native language. :) ', {
            fontFamily: 'Arial',
            fontSize: '40px',
            color: '#FFFF',
            align: 'center',
            wordWrap: { width: 700 }
        }).setOrigin(0.5);

    }
}