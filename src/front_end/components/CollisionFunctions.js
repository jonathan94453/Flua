export function calculateCollision(player, entity) {
    // Calculate distance between player and entity
    const dx = entity.x - player.x;
    const dy = entity.y - player.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Determine collision threshold based on sprite sizes
    const collisionThreshold = (player.displayWidth + entity.displayWidth) / 2;
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
        // Calculate collision angle
        const angle = Math.atan2(dy, dx);
        
        // Determine blocked directions based on collision angle
        if (Math.abs(angle) < Math.PI / 4) movementFlags.canMoveRight = false; // Entity is to the right
        if (Math.abs(angle) > 3 * Math.PI / 4) movementFlags.canMoveLeft = false; // Entity is to the left
        if (angle > 0 && angle < Math.PI / 2) movementFlags.canMoveDown = false; // Entity is below-right
        if (angle > Math.PI / 2 && angle < Math.PI) movementFlags.canMoveDown = false; // Entity is below-left
        if (angle < 0 && angle > -Math.PI / 2) movementFlags.canMoveUp = false; // Entity is above-right
        if (angle < -Math.PI / 2 && angle > -Math.PI) movementFlags.canMoveUp = false; // Entity is above-left
    }

    return {
        isColliding,
        distance,
        collisionThreshold,
        angle: isColliding ? Math.atan2(dy, dx) : null,
        movementFlags
    };
}