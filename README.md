# Water Sort Puzzle Game 🧪

A fun and addictive water sorting puzzle game built with React and Phaser! Sort all the colored water into separate tubes by pouring water between tubes.

## 🎮 Game Features

- **6 filled tubes** with mixed colored water + **2 empty tubes** for maneuvering
- **Smart pouring logic** that pours consecutive same-colored layers
- **Interactive hover effects** with green glow feedback
- **Visual selection** with bold green borders
- **Win detection** with celebration message
- **Reset functionality** to start new puzzles
- **Responsive design** with centered layout

## 🚀 How to Play

1. Click on a tube with water to select it (green border appears)
2. Click on another tube to pour water
3. Water can only be poured if:
   - The destination tube isn't full (max 5 layers)
   - The top colors match (or destination is empty)
4. Sort all colors into separate tubes to win!

## 🛠️ Technology Stack

- **React** - UI framework
- **Phaser 3** - Game engine for graphics and interactions
- **JavaScript** - Game logic and state management

## 📦 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Tai874vn/WaterSortingGame.git

# Navigate to project directory
cd WaterSortingGame

# Install dependencies
npm install

# Start the development server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the game in your browser.

## 🏗️ Available Scripts

### `npm start`
Runs the app in development mode with hot reloading.

### `npm test`
Launches the test runner in interactive watch mode.

### `npm run build`
Builds the app for production to the `build` folder.

### `npm run eject`
**Note: This is a one-way operation!** Ejects from Create React App setup.

## 🎯 Game Logic

The game uses a sophisticated algorithm to:
- Generate solvable puzzles by shuffling pre-sorted tubes
- Handle multi-layer water pouring with realistic physics
- Detect win conditions (all colors sorted + empty tubes)
- Provide visual feedback for all interactions

## 🤖 Development

This game was developed with assistance from Claude AI, showcasing modern web development practices and game design principles.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Made with ❤️ using React, Phaser, and Claude AI