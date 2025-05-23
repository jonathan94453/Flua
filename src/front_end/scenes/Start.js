import { DialogSystem } from '../components/DialogSystem.js';
import { calculateCollision, calculateNearestNpc, calculatenpcCollision } from '../components/CollisionFunctions.js';

let firstResponse = "...";

export class Start extends Phaser.Scene {
    constructor() {
        super('Start')
    }
    
    preload() {
        this.load.image("background", "/assets/Grass.png");
        this.load.spritesheet('player', '/assets/Characters_V3_Colour.png', { frameWidth: 16, frameHeight: 16 });
        this.load.image('house1', '/assets/House_v1_1.png');
        this.load.image('house2', '/assets/House_v1_2.png');
        this.load.image('blacksmithhouse', '/assets/BlacksmithHome.png');
        this.load.image('shopkeeperstand', '/assets/ShopkeeperStandSmall.png');

        this.load.image('TalkBox', '/assets/TalkBox.png');

        // Tree v2 sprite preload
        this.load.image('Tree_v2_1', '/assets/Tree_v2_1.png');
        this.load.image('Tree_v2_2', '/assets/Tree_v2_2.png');
        this.load.image('Tree_v2_3', '/assets/Tree_v2_3.png');

        // Tree v3 sprite preload
        this.load.image('Tree_v3_1', '/assets/Tree_v3_1.png');
    }
    
    create() {
        this.background = this.add.tileSprite(640, 360, 1280, 720, 'background');
        
        this.player = this.physics.add.sprite(640, 360, 'player', 0);

        this.house1 = this.physics.add.sprite(5, 30, 'house1');
        this.house2 = this.physics.add.sprite(5, 30, 'house2');
        this.blacksmithhouse = this.physics.add.sprite(1500, 500, 'blacksmithhouse');
        this.shopkeeperstand = this.add.sprite(1200, -900, 'shopkeeperstand');
        this.shopkeeperstand.setScale(0.5); 

        this.structures = [
            this.house1,
            this.house2,
            this.blacksmithhouse,
            this.shopkeeperstand
        ];

        this.frameToggle = false;
        this.time.addEvent({
            delay: 500, // Change the frame every 500 milliseconds (adjust to your preference)
            callback: () => {
                this.frameToggle = !this.frameToggle; // Toggle the frame between true and false
            },
            callbackScope: this,
            loop: true
        });

        // 5 npcs
        this.npcs = [
            this.villager = this.physics.add.sprite(-100, 1000, 'player', 20),
            this.inkeeper = this.physics.add.sprite(0, 200, 'player', 150),
            this.shopkeeper = this.physics.add.sprite(1200, -700, 'player', 60),
            this.farmer = this.physics.add.sprite(950, 1300, 'player', 70),
            this.blacksmith = this.physics.add.sprite(1380, 600, 'player', 130),
        ];

        this.sprites = [
            this.structures, 
            this.villager,
            this.shopkeeper,
            this.farmer,
            this.blacksmith,
            this.inkeeper
        ]

        this.villager.setName("villager");
        this.inkeeper.setName("innkeeper");
        this.shopkeeper.setName("shopkeeper");
        this.farmer.setName("farmer");
        this.blacksmith.setName("blacksmith");

        this.score = 10;
        this.createReputation();
        this.createHintBox();
        this.hintBox.visible = false;

        // Terain Generation ------------------------------
        this.playerX = 0;
        this.playerY = 0;

        // Grid System / Chunk System
        this.gridSize = 800;
        this.changedChunk = true;
        this.currentChunk = this.getChunk(this.playerX, this.playerY, this.gridSize);

        // Trees
        this.trees = []; // Array to hold tree instances
        this.treeSpacing = this.gridSize / 2;
        this.maxTrees = 5; // Max number of trees to display at once.

        // Pine Trees
        this.pineTrees = [];
        this.pineTreeSpacing = this.gridSize / 2;
        this.maxPineTrees = 5;

        // Initialize the random data generator with a fixed seed
        this.rngSeed = 12345
        this.random = new Phaser.Math.RandomDataGenerator([this.rngSeed]); // 12345 is a random seed, change for different patterns.

        // Spawn intial environment assets
        // env, asset, envAssetList, size, maxElements, spacing
        this.spawnEnvAssets('Tree_v2_1', this.trees, 100, this.maxTrees, this.treeSpacing, 0, false);
        this.spawnEnvAssets('Tree_v3_1', this.pineTrees, 100, this.maxPineTrees, this.pineTreeSpacing, 10, true);
        
        // End: Terrain Generation ========================
        
        // Set sizes
        this.player.setDisplaySize(50, 50);

        this.npcs.forEach(npc => {
            npc.setDisplaySize(50 ,50)
            npc.setCollideWorldBounds(false);
            npc.depth = 2;
            }
        )

        this.structures.forEach(struct => {
            struct.setDisplaySize(500,500)
            struct.depth = 1;
        })
        
        // Set physics properties
        this.player.setImmovable(true);
        
        // Track movement directions of player
        this.canMoveRight = true;
        this.canMoveLeft = true;
        this.canMoveUp = true;
        this.canMoveDown = true;

        // Track movement directions of player with respect to structures
        this.canMoveRight_structure = true;
        this.canMoveLeft_structure = true;
        this.canMoveUp_structure = true;
        this.canMoveDown_structure = true;
        
        // Game speed
        this.moveSpeed = 3;
        this.playerSpeed = this.moveSpeed;

        this.physics.world.setBounds(0, 0, 10000, 10000);
        
        this.cursors = this.input.keyboard.createCursorKeys();
    
        this.interactKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

        // Create the dialog system
        this.dialogSystem = new DialogSystem(this);
        this.dialogSystem.depth = 20;

        this.onDialogResponse = (responseNumber) => {
            // Update the score based on the response number
            this.score += responseNumber - 5;
            // Update the reputation display
            this.updateReputationDisplay();
            console.log("Updated score:", this.score);
        };

        // Create the interaction prompt
        this.createInteractionPrompt();
    }
    
    createInteractionPrompt() {
        // Add interaction prompt (initially hidden)
        this.interactionPrompt = this.add.text(640, 280, 'Press E to talk', {
            font: '18px Arial',
            fill: '#ffffff',
            backgroundColor: '#60311f',
            padding: { x: 10, y: 5 }
        });

        this.interactionPrompt.setOrigin(0.5);
        this.interactionPrompt.visible = false;
        this.interactionPrompt.depth = 10;
    }

    createReputation() {
        this.reputation = this.add.text(20, 20, "Reputation: " + this.score, {
            font: '18px Arial',
            fill: '#ffffff',
            backgroundColor: '#60311f',
            padding: { x: 10, y: 5 }
        });
        this.reputation.depth = 7;
    }

    updateReputationDisplay() {
        if (this.reputation) {
            this.reputation.setText("Reputation: " + this.score);
        }
    }

    createHintBox() {
        this.hintBox = this.add.text(1200, 20, "Hint?", {
            font: '18px Arial',
            fill: '#ffffff',
            backgroundColor: '#60311f',
            padding: { x: 10, y: 5 }
        });
        this.hintBox.depth = 5;

        // Make the hint box interactive
        this.hintBox.setInteractive();

        let hintMessage = "...";
        
        // Create the hint bubble (initially hidden)
        this.hintBubble = this.add.container(1100, 100);
        this.hintBubble.depth = 6;
        
        // Background for the hint bubble
        const bubbleBg = this.add.rectangle(0, 0, 300, 150, 0x000000, 0.8);
        bubbleBg.setStrokeStyle(2, 0xffffff);
        
        // Hint text
        this.hintText = this.add.text(0, 0, 
            "Translation: " + hintMessage, 
            {
                font: '16px Arial',
                fill: '#ffffff',
                wordWrap: { width: 280 }
            }
        );
        this.hintText.setOrigin(0.5);
        
        // Add elements to container
        this.hintBubble.add(bubbleBg);
        this.hintBubble.add(this.hintText);
        
        // Hide bubble initially
        this.hintBubble.visible = false;
        
        // Toggle hint bubble on click
        this.hintBox.on('pointerdown', async () => {
            this.hintBubble.visible = !this.hintBubble.visible;
            let latestResponse = this.dialogSystem.getResponse() || firstResponse;
            if (this.hintBubble.visible) {
                try {
                    const response = await fetch(`https://flua-production.up.railway.app/translate?prompt=${latestResponse}`, {
                        method: 'GET'
                    });
                    
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    
                    const data = await response.text();
                    console.log("RESPONSE FROM FLUA API", data);
                    
                    // Update the dialog with the received data
                    this.hintText.setText("Translation: " + data);
                } catch (error) {
                    console.error('Error fetching data:', error);
                    this.hintText.setText("Error loading hint. Try again later.");
                }
            }

            this.score -= 2;
            this.updateReputationDisplay();
        });
        
        // Close hint bubble when clicking elsewhere (optional)
        this.input.on('pointerdown', (pointer) => {
            // Check if click is outside the hint box and bubble
            const clickedHintBox = this.hintBox.getBounds().contains(pointer.x, pointer.y);
            const clickedBubble = this.hintBubble.visible && 
            bubbleBg.getBounds().contains(pointer.x - this.hintBubble.x, pointer.y - this.hintBubble.y);
            
            if (!clickedHintBox && !clickedBubble && this.hintBubble.visible) {
                this.hintBubble.visible = false;
            }
        });
    }
    
    async update() {
        // Calculate distance between player and nearest npc
        const collision = calculatenpcCollision(this.player, this.npcs);
        const structureCollision = calculateCollision(this.player, this.structures);
        this.updateHintVisible();

        const { isColliding, distance, collisionThreshold, movementFlags } = collision;
        const { isStructureColliding, structureDistance, structureCollisionThreshold, structureMovementFlags } = structureCollision;
        
        // Update movement flags
        this.canMoveRight = movementFlags.canMoveRight;
        this.canMoveLeft = movementFlags.canMoveLeft;
        this.canMoveUp = movementFlags.canMoveUp;
        this.canMoveDown = movementFlags.canMoveDown;

        // Update structure movement flags
        this.canMoveRight_structure = structureMovementFlags.canMoveRight_structure;
        this.canMoveLeft_structure = structureMovementFlags.canMoveLeft_structure;
        this.canMoveUp_structure = structureMovementFlags.canMoveUp_structure;
        this.canMoveDown_structure = structureMovementFlags.canMoveDown_structure;
        
        // Handle movement with restrictions
        if(!this.dialogSystem.isActive()) {
            if (this.cursors.right.isDown && this.canMoveRight && this.canMoveRight_structure) {
                this.background.tilePositionX += this.moveSpeed;
                this.npcs.forEach(npc => {
                    npc.x -= this.moveSpeed
                })

                if (this.frameToggle) {
                    this.player.setFrame(8);
                } else {
                    this.player.setFrame(9);
                }

                this.player.setFlipX(false);
                this.playerX += this.playerSpeed;
            }
            else if (this.cursors.left.isDown && this.canMoveLeft && this.canMoveLeft_structure) {
                this.background.tilePositionX -= this.moveSpeed;
                this.npcs.forEach(npc => {
                    npc.x += this.moveSpeed
                })

                if (this.frameToggle) {
                    this.player.setFrame(8);
                } else {
                    this.player.setFrame(9);
                }

                this.player.setFlipX(true);
                this.playerX -= this.playerSpeed;
            }
            else if (this.cursors.down.isDown && this.canMoveDown && this.canMoveDown_structure) {
                this.background.tilePositionY += this.moveSpeed;
                this.npcs.forEach(npc => {
                    npc.y -= this.moveSpeed
                })

                if (this.frameToggle) {
                    this.player.setFrame(4);
                } else {
                    this.player.setFrame(5);
                }
                
                this.playerY += this.playerSpeed;
            }
            else if (this.cursors.up.isDown && this.canMoveUp && this.canMoveUp_structure) {
                this.background.tilePositionY -= this.moveSpeed;
                this.npcs.forEach(npc => {
                    npc.y += this.moveSpeed
                })

                if (this.frameToggle) {
                    this.player.setFrame(6);
                } else {
                    this.player.setFrame(7);
                }

                this.playerY -= this.playerSpeed;
            }
        }

        if (this.score >= 100) {
            this.scene.start('YouWin');
        } else if (this.score <= -50) {
            this.scene.start('YouLose')
        }


        this.updateEnvAssets(this.structures, this.playerSpeed);

        // Show interaction prompt when close to npc
        this.updateInteractionPrompt(isColliding);
        
        // Check for interaction key press when close to npc
        if (Phaser.Input.Keyboard.JustDown(this.interactKey) && isColliding && !this.dialogSystem.isActive()) {
            const npc = calculateNearestNpc(this.player, this.npcs);
            this.dialogSystem.setNpcName(npc.name);
            this.hintBox.visible = true;
            
            
            console.log(npc.name);
            // First show the dialog with a loading message
            this.dialogSystem.showDialog(["..."]);
            
            // Then fetch the data
            try {
                const response = await fetch(`https://localhost:4000/npc/${npc.name}?prompt=init`, {
                    method: 'GET'
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                
                const data = await response.text();
                firstResponse = data;
                console.log("RESPONSE FROM FLUA API", data);
                
                // Update the dialog with the received data
                this.dialogSystem.updateDialogText(data);
            } catch (error) {
                console.error('Error fetching data:', error);
                this.dialogSystem.updateDialogText("Error connecting to server. Please try again.");
            }
        }

        // Terrain Generation
        // env, asset, envAssetList, size, maxElements, spacing
        this.spawnEnvAssets('Tree_v2_1', this.trees, 100, this.maxTrees, this.treeSpacing, 0, false);
        this.spawnEnvAssets('Tree_v3_1', this.pineTrees, 100, this.maxPineTrees, this.pineTreeSpacing, 10, true);
        this.destroyOffScreenEnvAssets(this.trees, this.gridSize, this.cameras);
        this.destroyOffScreenEnvAssets(this.pineTrees, this.gridSize, this.cameras);

        // console.log(!this.arraysEqual(this.currentChunk, this.getChunk(this.playerX, this.playerY, this.gridSize))); // FIXME: Always False
        let chunk = this.getChunk(this.playerX, this.playerY, this.gridSize);
        // console.log(chunk[0] + ", " + chunk[1]); // Always outputting [0, 0]
        //console.log(this.playerX + ", " + this.playerY);
        if (!this.arraysEqual(this.currentChunk, this.getChunk(this.playerX, this.playerY, this.gridSize))) {
            this.currentChunk = this.getChunk(this.playerX, this.playerY, this.gridSize);
            this.changedChunk = true;
        }

        this.updateEnvAssets(this.trees, this.playerSpeed, this.cursors);
        this.updateEnvAssets(this.pineTrees, this.playerSpeed, this.cursors);

    }
    
    updateInteractionPrompt(isNearvillager) {
        if (isNearvillager && !this.dialogSystem.isActive()) {
            this.interactionPrompt.visible = true;
        } else {
            this.interactionPrompt.visible = false;
        }
    }

    updateHintVisible() {
        if (this.dialogSystem.isActive()) {
            this.hintBox.visible = true;
        } else {
            this.hintBox.visible = false;
        }
    }

    // Terrain Generation =====================================================

    getChunk(playerX, playerY, gridSize) {
        // Find the current grid coordinates of the player
        const gridX = Math.floor(playerX / gridSize);
        const gridY = Math.floor(playerY / gridSize);

        return [gridX, gridY];
    }

    generateChunk(gridCoordX, gridCoordY, xChunkDelta, yChunkDelta, maxElements, spacing, seedDelta) {
        // Use the current grid coordinates to generate tree positions
        let positions = [];
        let chunkSeed = gridCoordX + xChunkDelta + gridCoordY + yChunkDelta;
        let random = new Phaser.Math.RandomDataGenerator([chunkSeed + seedDelta]);

        for (let i = 0; i < maxElements; i++) {  // Place 3 trees per grid cell
            // Generate positions deterministically using grid coordinates
            let xPos = this.gridSize * (gridCoordX + xChunkDelta) + 320 + random.realInRange(-1, 1) * spacing - this.playerX;
            let yPos = this.gridSize * (gridCoordY + yChunkDelta) + 160 + random.realInRange(-1, 1) * spacing - this.playerY;

            // Push the tree positions to the array
            positions.push({ x: xPos, y: yPos });
        }

        return positions;
    }


    generatePositions(playerX, playerY, maxElements, spacing, seedDelta) {
        // Find the current grid coordinates of the player
        let gridCoords = this.getChunk(playerX, playerY, this.gridSize);
        let gridCoordX = gridCoords[0];
        let gridCoordY = gridCoords[1];

        // Use the current grid coordinates to generate tree positions
        let positions = [];
        for (let i = -2; i <= 2; i++) {
            for (let j = -2; j <= 2; j++) {
                let tempPos = this.generateChunk(gridCoordX, gridCoordY, i, j, maxElements, spacing, seedDelta);
                tempPos.forEach(pos => {
                    positions.push(pos);
                });
            }
        }

        return positions;
    }

    spawnEnvAssets(asset, envAssetList, size, maxElements, spacing, seedDelta, updateChangedChunk) {
        if (this.changedChunk) {
            console.log("Spawning Assets...");
            // Get the tree positions based on the player's current position
            let positions = this.generatePositions(this.playerX, this.playerY, maxElements, spacing, seedDelta);

            // Create trees at the generated positions
            positions.forEach(pos => {
                let envAssetType = Phaser.Math.RND.pick([asset]);
                let envAsset = this.add.sprite(pos.x, pos.y, envAssetType).setDisplaySize(size, size);
                envAssetList.push(envAsset);
            });

            if (updateChangedChunk) {
                this.changedChunk = false;
            }
        }
    }

    updateEnvAssets(envAssetList, playerSpeed) {
        // Updates the positions of environment assets
        if (!this.dialogSystem.isActive()) {
            for (let i = 0; i < envAssetList.length; i++) {
                if (this.cursors.right.isDown && this.canMoveRight && this.canMoveRight_structure) {
                    envAssetList[i].x -= playerSpeed;
                } else if (this.cursors.left.isDown && this.canMoveLeft && this.canMoveLeft_structure) {
                    envAssetList[i].x += playerSpeed;
                } else if (this.cursors.down.isDown && this.canMoveDown && this.canMoveDown_structure) {
                    envAssetList[i].y -= playerSpeed;
                } else if (this.cursors.up.isDown && this.canMoveUp && this.canMoveUp_structure) {
                    envAssetList[i].y += playerSpeed;
                }
            }
        }
    }

    destroyOffScreenEnvAssets(envAssetList, gridSize, cameras) {
        // Remove environment assets (e.g., trees) that are off camera
        // to reduce resource consumption
        let cameraBounds = cameras.main.worldView;
        envAssetList.forEach(envAsset => {
            if (
                (envAsset.x < cameraBounds.left - gridSize) || (envAsset.x > cameraBounds.right + gridSize) ||
                (envAsset.y < cameraBounds.top - gridSize) || (envAsset.y > cameraBounds.bottom + gridSize)
            ) {
                envAsset.destroy();
            }
        })
    }

    arraysEqual(array1, array2) {
        if (array1.length !== array2.length) {
            return false;
        }

        for (let i = 0; i < array1.length; i++) {
            if (array1[i] !== array2[i]) {
                return false;
            }
        }

        return true;
    }

}