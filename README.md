# Amazon Tetris

A classic Tetris game built with AmazonQ, built using HTML5, CSS3, and JavaScript.

[![Watch the demo on YouTube](https://img.shields.io/badge/YouTube-Video-red?logo=youtube&style=for-the-badge)](https://www.youtube.com/watch?v=XKAQwAxlGVc)

## Features

- **Classic Tetris Gameplay**: All 7 standard Tetris pieces (I, O, T, S, Z, J, L)
- **Amazon Branding**: Uses Amazon's signature orange (#FF9900) and dark blue (#232F3E) colors
- **Dual Control Schemes**: Support for both WASD and Arrow keys
- **Next Piece Preview**: Shows the upcoming piece to help with strategy
- **Progressive Difficulty**: Game speed increases every 10 lines cleared
- **Score System**: Points awarded for line clears and soft/hard drops
- **Proper I-Piece Rotation**: Enhanced rotation system with wall kicks for the I piece
- **Fair Piece Distribution**: Uses a bag system to ensure balanced piece distribution
- **Responsive Design**: Works on desktop and mobile devices

## How to Run

### Option 1: Direct File Opening

1. Download all files (`index.html`, `styles.css`, `script.js`, `README.md`)
2. Open `index.html` in any modern web browser
3. Start playing immediately!

### Option 2: Local Web Server (Recommended)

For the best experience, serve the files through a local web server:

```bash
# Using Python 3
python -m http.server 8000

# Using Python 2
python -m SimpleHTTPServer 8000

# Using Node.js (if you have http-server installed)
npx http-server

# Using PHP
php -S localhost:8000
```

Then open your browser and navigate to `http://localhost:8000`

## Controls

### Movement

- **A** or **←** (Left Arrow): Move piece left
- **D** or **→** (Right Arrow): Move piece right
- **S** or **↓** (Down Arrow): Soft drop (faster fall + 1 point)

### Rotation

- **W** or **↑** (Up Arrow): Rotate piece clockwise
- **R**: Rotate piece clockwise

### Special Actions

- **Space**: Hard drop (instant drop + 2 points per row)
- **P**: Pause/unpause game

## Game Rules

1. **Objective**: Clear horizontal lines by filling them completely with blocks
2. **Scoring**:
   - Line clear: 100 × level × lines cleared
   - Soft drop: 1 point per row
   - Hard drop: 2 points per row
3. **Leveling**: Level increases every 10 lines cleared
4. **Speed**: Game speed increases with each level
5. **Game Over**: When pieces reach the top of the playing field

## File Structure

```
amazon-tetris/
├── index.html      # Main HTML file
├── styles.css      # CSS styling and layout
├── script.js       # Game logic and controls
└── README.md       # This file
```

## Technical Details

- **Canvas Size**: 300×600 pixels (10×20 blocks)
- **Block Size**: 30×30 pixels
- **Framework**: Vanilla JavaScript (no dependencies)
- **Browser Support**: All modern browsers (Chrome, Firefox, Safari, Edge)

## Game Mechanics

### Piece Rotation System

- Standard pieces use basic rotation with simple wall kicks
- I-piece uses enhanced rotation system with extended wall kick table
- Rotation attempts multiple positions to prevent getting stuck

### Line Clearing

- Multiple lines can be cleared simultaneously
- Scoring bonus for clearing multiple lines at once
- Board compacts automatically after line clears

### Drop System

- **Natural Drop**: Pieces fall automatically based on level speed
- **Soft Drop**: Player-controlled faster drop with scoring bonus
- **Hard Drop**: Instant drop to bottom with higher scoring bonus

## Customization

You can easily customize the game by modifying:

- **Colors**: Edit the `COLORS` object in `script.js`
- **Piece Shapes**: Modify the `PIECES` object in `script.js`
- **Scoring**: Adjust scoring values in the `clearLines()` and drop functions
- **Speed**: Change the `dropInterval` calculation for different difficulty curves
- **Styling**: Update `styles.css` for different visual themes

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

This project is open source and available under the MIT License.

## Contributing

Feel free to fork this project and submit pull requests for improvements or bug fixes.

---

Enjoy playing Amazon Tetris! 🧱🎮
