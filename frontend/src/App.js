import React, { useState, useEffect } from 'react';
import { RotateCcw, Trophy, Timer } from 'lucide-react';

const SlidingPuzzleGame = () => {
  const [grid, setGrid] = useState([]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isWon, setIsWon] = useState(false);
  const [bestMoves, setBestMoves] = useState(null);
  const [bestTime, setBestTime] = useState(null);

  useEffect(() => {
    initGame();
    const savedBestMoves = localStorage.getItem('bestMoves');
    const savedBestTime = localStorage.getItem('bestTime');
    if (savedBestMoves) setBestMoves(parseInt(savedBestMoves));
    if (savedBestTime) setBestTime(parseInt(savedBestTime));
  }, []);

  useEffect(() => {
    let interval;
    if (isPlaying && !isWon) {
      interval = setInterval(() => {
        setTime(t => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isWon]);

  const initGame = () => {
    let numbers = Array.from({ length: 15 }, (_, i) => i + 1);
    numbers.push(0); // 0 represents empty space
    
    // Shuffle until solvable
    do {
      numbers = shuffleArray(numbers);
    } while (!isSolvable(numbers));
    
    const newGrid = [];
    for (let i = 0; i < 4; i++) {
      newGrid.push(numbers.slice(i * 4, i * 4 + 4));
    }
    
    setGrid(newGrid);
    setMoves(0);
    setTime(0);
    setIsPlaying(false);
    setIsWon(false);
  };

  const shuffleArray = (array) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const isSolvable = (puzzle) => {
    let inversions = 0;
    let emptyRow = 0;
    
    for (let i = 0; i < 16; i++) {
      if (puzzle[i] === 0) {
        emptyRow = Math.floor(i / 4);
        continue;
      }
      for (let j = i + 1; j < 16; j++) {
        if (puzzle[j] !== 0 && puzzle[i] > puzzle[j]) {
          inversions++;
        }
      }
    }
    
    // For 4x4 grid: puzzle is solvable if inversions + empty row from bottom is odd
    return (inversions + (3 - emptyRow)) % 2 === 1;
  };

  const findEmpty = () => {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (grid[i][j] === 0) return [i, j];
      }
    }
    return null;
  };

  const canMove = (row, col) => {
    const [emptyRow, emptyCol] = findEmpty();
    return (
      (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
      (Math.abs(col - emptyCol) === 1 && row === emptyRow)
    );
  };

  const moveTile = (row, col) => {
    if (!canMove(row, col)) return;
    
    if (!isPlaying) setIsPlaying(true);
    
    const newGrid = grid.map(r => [...r]);
    const [emptyRow, emptyCol] = findEmpty();
    
    newGrid[emptyRow][emptyCol] = newGrid[row][col];
    newGrid[row][col] = 0;
    
    setGrid(newGrid);
    setMoves(m => m + 1);
    
    if (checkWin(newGrid)) {
      setIsWon(true);
      setIsPlaying(false);
      
      if (bestMoves === null || moves + 1 < bestMoves) {
        setBestMoves(moves + 1);
        localStorage.setItem('bestMoves', (moves + 1).toString());
      }
      
      if (bestTime === null || time < bestTime) {
        setBestTime(time);
        localStorage.setItem('bestTime', time.toString());
      }
    }
  };

  const checkWin = (currentGrid) => {
    let expected = 1;
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (i === 3 && j === 3) {
          return currentGrid[i][j] === 0;
        }
        if (currentGrid[i][j] !== expected) return false;
        expected++;
      }
    }
    return true;
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTileColor = (value) => {
    if (value === 0) return 'bg-gray-300';
    const colors = [
      'bg-blue-400', 'bg-blue-500', 'bg-purple-400', 'bg-purple-500',
      'bg-pink-400', 'bg-pink-500', 'bg-red-400', 'bg-red-500',
      'bg-orange-400', 'bg-orange-500', 'bg-yellow-400', 'bg-yellow-500',
      'bg-green-400', 'bg-green-500', 'bg-teal-400'
    ];
    return colors[(value - 1) % colors.length];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full">
        <div className="text-center mb-6">
          <h1 className="text-5xl font-bold text-gray-800 mb-2">Sliding Puzzle</h1>
          <p className="text-gray-600">Arrange numbers 1-15 in order</p>
        </div>

        <div className="flex justify-between items-center mb-6 gap-3">
          <div className="bg-blue-100 rounded-lg px-4 py-3 flex-1">
            <div className="text-xs text-gray-600 font-semibold">MOVES</div>
            <div className="text-xl font-bold text-gray-800">{moves}</div>
          </div>

          <div className="bg-purple-100 rounded-lg px-4 py-3 flex-1">
            <div className="text-xs text-gray-600 font-semibold flex items-center gap-1">
              <Timer size={12} /> TIME
            </div>
            <div className="text-xl font-bold text-gray-800">{formatTime(time)}</div>
          </div>
          
          <button
            onClick={initGame}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-5 py-3 flex items-center gap-2 transition"
          >
            <RotateCcw size={18} />
            New
          </button>
        </div>

        {(bestMoves !== null || bestTime !== null) && (
          <div className="flex gap-3 mb-4">
            {bestMoves !== null && (
              <div className="bg-green-100 rounded-lg px-4 py-2 flex-1">
                <div className="text-xs text-gray-600 font-semibold flex items-center gap-1">
                  <Trophy size={12} /> BEST MOVES
                </div>
                <div className="text-lg font-bold text-gray-800">{bestMoves}</div>
              </div>
            )}
            {bestTime !== null && (
              <div className="bg-green-100 rounded-lg px-4 py-2 flex-1">
                <div className="text-xs text-gray-600 font-semibold flex items-center gap-1">
                  <Trophy size={12} /> BEST TIME
                </div>
                <div className="text-lg font-bold text-gray-800">{formatTime(bestTime)}</div>
              </div>
            )}
          </div>
        )}

        <div className="bg-gray-200 rounded-2xl p-4 mb-6">
          <div className="grid grid-cols-4 gap-3">
            {grid.map((row, i) =>
              row.map((cell, j) => (
                <button
                  key={`${i}-${j}`}
                  onClick={() => moveTile(i, j)}
                  disabled={cell === 0 || isWon}
                  className={`${getTileColor(cell)} rounded-xl aspect-square flex items-center justify-center text-3xl font-bold transition-all duration-200 shadow-lg ${
                    cell === 0 
                      ? 'cursor-default' 
                      : canMove(i, j) && !isWon
                      ? 'hover:scale-105 cursor-pointer text-white hover:shadow-xl'
                      : 'cursor-not-allowed text-white opacity-80'
                  }`}
                >
                  {cell !== 0 && cell}
                </button>
              ))
            )}
          </div>
        </div>

        {isWon && (
          <div className="bg-gradient-to-r from-green-400 to-emerald-500 border-2 border-green-600 rounded-xl p-6 text-center text-white shadow-lg">
            <h2 className="text-3xl font-bold mb-2">🎉 You Won!</h2>
            <p className="text-lg mb-1">Moves: <span className="font-bold">{moves}</span></p>
            <p className="text-lg mb-4">Time: <span className="font-bold">{formatTime(time)}</span></p>
            <button
              onClick={initGame}
              className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Play Again
            </button>
          </div>
        )}

        <div className="mt-6 text-center text-sm text-gray-600">
          <p className="font-semibold mb-1">How to Play:</p>
          <p>Click on tiles adjacent to the empty space to slide them.</p>
          <p>Arrange all numbers from 1-15 in order!</p>
        </div>
      </div>
    </div>
  );
};

export default SlidingPuzzleGame;