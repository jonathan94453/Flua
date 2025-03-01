const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

function preload() {
    this.load.image('logo', 'assets/phaser3-logo.png'); // Example asset
}

function create() {
   this.add.text(300, 250, 'Hello, World!', { fontSize: '32px', fill: '#fff' });
}

function update() {
    // Game loop logic
}
