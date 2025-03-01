
export class UserInfo extends Phaser.Scene { 
    constructor() {
        super('UserInfo');
    }

    create() {
        // Name input text
        this.add.text(400, 100, 'Enter your name:', {
            fontSize: '24px',
            fill: '#fff'
        }).setOrigin(0.5);

        const nameInput = this.add.dom(400, 150).createFromHTML('<input type="text" id="nameInput" placeholder="Your name" />');
        
        // Language selection
        this.add.text(400, 250, 'Select your language:', {
            fontSize: '24px',
            fill: '#fff'
        }).setOrigin(0.5);

        const englishButton = this.add.text(400, 300, 'English', {
            fontSize: '24px',
            fill: '#fff'
        }).setOrigin(0.5).setInteractive();
        
        const spanishButton = this.add.text(400, 350, 'Spanish', {
            fontSize: '24px',
            fill: '#fff'
        }).setOrigin(0.5).setInteractive();

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
    }
}
