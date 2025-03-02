import { extractNumber, extractTextAfterNumber } from "../utils/utils.js";
import { calculateNearestNpc } from '../components/CollisionFunctions.js';

export class DialogSystem {
    constructor(scene) {
        this.scene = scene;
        this.dialogActive = false;
        this.userInput = ""; // Store user input
        this.isTyping = false; // Track if user is typing
        this.currentNpc = null;
        
        // Create UI elements
        this.createDialogElements();
        
        // Setup keyboard handler
        this.keyHandler = (event) => this.handleKeyInput(event);
        this.scene.input.keyboard.on('keydown', this.keyHandler);
        
        // Hide dialog initially
        this.hideDialog();
    }

    setNpcName(npcname) {
        this.currentNpc = npcname;
    }
    
    createDialogElements() {
        // quit key
        this.qKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        
        // Create a group for dialog elements
        this.dialogGroup = this.scene.add.group();
        
        // Create dialog background
        this.dialogBox = this.scene.add.rectangle(640, 600, 800, 200, 0x000000, 0.7);
        this.dialogBox.setOrigin(0.5);
        this.dialogBox.setStrokeStyle(4, 0xffffff);
        
        // Create NPC dialog text
        this.dialogText = this.scene.add.text(640, 550, '', {
            font: '24px Arial',
            fill: '#ffffff',
            wordWrap: { width: 760, useAdvancedWrap: true }
        });
        this.dialogText.setOrigin(0.5);
        
        // Create input field background
        this.inputBox = this.scene.add.rectangle(640, 640, 760, 40, 0x333333, 1);
        this.inputBox.setOrigin(0.5);
        this.inputBox.setStrokeStyle(2, 0xffffff);
        
        // Create input text
        this.inputText = this.scene.add.text(270, 640, '', {
            font: '20px Arial',
            fill: '#ffffff'
        });
        this.inputText.setOrigin(0, 0.5);
        
        // Create instruction text
        this.instructionText = this.scene.add.text(640, 680, 'Type your message and press ENTER to send. Enter q to quit dialog.', {
            font: '16px Arial',
            fill: '#cccccc'
        });
        this.instructionText.setOrigin(0.5);
        
        // Add elements to dialog group
        this.dialogGroup.add(this.dialogBox);
        this.dialogGroup.add(this.dialogText);
        this.dialogGroup.add(this.inputBox);
        this.dialogGroup.add(this.inputText);
        this.dialogGroup.add(this.instructionText);

        this.dialogGroup.setDepth(10);
    }
    
    update() {
        // Check for quit key
        if (Phaser.Input.Keyboard.JustDown(this.qKey) && this.dialogActive) {
            this.hideDialog();
        }
        
        // Update blinking cursor
        if (this.dialogActive && this.isTyping) {
            this.updateInputText();
        }
    }
    
    showDialog(responses) {
        // Set dialog as active
        this.dialogActive = true;
        this.isTyping = true;
        
        // Set responses if provided
        if (responses) {
            this.responses = responses;
        }
        
        // Show dialog elements
        this.dialogGroup.setVisible(true);
        
        // Set initial NPC dialog
        this.dialogText.setText(responses);
        
        // Clear user input
        this.userInput = "";
        this.inputText.setText(this.userInput);
    }
    
    hideDialog() {
        // Hide dialog elements
        this.dialogGroup.setVisible(false);
        
        // Set dialog as inactive
        this.dialogActive = false;
        this.isTyping = false;
        
        // Clear input
        this.userInput = "";
    }
    
    handleKeyInput(event) {
        if (!this.dialogActive || !this.isTyping) return;
        
        // Handle Enter key - submit input
        if (event.keyCode === 13 && this.userInput.trim() !== '') {
            this.submitUserInput();
            return;
        }
        
        // Handle backspace
        if (event.keyCode === 8 && this.userInput.length > 0) {
            this.userInput = this.userInput.slice(0, -1);
            this.updateInputText();
            return;
        }
        
        // Handle printable characters (32-126 ASCII range)
        if (event.keyCode >= 32 && event.keyCode <= 126) {
            // Limit input length to prevent overflow
            if (this.userInput.length < 50) {
                this.userInput += event.key;
                this.updateInputText();
            }
        }
    }
    
    updateInputText() {
        this.inputText.setText(this.userInput + (this.scene.time.now % 1000 < 500 ? '|' : '')); // Add blinking cursor
    }
    
    updateDialogText(text) {
        if (this.dialogActive) {
            this.dialogText.setText(text);
        }
    }

    async submitUserInput() {
        // Get the user's message
        const userMessage = this.userInput.trim();
        
        // Clear the input box for next message
        this.userInput = '';
        this.inputText.setText('');
        
        // Show user message briefly above NPC's response
        this.dialogText.setText("You: " + userMessage);
        if (userMessage == "q") {
            this.hideDialog();
        } else {
            try {
                const response = await fetch(`http://localhost:4000/npc/${this.currentNpc}?prompt=${userMessage}`, {
                    method: 'GET'
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                
                const data = await response.text();
                console.log("RESPONSE FROM FLUA API in dialog system", data);
                this.responseNumber = extractNumber(data) || 0;
                console.log(this.responseNumber);
                this.responseText = extractTextAfterNumber(data);
                console.log(this.responseText);
                this.dialogText.setText(this.responseText);

                if (this.scene.onDialogResponse) {
                    this.scene.onDialogResponse(this.responseNumber);
                }
                if (this.scene.onDialogText) {
                    this.scene.onDialogText(this.responseText);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                this.dialogText.setText('Error connecting to server');
            }
        }
    }

    getResponseNumber() {
        return this.responseNumber || 0;
    }
    getResponse() {
        return this.responseText;
    }
    
    isActive() {
        return this.dialogActive;
    }
    
    destroy() {
        // Remove event listener
        this.scene.input.keyboard.off('keydown', this.keyHandler);
        
        // Destroy dialog elements
        if (this.dialogGroup) {
            this.dialogGroup.destroy(true);
        }
    }
}