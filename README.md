# Snake Xenzia Game

A fun and interactive **Snake** game built using **React** and **Vite**. Designed with responsive behavior in mind, it offers smooth gameplay on both desktop and mobile devices. The game includes modern controls, dynamic difficulty scaling, and polished UI for an enjoyable experience.

---

##  Live Demo

Try it out here: [Snake Game Live](https://snake-game-lemon-nu.vercel.app/)

---

##  Features

- **Responsive Design** – Seamless experience across desktop and mobile devices.
- **Keyboard & Touch Controls** – Play using arrow keys or swipe gestures.
- **Dynamic Speed Adjustment** – The game gets faster as the snake grows.
- **Pause/Resume Functionality** – Pause anytime and resume where you left off.
- **Game Over Summary** – Displays final score and snake length after each game.

---

## 🎮 How to Play

1. **Start the Game**: Click the "Start Game" button.
2. **Controls**:
   - **Desktop**: Use arrow keys (↑ ↓ ← →) to move the snake.
   - **Mobile**: Swipe in the desired direction.
3. **Pause/Resume**:
   - Use the **Spacebar**, **Escape** key, or the **center button** to pause/resume.
4. **Objective**: Eat the food to grow your snake and increase your score. Avoid running into walls or your own tail!

---


## 📁 Project Structure

```
snake-xenzia/
├── .gitignore            # Git ignore rules
├── README.md             # Project documentation
├── package.json          # Dependencies and scripts
├── vite.config.js        # Vite build configuration
├── eslint.config.js      # ESLint setup
├── index.html            # Base HTML template
├── src/                  # Source code
├── components/
│   ├── GameBoard.jsx         # Grid rendering and cell visuals
│   ├── Controls.jsx          # Button controls and touch input handlers
│   └── useSnakeGame.js       # Custom hook to manage game logic/state
├── SnakeGame.jsx             # High-level component combining everything
├── SnakeGame.css
└── dist/                 # Production build output (auto-generated)
```

---

##  Tech Stack

- **React** – UI component framework
- **Vite** – Fast development server and bundler
- **CSS** – Styling and responsive layout

---

##  Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/snake-xenzia.git
cd snake-xenzia

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Build for Production

```bash
npm run build
```

---

##  Contributing

Contributions are welcome! If you have suggestions, bug fixes, or improvements:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Open a Pull Request.

For any queries or collaboration ideas, feel free to reach out at **ritesh.exe@proton.me**.

