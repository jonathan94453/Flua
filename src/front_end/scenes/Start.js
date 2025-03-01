import { DialogSystem } from '../components/DialogSystem.js';
import { calculateCollision } from '../components/CollisionFunctions.js';

export class Start extends Phaser.Scene {
    constructor() {
        super('Start');
        
        // Predefined NPC responses
        this.npcResponses = [
            "Hello there! How can I help you today?",
            "That's interesting. Tell me more about that.",
            "I don't understand. Could you explain differently?",
            "I'm just an NPC in this game. I have limited responses.",
            "What a lovely day in this game world!",
            "Did you know this game was made with Phaser?"
        ];
    }
    
    preload() {
        this.load.image("background", "/assets/GrassTexture.jpg");
        this.load.spritesheet('player', '/assets/Characters_V3_Colour.png', { frameWidth: 16, frameHeight: 16 });
        this.load.image('dialogBox', '/assets/WhiteCircle.png'); // Use an existing asset for now
    }
    
    create() {
        this.background = this.add.tileSprite(640, 360, 1280, 720, 'background');
        
        this.player = this.physics.add.sprite(640, 360, 'player', 0);
        this.npc = this.physics.add.sprite(1000, 360, 'player', 20);
        let reputation = 10;
        
        // Set sizes
        this.player.setDisplaySize(100, 100);
        this.npc.setDisplaySize(100, 100);
        
        // Set physics properties
        this.player.setImmovable(true);
        this.npc.setCollideWorldBounds(false);
        
        // Track movement directions of player
        this.canMoveRight = true;
        this.canMoveLeft = true;
        this.canMoveUp = true;
        this.canMoveDown = true;
        
        // Game speed
        this.moveSpeed = 5;

        this.physics.world.setBounds(0, 0, 10000, 10000);
        
        this.cursors = this.input.keyboard.createCursorKeys();
    
        this.interactKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

        // Create the dialog system
        this.dialogSystem = new DialogSystem(this);

        // Create the interaction prompt
        this.createInteractionPrompt();
    }
    
    createInteractionPrompt() {
        // Add interaction prompt (initially hidden)
        this.interactionPrompt = this.add.text(640, 280, 'Press E to talk', {
            font: '18px Arial',
            fill: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 }
        });

        this.interactionPrompt.setOrigin(0.5);
        this.interactionPrompt.visible = false;
    }

    createReputationDisplay() {
        
    }
    
    update() {
        // Calculate distance between player and NPC
        const collision = calculateCollision(this.player, this.npc);

        const { isColliding, distance, collisionThreshold, movementFlags } = collision;
        
        // Update movement flags
        this.canMoveRight = movementFlags.canMoveRight;
        this.canMoveLeft = movementFlags.canMoveLeft;
        this.canMoveUp = movementFlags.canMoveUp;
        this.canMoveDown = movementFlags.canMoveDown;
        
        // Handle movement with restrictions
        if(!this.dialogSystem.isActive()) {
            if (this.cursors.right.isDown && this.canMoveRight) {
                this.background.tilePositionX += this.moveSpeed;
                this.npc.x -= this.moveSpeed;
            }
            
            if (this.cursors.left.isDown && this.canMoveLeft) {
                this.background.tilePositionX -= this.moveSpeed;
                this.npc.x += this.moveSpeed;
            }
            
            if (this.cursors.down.isDown && this.canMoveDown) {
                this.background.tilePositionY += this.moveSpeed;
                this.npc.y -= this.moveSpeed;
            }
            
            if (this.cursors.up.isDown && this.canMoveUp) {
                this.background.tilePositionY -= this.moveSpeed;
                this.npc.y += this.moveSpeed;
            }
        }

        // Show interaction prompt when close to NPC
        this.updateInteractionPrompt(isColliding);
        
        // Check for interaction key press when close to NPC
        if (Phaser.Input.Keyboard.JustDown(this.interactKey) && isColliding && !this.dialogSystem.isActive()) {
            this.dialogSystem.showDialog(this.npcResponses);
        }

        // Update dialog system
        this.dialogSystem.update();
    }
    
    updateInteractionPrompt(isNearNPC) {
        if (isNearNPC && !this.dialogSystem.isActive()) {
            this.interactionPrompt.visible = true;
        } else {
            this.interactionPrompt.visible = false;
        }
    }
}