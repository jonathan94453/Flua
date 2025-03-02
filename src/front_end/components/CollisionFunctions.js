export function calculateCollision(player, npcs) {
    let nearestNpc = null;
    let shortestDistance = Infinity;
    let collisionResult = null;
    
    // Find the nearest NPC
    npcs.forEach(npc => {
        const dx = npc.x - player.x;
        const dy = npc.y - player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < shortestDistance) {
            shortestDistance = distance;
            nearestNpc = npc;
        }
    });
    
    // If no NPCs found, return default values
    if (!nearestNpc) {
        return {
            isColliding: false,
            distance: Infinity,
            collisionThreshold: 0,
            angle: null,
            movementFlags: {
                canMoveRight: true,
                canMoveLeft: true,
                canMoveUp: true,
                canMoveDown: true
            },
            nearestNpc: null
        };
    }
    
    // Calculate collision with the nearest NPC
    const dx = nearestNpc.x - player.x;
    const dy = nearestNpc.y - player.y;
    const distance = shortestDistance; // We already calculated this
    
    // Determine collision threshold based on sprite sizes
    const collisionThreshold = (player.displayWidth + nearestNpc.displayWidth) / 1.5;
    const isColliding = distance < collisionThreshold;
    
    // Initialize movement flags
    const movementFlags = {
        canMoveRight: true,
        canMoveLeft: true,
        canMoveUp: true,
        canMoveDown: true
    };
    
    // If colliding, restrict movement based on relative positions
    if (isColliding) {
        // Calculate collision angle in radians
        const angle = Math.atan2(dy, dx);
        
        // Convert to degrees for easier debugging
        const angleDegrees = angle * (180 / Math.PI);
        
        // Use more inclusive angle ranges with slight overlaps to prevent edge cases
        // Right: -45° to 45° (entity is to the right)
        if (angleDegrees >= -45 && angleDegrees <= 45) 
            movementFlags.canMoveRight = false;
        
        // Left: 135° to 180° and -180° to -135° (entity is to the left)
        if (angleDegrees >= 135 || angleDegrees <= -135) 
            movementFlags.canMoveLeft = false;
        
        // Down: 45° to 135° (entity is below)
        if (angleDegrees >= 45 && angleDegrees <= 135) 
            movementFlags.canMoveDown = false;
        
        // Up: -135° to -45° (entity is above)
        if (angleDegrees >= -135 && angleDegrees <= -45) 
            movementFlags.canMoveUp = false;
    }
    
    return {
        isColliding,
        distance,
        collisionThreshold,
        angle: isColliding ? Math.atan2(dy, dx) : null,
        movementFlags,
        nearestNpc // Return the nearest NPC for reference
    };
}