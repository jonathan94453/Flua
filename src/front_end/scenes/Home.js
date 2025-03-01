export class Home extends Phaser.Scene
{
    constructor()
    {
        super('Home');
    }

    preload()
    {

    }

    create() {
        // Background setup
        this.add.text(400, 100, 'Welcome to Flua', {
            fontSize: '32px',
            fill: '#fff'
        }).setOrigin(0.5);

        // Start Button
        const startButton = this.add.text(400, 200, 'Start Game', {
            fontSize: '24px',
            fill: '#0f0'
        }).setOrigin(0.5).setInteractive();

        startButton.on('pointerdown', () => {
            console.log("test");
            this.scene.start('UserInfo'); // Transition to Name and Language selection screen
        });

        // Optionally add more buttons for language and other settings.
    }
}