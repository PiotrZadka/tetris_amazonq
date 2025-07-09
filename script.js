// Game variables
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const nextCanvas = document.getElementById('nextPieceCanvas');
const nextCtx = nextCanvas.getContext('2d');
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const BLOCK_SIZE = 30;
const NEXT_BLOCK_SIZE = 20;

// Amazon brand colors
const COLORS = {
    empty: '#000000',
    I: '#FF9900', // Amazon orange
    O: '#232F3E', // Amazon dark blue
    T: '#FF4B4B', // Red
    S: '#4CAF50', // Green
    Z: '#9C27B0', // Purple
    J: '#2196F3', // Blue
    L: '#FF9800'  // Orange variant
};

// Tetris pieces with proper I piece rotations
const PIECES = {
    I: [
        [[0,0,0,0],
         [1,1,1,1],
         [0,0,0,0],
         [0,0,0,0]],
        [[0,0,1,0],
         [0,0,1,0],
         [0,0,1,0],
         [0,0,1,0]],
        [[0,0,0,0],
         [0,0,0,0],
         [1,1,1,1],
         [0,0,0,0]],
        [[0,1,0,0],
         [0,1,0,0],
         [0,1,0,0],
         [0,1,0,0]]
    ],
    O: [
        [[1,1],
         [1,1]]
    ],
    T: [
        [[0,1,0],
         [1,1,1]],
        [[1,0],
         [1,1],
         [1,0]],
        [[1,1,1],
         [0,1,0]],
        [[0,1],
         [1,1],
         [0,1]]
    ],
    S: [
        [[0,1,1],
         [1,1,0]],
        [[1,0],
         [1,1],
         [0,1]]
    ],
    Z: [
        [[1,1,0],
         [0,1,1]],
        [[0,1],
         [1,1],
         [1,0]]
    ],
    J: [
        [[1,0,0],
         [1,1,1]],
        [[1,1],
         [1,0],
         [1,0]],
        [[1,1,1],
         [0,0,1]],
        [[0,1],
         [0,1],
         [1,1]]
    ],
    L: [
        [[0,0,1],
         [1,1,1]],
        [[1,0],
         [1,0],
         [1,1]],
        [[1,1,1],
         [1,0,0]],
        [[1,1],
         [0,1],
         [0,1]]
    ]
};

// Game state
let board = Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill(0));
let currentPiece = null;
let nextPiece = null;
let pieceBag = [];
let currentX = 0;
let currentY = 0;
let currentRotation = 0;
let score = 0;
let lines = 0;
let level = 1;
let gameRunning = true;
let isPaused = false;
let dropTime = 0;
let dropInterval = 1000;

// Initialize game
function init() {
    fillPieceBag();
    nextPiece = getNextPieceFromBag();
    spawnPiece();
    drawNextPiece();
    gameLoop();
}

// Piece bag system for fair randomization
function fillPieceBag() {
    const pieces = Object.keys(PIECES);
    pieceBag = [...pieces];
    // Shuffle the bag
    for (let i = pieceBag.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pieceBag[i], pieceBag[j]] = [pieceBag[j], pieceBag[i]];
    }
}

// Get next piece from bag
function getNextPieceFromBag() {
    if (pieceBag.length === 0) {
        fillPieceBag();
    }
    return pieceBag.pop();
}

// Spawn new piece
function spawnPiece() {
    currentPiece = nextPiece;
    nextPiece = getNextPieceFromBag();
    currentRotation = 0;
    currentX = Math.floor(BOARD_WIDTH / 2) - 1;
    currentY = 0;

    // Adjust starting position for I piece
    if (currentPiece === 'I') {
        currentX = Math.floor(BOARD_WIDTH / 2) - 2;
        currentY = -1;
    }

    drawNextPiece();

    if (isCollision()) {
        gameOver();
    }
}

// Check collision
function isCollision(piece = currentPiece, x = currentX, y = currentY, rotation = currentRotation) {
    const shape = PIECES[piece][rotation];
    
    for (let py = 0; py < shape.length; py++) {
        for (let px = 0; px < shape[py].length; px++) {
            if (shape[py][px]) {
                const newX = x + px;
                const newY = y + py;
                
                if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
                    return true;
                }
                
                if (newY >= 0 && board[newY][newX]) {
                    return true;
                }
            }
        }
    }
    return false;
}

// Place piece on board
function placePiece() {
    const shape = PIECES[currentPiece][currentRotation];
    
    for (let py = 0; py < shape.length; py++) {
        for (let px = 0; px < shape[py].length; px++) {
            if (shape[py][px]) {
                const boardX = currentX + px;
                const boardY = currentY + py;
                if (boardY >= 0) {
                    board[boardY][boardX] = currentPiece;
                }
            }
        }
    }
    
    clearLines();
    spawnPiece();
}

// Clear completed lines
function clearLines() {
    let linesCleared = 0;
    
    for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
        if (board[y].every(cell => cell !== 0)) {
            board.splice(y, 1);
            board.unshift(Array(BOARD_WIDTH).fill(0));
            linesCleared++;
            y++; // Check the same line again
        }
    }
    
    if (linesCleared > 0) {
        lines += linesCleared;
        score += linesCleared * 100 * level;
        level = Math.floor(lines / 10) + 1;
        dropInterval = Math.max(50, 1000 - (level - 1) * 50);
        updateDisplay();
    }
}

// Move piece
function movePiece(dx, dy) {
    if (!isCollision(currentPiece, currentX + dx, currentY + dy, currentRotation)) {
        currentX += dx;
        currentY += dy;
        return true;
    }
    return false;
}

// Rotate piece with wall kicks for I piece
function rotatePiece() {
    const newRotation = (currentRotation + 1) % PIECES[currentPiece].length;
    
    // Try normal rotation first
    if (!isCollision(currentPiece, currentX, currentY, newRotation)) {
        currentRotation = newRotation;
        return;
    }
    
    // Wall kick attempts for I piece
    if (currentPiece === 'I') {
        const wallKicks = [
            [0, 0], [-1, 0], [1, 0], [-2, 0], [2, 0],
            [0, -1], [-1, -1], [1, -1], [-2, -1], [2, -1]
        ];
        
        for (let [dx, dy] of wallKicks) {
            if (!isCollision(currentPiece, currentX + dx, currentY + dy, newRotation)) {
                currentX += dx;
                currentY += dy;
                currentRotation = newRotation;
                return;
            }
        }
    } else {
        // Simple wall kicks for other pieces
        const wallKicks = [[0, 0], [-1, 0], [1, 0], [0, -1]];
        
        for (let [dx, dy] of wallKicks) {
            if (!isCollision(currentPiece, currentX + dx, currentY + dy, newRotation)) {
                currentX += dx;
                currentY += dy;
                currentRotation = newRotation;
                return;
            }
        }
    }
}

// Hard drop
function hardDrop() {
    while (movePiece(0, 1)) {
        score += 2;
    }
    placePiece();
    updateDisplay();
}

// Draw next piece preview
function drawNextPiece() {
    // Clear next piece canvas
    nextCtx.fillStyle = COLORS.empty;
    nextCtx.fillRect(0, 0, nextCanvas.width, nextCanvas.height);

    if (nextPiece) {
        const shape = PIECES[nextPiece][0]; // Always show first rotation
        nextCtx.fillStyle = COLORS[nextPiece];
        
        // Calculate centering offset
        const pieceWidth = shape[0].length * NEXT_BLOCK_SIZE;
        const pieceHeight = shape.length * NEXT_BLOCK_SIZE;
        const offsetX = (nextCanvas.width - pieceWidth) / 2;
        const offsetY = (nextCanvas.height - pieceHeight) / 2;
        
        for (let py = 0; py < shape.length; py++) {
            for (let px = 0; px < shape[py].length; px++) {
                if (shape[py][px]) {
                    const drawX = offsetX + px * NEXT_BLOCK_SIZE;
                    const drawY = offsetY + py * NEXT_BLOCK_SIZE;
                    nextCtx.fillRect(drawX, drawY, NEXT_BLOCK_SIZE, NEXT_BLOCK_SIZE);
                    nextCtx.strokeStyle = '#333';
                    nextCtx.strokeRect(drawX, drawY, NEXT_BLOCK_SIZE, NEXT_BLOCK_SIZE);
                }
            }
        }
    }
}

// Update display
function updateDisplay() {
    document.getElementById('score').textContent = score;
    document.getElementById('lines').textContent = lines;
    document.getElementById('level').textContent = level;
}

// Draw game
function draw() {
    // Clear canvas
    ctx.fillStyle = COLORS.empty;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw board
    for (let y = 0; y < BOARD_HEIGHT; y++) {
        for (let x = 0; x < BOARD_WIDTH; x++) {
            if (board[y][x]) {
                ctx.fillStyle = COLORS[board[y][x]];
                ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                ctx.strokeStyle = '#333';
                ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        }
    }

    // Draw current piece
    if (currentPiece) {
        const shape = PIECES[currentPiece][currentRotation];
        ctx.fillStyle = COLORS[currentPiece];
        
        for (let py = 0; py < shape.length; py++) {
            for (let px = 0; px < shape[py].length; px++) {
                if (shape[py][px]) {
                    const drawX = (currentX + px) * BLOCK_SIZE;
                    const drawY = (currentY + py) * BLOCK_SIZE;
                    if (drawY >= 0) { // Only draw visible parts
                        ctx.fillRect(drawX, drawY, BLOCK_SIZE, BLOCK_SIZE);
                        ctx.strokeStyle = '#333';
                        ctx.strokeRect(drawX, drawY, BLOCK_SIZE, BLOCK_SIZE);
                    }
                }
            }
        }
    }
}

// Game loop
function gameLoop() {
    if (!gameRunning || isPaused) {
        requestAnimationFrame(gameLoop);
        return;
    }

    const now = Date.now();
    if (now - dropTime > dropInterval) {
        if (!movePiece(0, 1)) {
            placePiece();
        }
        dropTime = now;
    }

    draw();
    requestAnimationFrame(gameLoop);
}

// Game over
function gameOver() {
    gameRunning = false;
    document.getElementById('finalScore').textContent = score;
    document.getElementById('gameOver').style.display = 'block';
}

// Restart game
function restartGame() {
    board = Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill(0));
    score = 0;
    lines = 0;
    level = 1;
    dropInterval = 1000;
    gameRunning = true;
    isPaused = false;
    pieceBag = [];
    fillPieceBag();
    nextPiece = getNextPieceFromBag();
    document.getElementById('gameOver').style.display = 'none';
    updateDisplay();
    spawnPiece();
}

// Keyboard controls - both WASD and Arrow keys
document.addEventListener('keydown', (e) => {
    if (!gameRunning) return;

    switch(e.key.toLowerCase()) {
        // Movement - WASD
        case 'a':
        case 'arrowleft':
            movePiece(-1, 0);
            break;
        case 'd':
        case 'arrowright':
            movePiece(1, 0);
            break;
        case 's':
        case 'arrowdown':
            if (movePiece(0, 1)) {
                score += 1;
                updateDisplay();
            }
            break;
        // Rotation - R and Up Arrow
        case 'w':
        case 'r':
        case 'arrowup':
            rotatePiece();
            break;
        // Hard drop - Space
        case ' ':
            e.preventDefault();
            hardDrop();
            break;
        // Pause - P
        case 'p':
            isPaused = !isPaused;
            break;
    }
});

// Start game when page loads
document.addEventListener('DOMContentLoaded', () => {
    init();
});
