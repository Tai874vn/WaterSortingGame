class GameState {
  constructor() {
    this.tubes = this.initializeTubes();
    this.selectedTube = null;
    this.gameWon = false;
  }

  initializeTubes() {
    const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
    const tubes = [];

    // Create sorted tubes first, then shuffle
    for (let i = 0; i < 6; i++) {
      const tube = [];
      for (let j = 0; j < 5; j++) {
        tube.push(colors[i]);
      }
      tubes.push(tube);
    }

    // Shuffle the colors between tubes to create a puzzle
    this.shuffleTubes(tubes);

    // Add 2 empty tubes
    tubes.push([]);
    tubes.push([]);

    return tubes;
  }

  shuffleTubes(tubes) {
    // Extract all colors
    const allColors = [];
    tubes.forEach(tube => {
      allColors.push(...tube);
      tube.length = 0; // Clear tube
    });

    // Shuffle colors
    for (let i = allColors.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allColors[i], allColors[j]] = [allColors[j], allColors[i]];
    }

    // Redistribute colors back to tubes
    let colorIndex = 0;
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 5; j++) {
        tubes[i].push(allColors[colorIndex++]);
      }
    }
  }

  canPour(fromIndex, toIndex) {
    const fromTube = this.tubes[fromIndex];
    const toTube = this.tubes[toIndex];

    if (fromTube.length === 0) return false;
    if (toTube.length >= 5) return false;
    if (toTube.length > 0 && fromTube[fromTube.length - 1] !== toTube[toTube.length - 1]) return false;

    // Check if there's enough space for the consecutive colors to be poured
    const consecutiveCount = this.getConsecutiveTopColors(fromIndex);
    if (toTube.length + consecutiveCount > 5) return false;

    return true;
  }

  getConsecutiveTopColors(tubeIndex) {
    const tube = this.tubes[tubeIndex];
    if (tube.length === 0) return 0;

    const topColor = tube[tube.length - 1];
    let count = 1;

    for (let i = tube.length - 2; i >= 0; i--) {
      if (tube[i] === topColor) {
        count++;
      } else {
        break;
      }
    }

    return count;
  }

  pour(fromIndex, toIndex) {
    if (!this.canPour(fromIndex, toIndex)) return false;

    const fromTube = this.tubes[fromIndex];
    const toTube = this.tubes[toIndex];
    const consecutiveCount = this.getConsecutiveTopColors(fromIndex);

    // Pour all consecutive same-colored layers
    for (let i = 0; i < consecutiveCount; i++) {
      const color = fromTube.pop();
      toTube.push(color);
    }

    this.checkWinCondition();
    return true;
  }

  checkWinCondition() {
    let emptyTubes = 0;
    let sortedTubes = 0;

    for (const tube of this.tubes) {
      if (tube.length === 0) {
        emptyTubes++;
      } else if (tube.length === 5 && tube.every(color => color === tube[0])) {
        sortedTubes++;
      }
    }

    this.gameWon = (sortedTubes === 6 && emptyTubes === 2);
  }

  reset() {
    this.tubes = this.initializeTubes();
    this.selectedTube = null;
    this.gameWon = false;
  }
}

export default GameState;