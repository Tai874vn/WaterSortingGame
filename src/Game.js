import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import WaterSortScene from './WaterSortScene';

const Game = () => {
  const gameRef = useRef(null);
  const phaserGameRef = useRef(null);

  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: gameRef.current,
      backgroundColor: '#f0f0f0',
      scene: [WaterSortScene],
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
          debug: false
        }
      }
    };

    phaserGameRef.current = new Phaser.Game(config);

    return () => {
      if (phaserGameRef.current) {
        phaserGameRef.current.destroy(true);
        phaserGameRef.current = null;
      }
    };
  }, []);

  return (
    <div className="game-container">
      <h1>Water Sort Puzzle</h1>
      <div className="game-instructions">
        <p>Click on a tube to select it, then click on another tube to pour water.</p>
        <p>Sort all colors into their own tubes to win!</p>
        <p>PhuongLinhCatto</p>
      </div>
      <div ref={gameRef} className="phaser-game"></div>
    </div>
  );
};

export default Game;