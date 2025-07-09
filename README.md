# Amazon Tetris Game

A modern, responsive Tetris game built with HTML5, CSS3, and JavaScript, featuring Amazon-inspired styling and colors.

## Features

- **Classic Tetris Gameplay**: All standard Tetris pieces (I, O, T, S, Z, J, L)
- **Amazon-Themed Design**: Beautiful color scheme inspired by Amazon's brand colors
- **Responsive Design**: Works on desktop and mobile devices
- **Score Tracking**: Keep track of your high score
- **Next Piece Preview**: See what piece is coming next
- **Smooth Animations**: Fluid piece movement and line clearing effects
- **Game Over Screen**: Restart functionality when the game ends

## Game Pieces

The game includes all seven standard Tetris pieces:

- **I-Piece** (Orange): Straight line piece - great for clearing multiple lines
- **O-Piece** (Gold): Square piece - stable and easy to place
- **T-Piece** (Sky Blue): T-shaped piece - versatile for filling gaps
- **S-Piece** (Light Green): S-shaped piece - good for creating steps
- **Z-Piece** (Light Red): Z-shaped piece - mirror of S-piece
- **J-Piece** (Purple): J-shaped piece - useful for corners
- **L-Piece** (Orange): L-shaped piece - mirror of J-piece

## Controls

The game supports two different control schemes for maximum flexibility:

### Arrow Keys (Traditional)
- **← / →** (Left/Right Arrow): Move piece horizontally
- **↓** (Down Arrow): Soft drop (move piece down faster)
- **↑** (Up Arrow): Rotate piece clockwise

### WASD + R (Alternative)
- **A / D**: Move piece left/right
- **S**: Soft drop (move piece down faster)
- **R**: Rotate piece clockwise

### Universal Controls
- **Space**: Hard drop (instantly drop piece to bottom)

Both control schemes work simultaneously, so you can use whichever feels more comfortable or switch between them during gameplay. The soft drop controls (↓ and S) make pieces fall faster than the normal drop speed, allowing for more precise placement.

## Scoring System

- **Single Line**: 100 points
- **Double Line**: 400 points (100 × 2 × 2)
- **Triple Line**: 900 points (100 × 3 × 3)
- **Tetris (4 lines)**: 1600 points (100 × 4 × 4)

The game speed increases slightly each time you clear lines, making it progressively more challenging.

## File Structure

```
tetris-game/
├── index.html          # Main HTML file
├── styles.css          # CSS styling with Amazon theme
├── script.js           # JavaScript game logic
└── README.md          # This file
```

## How to Play

1. Open `index.html` in your web browser
2. Use either the arrow keys or WASD+R controls to move and rotate pieces:
   - **Move**: Arrow keys (←/→) or A/D keys
   - **Soft Drop**: Down arrow (↓) or S key
   - **Rotate**: Up arrow (↑) or R key
   - **Hard Drop**: Spacebar
3. Try to create complete horizontal lines to clear them and score points
4. The game ends when pieces reach the top of the board
5. Click "Play Again" to restart

## Technical Details

### Game Board
- **Dimensions**: 10 blocks wide × 20 blocks tall
- **Block Size**: 30px × 30px
- **Canvas Size**: 300px × 600px

### Game Logic
- **Collision Detection**: Prevents pieces from overlapping or going out of bounds
- **Line Clearing**: Automatically detects and clears complete lines
- **Piece Rotation**: Each piece has multiple rotation states
- **Drop Timer**: Pieces automatically fall at regular intervals

### Controls Implementation
- **Dual Control Schemes**: Supports both arrow keys and WASD+R simultaneously
- **Key Mapping**: 
  - Movement: ArrowLeft/ArrowRight and KeyA/KeyD
  - Soft Drop: ArrowDown and KeyS
  - Rotation: ArrowUp and KeyR
  - Hard Drop: Space (universal)
- **Event Handling**: Uses `keydown` events with `e.code` for reliable key detection
- **Game State Check**: Controls are disabled during game over state

### Responsive Design
- Adapts to different screen sizes
- Mobile-friendly touch controls
- Flexible layout that works on tablets and phones

## Browser Compatibility

This game works in all modern browsers that support:
- HTML5 Canvas
- ES6 JavaScript features
- CSS3 animations and transforms

Tested on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Customization

You can easily customize the game by modifying:

- **Colors**: Change the `COLORS` object in `script.js`
- **Speed**: Adjust `dropInterval` in the TetrisGame constructor
- **Board Size**: Modify `BOARD_WIDTH` and `BOARD_HEIGHT` constants
- **Styling**: Update CSS variables in `styles.css`

## Future Enhancements

Potential features that could be added:
- Sound effects and background music
- Local storage for high scores
- Different difficulty levels
- Multiplayer support
- Touch controls for mobile devices
- Particle effects for line clearing

## License

This project is open source and available under the MIT License.

## Contributing

Feel free to fork this project and submit pull requests for any improvements or bug fixes.

---

Enjoy playing Amazon Tetris! 🎮
