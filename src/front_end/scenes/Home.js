export class Home extends Phaser.Scene
{
    constructor()
    {
        super('Home');
    }

    preload()
    {
        this.load.image('start', "/assets/StartButton.png")
        this.load.image('title', "/assets/Title.png")
    }

    create() {
        this.cameras.main.setBackgroundColor('#4a6fb5')
        const title = this.add.image(640, 200, 'title')
        .setOrigin(0.5)
        .setDisplaySize(500,500)

        const description = this.add.text(640, 450, 'Learn language by interacting with villagers in a small town! Select your language and embark on a journey to become fluent!', {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#ffffff',
            align: 'center',
            wordWrap: { width: 700 }
        }).setOrigin(0.5);

        // Start Button
        const startButton = this.add.image(640, 550, 'start')
        .setOrigin(0.5)
        .setInteractive()
        .setDisplaySize(500,500);

        startButton.on('pointerdown', () => {
            console.log("test");
            this.scene.start('UserInfo'); // Transition to Name and Language selection screen
        });

        // Optionally add more buttons for language and other settings.
    }
}