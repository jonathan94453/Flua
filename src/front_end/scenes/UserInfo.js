
export class UserInfo extends Phaser.Scene { 
    constructor() {
        super('UserInfo');
    }

    preload() {
        // Load the images for the language buttons
        this.load.image('english_button', '/assets/English Button.png');
        this.load.image('spanish_button', '/assets/Spanish Button.png');
        this.load.image('german_button', '/assets/German Button.png');
        this.load.image('french_button', '/assets/French Button.png');
        this.load.image('russian_button', '/assets/Russian Button.png');
    }

    create() {
        
        this.cameras.main.setBackgroundColor('#4a6fb5')
        
        // Language selection
        this.add.text(640, 150, 'Select your language:', {
            fontSize: '24px',
            fill: '#fff'
        }).setOrigin(0.5);
        
        const englishButton = this.add.image(640, 225, 'english_button').setDisplaySize(200, 200).setInteractive();

        const spanishButton = this.add.image(640, 300, 'spanish_button').setDisplaySize(200, 200).setInteractive();

        const germanButton = this.add.image(640, 375, 'german_button').setDisplaySize(200, 200).setInteractive();
        
        const frenchButton = this.add.image(640, 450, 'french_button').setDisplaySize(200, 200).setInteractive();
        
        const russianButton = this.add.image(640, 525, 'russian_button').setDisplaySize(200, 200).setInteractive();
        
        englishButton.on('pointerdown', () => {
            fetch('http://localhost:4000/set_language?value=english', {
                method: 'POST'
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.text();
            })
            .then(data => {
                console.log("RESPONSE FROM FLUA API", data); // Handle the response
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
            this.scene.start('Start');
        })

        spanishButton.on('pointerdown', () => {
            fetch('http://localhost:4000/set_language?value=spanish', {
                method: 'POST'
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.text();
            })
            .then(data => {
                console.log("RESPONSE FROM FLUA API", data); // Handle the response
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
            this.scene.start('Start');
        });

        germanButton.on('pointerdown', () => {
            fetch('http://localhost:4000/set_language?value=german', {
                method: 'POST'
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.text();
            })
            .then(data => {
                console.log("RESPONSE FROM FLUA API", data); // Handle the response
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
            this.scene.start('Start');
        });

        frenchButton.on('pointerdown', () => {
            fetch('http://localhost:4000/set_language?value=french', {
                method: 'POST'
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.text();
            })
            .then(data => {
                console.log("RESPONSE FROM FLUA API", data); // Handle the response
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
            this.scene.start('Start');
        });

        russianButton.on('pointerdown', () => {
            fetch('http://localhost:4000/set_language?value=russian', {
                method: 'POST'
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.text();
            })
            .then(data => {
                console.log("RESPONSE FROM FLUA API", data); // Handle the response
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
            this.scene.start('Start');
        });
    }
}
