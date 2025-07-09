// Game constants
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const BLOCK_SIZE = 30;

// Amazon-themed colors for Tetris pieces
const COLORS = {
    I: '#FF9900', // Amazon Orange
    O: '#FFD700', // Gold
    T: '#87CEEB', // Sky Blue
    S: '#90EE90', // Light Green
    Z: '#FF6B6B', // Light Red
    J: '#9370DB', // Medium Purple
    L: '#FFA500'  // Orange
};

// Tetris piece shapes
const PIECES = {
    I: [
        [[1, 1, 1, 1]]
        [[1],
         [1],
         [1],
         [1]]
    ],
    O: [
        [[1, 1],
         [1, 1]]
    ],
    T: [
        [[0, 1, 0],
         [1, 1, 1]],
        [[1, 0],
         [1, 1],
         [1, 0]],
        [[1, 1, 1],
         [0, 1, 0]],
        [[0, 1],
         [1, 1],
         [0, 1]]
    ],
    S: [
        [[0, 1, 1],
         [1, 1, 0]],
        [[1, 0],
         [1, 1],
         [0, 1]]
    ],
    Z: [
        [[1, 1, 0],
         [0, 1, 1]],
        [[0, 1],
         [1, 1],
         [1, 0]]
    ],
    J: [
        [[1, 0, 0],
         [1, 1, 1]],
        [[1, 1],
         [1, 0],
         [1, 0]],
        [[1, 1, 1],
         [0, 0, 1]],
        [[0, 1],
         [0, 1],
         [1, 1]]
    ],
    L: [
        [[0, 0, 1],
         [1, 1, 1]],
        [[1, 0],
         [1, 0],
         [1, 1]],
        [[1, 1, 1],
         [1, 0, 0]],
        [[1, 1],
         [0, 1],
         [0, 1]]
    ]
};

class TetrisGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.nextCanvas = document.getElementById('nextPieceCanvas');
        this.nextCtx = this.nextCanvas.getContext('2d');
        
        this.board = Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill(0));
        this.score = 0;
        this.gameOver = false;
        this.dropTime = 0;
        this.dropInterval = 1000; // 1 second
        
        this.currentPiece = null;
        this.nextPiece = null;
        
        this.init();
    }
    
    init() {
        this.generateNextPiece();
        this.spawnPiece();
        this.bindEvents();
        this.gameLoop();
    }
    
    bindEvents() {
        document.addEventListener('keydown', (e) => {
            if (this.gameOver) return;
            
            switch(e.code) {
                // Arrow key controls
                case 'ArrowLeft':
                    this.movePiece(-1, 0);
                    break;
                case 'ArrowRight':
                    this.movePiece(1, 0);
                    break;
                case 'ArrowDown':
                    this.movePiece(0, 1);
                    break;
                case 'ArrowUp':
                    this.rotatePiece();
                    break;
                // WASD controls
                case 'KeyA':
                    this.movePiece(-1, 0);
                    break;
                case 'KeyD':
                    this.movePiece(1, 0);
                    break;
                case 'KeyS':
                    this.movePiece(0, 1);
                    break;
                case 'KeyR':
                    this.rotatePiece();
                    break;
                // Hard drop
                case 'Space':
                    this.hardDrop();
                    break;
            }
        });
        
        document.getElementById('restartBtn').addEventListener('click', () => {
            this.restart();
        });
    }
    
    generateNextPiece() {
        const pieceTypes = Object.keys(PIECES);
        const randomType = pieceTypes[Math.floor(Math.random() * pieceTypes.length)];
        
        this.nextPiece = {
            type: randomType,
            shape: PIECES[randomType][0],
            rotation: 0,
            x: 0,
            y: 0,
            color: COLORS[randomType]
        };
    }
    
    spawnPiece() {
        if (this.nextPiece) {
            this.currentPiece = {
                ...this.nextPiece,
                x: Math.floor(BOARD_WIDTH / 2) - Math.floor(this.nextPiece.shape[0].length / 2),
                y: 0
            };
        }
        
        this.generateNextPiece();
        
        // Check for game over
        if (this.checkCollision(this.currentPiece.x, this.currentPiece.y, this.currentPiece.shape)) {
            this.endGame();
        }
    }
    
    movePiece(dx, dy) {
        const newX = this.currentPiece.x + dx;
        const newY = this.currentPiece.y + dy;
        
        if (!this.checkCollision(newX, newY, this.currentPiece.shape)) {
            this.currentPiece.x = newX;
            this.currentPiece.y = newY;
            return true;
        }
        return false;
    }
    
    rotatePiece() {
        const rotations = PIECES[this.currentPiece.type];
        const nextRotation = (this.currentPiece.rotation + 1) % rotations.length;
        const rotatedShape = rotations[nextRotation];
        
        if (!this.checkCollision(this.currentPiece.x, this.currentPiece.y, rotatedShape)) {
            this.currentPiece.rotation = nextRotation;
            this.currentPiece.shape = rotatedShape;
        }
    }
    
    hardDrop() {
        while (this.movePiece(0, 1)) {
            // Keep dropping until collision
        }
        this.placePiece();
    }
    
    checkCollision(x, y, shape) {
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col]) {
                    const newX = x + col;
                    const newY = y + row;
                    
                    if (newX < 0 || newX >= BOARD_WIDTH || 
                        newY >= BOARD_HEIGHT || 
                        (newY >= 0 && this.board[newY][newX])) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    
    placePiece() {
        const shape = this.currentPiece.shape;
        const x = this.currentPiece.x;
        const y = this.currentPiece.y;
        
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col] && y + row >= 0) {
                    this.board[y + row][x + col] = this.currentPiece.color;
                }
            }
        }
        
        this.clearLines();
        this.spawnPiece();
    }
    
    clearLines() {
        let linesCleared = 0;
        
        for (let row = BOARD_HEIGHT - 1; row >= 0; row--) {
            if (this.board[row].every(cell => cell !== 0)) {
                this.board.splice(row, 1);
                this.board.unshift(Array(BOARD_WIDTH).fill(0));
                linesCleared++;
                row++; // Check the same row again
            }
        }
        
        if (linesCleared > 0) {
            this.score += linesCleared * 100 * linesCleared; // Bonus for multiple lines
            this.updateScore();
            
            // Increase speed slightly
            this.dropInterval = Math.max(100, this.dropInterval - linesCleared * 10);
        }
    }
    
    updateScore() {
        document.getElementById('score').textContent = this.score;
    }
    
    endGame() {
        this.gameOver = true;
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('gameOver').style.display = 'block';
    }
    
    restart() {
        this.board = Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill(0));
        this.score = 0;
        this.gameOver = false;
        this.dropTime = 0;
        this.dropInterval = 1000;
        
        document.getElementById('gameOver').style.display = 'none';
        this.updateScore();
        
        this.generateNextPiece();
        this.spawnPiece();
    }
    
    update(deltaTime) {
        if (this.gameOver) return;
        
        this.dropTime += deltaTime;
        
        if (this.dropTime >= this.dropInterval) {
            if (!this.movePiece(0, 1)) {
                this.placePiece();
            }
            this.dropTime = 0;
        }
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw board
        this.drawBoard();
        
        // Draw current piece
        if (this.currentPiece) {
            this.drawPiece(this.currentPiece, this.ctx);
        }
        
        // Draw next piece
        this.drawNextPiece();
    }
    
    drawBoard() {
        for (let row = 0; row < BOARD_HEIGHT; row++) {
            for (let col = 0; col < BOARD_WIDTH; col++) {
                if (this.board[row][col]) {
                    this.ctx.fillStyle = this.board[row][col];
                    this.ctx.fillRect(col * BLOCK_SIZE, row * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                    
                    // Add border
                    this.ctx.strokeStyle = '#FFFFFF';
                    this.ctx.lineWidth = 1;
                    this.ctx.strokeRect(col * BLOCK_SIZE, row * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                }
            }
        }
    }
    
    drawPiece(piece, context) {
        const shape = piece.shape;
        
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col]) {
                    const x = (piece.x + col) * BLOCK_SIZE;
                    const y = (piece.y + row) * BLOCK_SIZE;
                    
                    context.fillStyle = piece.color;
                    context.fillRect(x, y, BLOCK_SIZE, BLOCK_SIZE);
                    
                    // Add border
                    context.strokeStyle = '#FFFFFF';
                    context.lineWidth = 1;
                    context.strokeRect(x, y, BLOCK_SIZE, BLOCK_SIZE);
                }
            }
        }
    }
    
    drawNextPiece() {
        // Clear next piece canvas
        this.nextCtx.fillStyle = '#000000';
        this.nextCtx.fillRect(0, 0, this.nextCanvas.width, this.nextCanvas.height);
        
        if (this.nextPiece) {
            const shape = this.nextPiece.shape;
            const blockSize = 20;
            
            // Center the piece in the canvas
            const offsetX = (this.nextCanvas.width - shape[0].length * blockSize) / 2;
            const offsetY = (this.nextCanvas.height - shape.length * blockSize) / 2;
            
            for (let row = 0; row < shape.length; row++) {
                for (let col = 0; col < shape[row].length; col++) {
                    if (shape[row][col]) {
                        const x = offsetX + col * blockSize;
                        const y = offsetY + row * blockSize;
                        
                        this.nextCtx.fillStyle = this.nextPiece.color;
                        this.nextCtx.fillRect(x, y, blockSize, blockSize);
                        
                        // Add border
                        this.nextCtx.strokeStyle = '#FFFFFF';
                        this.nextCtx.lineWidth = 1;
                        this.nextCtx.strokeRect(x, y, blockSize, blockSize);
                    }
                }
            }
        }
    }
    
    gameLoop() {
        let lastTime = 0;
        
        const loop = (currentTime) => {
            const deltaTime = currentTime - lastTime;
            lastTime = currentTime;
            
            this.update(deltaTime);
            this.draw();
            
            requestAnimationFrame(loop);
        };
        
        requestAnimationFrame(loop);
    }
}

// Start the game when the page loads
window.addEventListener('load', () => {
    new TetrisGame();
});
