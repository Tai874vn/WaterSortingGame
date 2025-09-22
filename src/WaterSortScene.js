import Phaser from 'phaser';
import GameState from './GameState';

class WaterSortScene extends Phaser.Scene {
  constructor() {
    super({ key: 'WaterSortScene' });
    this.gameState = new GameState();
    this.tubeGraphics = [];
    this.waterGraphics = [];
    this.hoveredTube = null;
  }

  preload() {
    // Create colored rectangles for water layers
    this.load.image('tube', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
  }

  create() {
    this.cameras.main.setBackgroundColor('#f0f0f0');
    this.createTubes();
    this.createUI();
  }

  createTubes() {
    const tubeWidth = 60;
    const tubeHeight = 200;
    const spacing = 90;
    // Center the tubes horizontally (4 tubes per row, 90px spacing)
    const totalWidth = 4 * spacing - spacing; // 3 gaps between 4 tubes
    const startX = (800 - totalWidth) / 2; // Center in 800px wide canvas
    const startY = 150; // Move down to make room for UI

    for (let i = 0; i < 8; i++) {
      const x = startX + (i % 4) * spacing;
      const y = startY + Math.floor(i / 4) * 300;

      // Draw tube outline
      const tubeOutline = this.add.graphics();
      tubeOutline.lineStyle(3, 0x333333);
      tubeOutline.strokeRoundedRect(x - tubeWidth/2, y - tubeHeight/2, tubeWidth, tubeHeight, 5);
      this.tubeGraphics[i] = tubeOutline;

      // Create interactive area
      const interactiveArea = this.add.rectangle(x, y, tubeWidth, tubeHeight, 0x000000, 0);
      interactiveArea.setInteractive();
      interactiveArea.on('pointerdown', () => this.onTubeClick(i));
      interactiveArea.on('pointerover', () => this.onTubeHover(i, true));
      interactiveArea.on('pointerout', () => this.onTubeHover(i, false));

      this.waterGraphics[i] = [];
    }

    this.updateWaterDisplay();
  }

  updateWaterDisplay() {
    const tubeWidth = 60;
    const tubeHeight = 200;
    const layerHeight = tubeHeight / 5;
    const spacing = 90;
    // Center the tubes horizontally (same as createTubes)
    const totalWidth = 4 * spacing - spacing;
    const startX = (800 - totalWidth) / 2;
    const startY = 150;

    const colorMap = {
      'red': 0xff0000,
      'blue': 0x0000ff,
      'green': 0x00ff00,
      'yellow': 0xffff00,
      'purple': 0x800080,
      'orange': 0xffa500
    };

    // Clear existing water graphics
    this.waterGraphics.forEach(tubeWater => {
      tubeWater.forEach(layer => layer.destroy());
    });
    this.waterGraphics = this.gameState.tubes.map(() => []);

    for (let i = 0; i < 8; i++) {
      const x = startX + (i % 4) * spacing;
      const y = startY + Math.floor(i / 4) * 300;
      const tube = this.gameState.tubes[i];

      for (let j = 0; j < tube.length; j++) {
        const color = tube[j];
        const layerY = y + tubeHeight/2 - layerHeight * (j + 1) + layerHeight/2;

        const waterLayer = this.add.rectangle(
          x,
          layerY,
          tubeWidth - 6,
          layerHeight - 2,
          colorMap[color]
        );

        this.waterGraphics[i].push(waterLayer);
      }
    }
  }

  onTubeClick(tubeIndex) {
    const previousSelected = this.gameState.selectedTube;

    if (this.gameState.selectedTube === null) {
      // Select tube if it has water
      if (this.gameState.tubes[tubeIndex].length > 0) {
        this.gameState.selectedTube = tubeIndex;
      }
    } else {
      // Try to pour water
      if (this.gameState.selectedTube === tubeIndex) {
        // Deselect
        this.gameState.selectedTube = null;
      } else {
        // Pour water
        const selectedTube = this.gameState.selectedTube;
        if (this.gameState.pour(selectedTube, tubeIndex)) {
          this.updateWaterDisplay();
          if (this.gameState.gameWon) {
            this.showWinMessage();
          }
        }
        this.gameState.selectedTube = null;
      }
    }

    // Update all affected tube appearances
    if (previousSelected !== null) {
      this.updateTubeAppearance(previousSelected);
    }
    this.updateTubeAppearance(tubeIndex);
  }

  onTubeHover(tubeIndex, isHovering) {
    if (isHovering) {
      this.hoveredTube = tubeIndex;
    } else {
      // Only clear hover if we're leaving the tube that was hovered
      if (this.hoveredTube === tubeIndex) {
        this.hoveredTube = null;
      }
    }
    this.updateTubeAppearance(tubeIndex);
  }

  updateTubeAppearance(tubeIndex) {
    const isSelected = this.gameState.selectedTube === tubeIndex;
    const isHovered = this.hoveredTube === tubeIndex;

    let color = 0x333333; // Default gray
    let lineWidth = 3;

    if (isSelected) {
      color = 0x00ff00; // Bright green for selected
      lineWidth = 6; // Extra bold for selected
    } else if (isHovered) {
      color = 0x66cc66; // Medium green for hover
      lineWidth = 4; // Slightly thicker for hover
    }

    const tubeWidth = 60;
    const tubeHeight = 200;
    const spacing = 90;
    // Center the tubes horizontally (same as createTubes)
    const totalWidth = 4 * spacing - spacing;
    const startX = (800 - totalWidth) / 2;
    const startY = 150;
    const x = startX + (tubeIndex % 4) * spacing;
    const y = startY + Math.floor(tubeIndex / 4) * 300;

    this.tubeGraphics[tubeIndex].clear();
    this.tubeGraphics[tubeIndex].lineStyle(lineWidth, color);
    this.tubeGraphics[tubeIndex].strokeRoundedRect(x - tubeWidth/2, y - tubeHeight/2, tubeWidth, tubeHeight, 5);
  }

  highlightTube(tubeIndex, highlight) {
    // This method is kept for compatibility but now uses updateTubeAppearance
    this.updateTubeAppearance(tubeIndex);
  }

  createUI() {
    // Position reset button in top-right corner
    const resetButton = this.add.rectangle(720, 50, 100, 40, 0x4CAF50);
    this.add.text(720, 50, 'Reset', {
      fontSize: '16px',
      fill: '#ffffff'
    }).setOrigin(0.5);

    resetButton.setInteractive();
    resetButton.on('pointerdown', () => {
      // Clear any existing selection and hover states
      this.gameState.reset();
      this.hoveredTube = null;

      // Update all tube appearances
      for (let i = 0; i < 8; i++) {
        this.updateTubeAppearance(i);
      }

      this.updateWaterDisplay();
      if (this.winText) {
        this.winText.destroy();
        this.winText = null;
      }
    });
  }

  showWinMessage() {
    this.winText = this.add.text(400, 300, 'You Win!', {
      fontSize: '48px',
      fill: '#00ff00',
      stroke: '#000000',
      strokeThickness: 3,
      fontStyle: 'bold'
    }).setOrigin(0.5);
  }
}

export default WaterSortScene;