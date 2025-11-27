import React, { useMemo, useState } from 'react';
import './App.css';

/**
 * PUBLIC_INTERFACE
 * App renders a two-player Tic Tac Toe game with Ocean Professional theme.
 * - 3x3 grid
 * - Turn indicator
 * - Win/Draw detection
 * - Reset/New Game
 * - No backend dependencies
 */
function App() {
  // Board state holds 9 cells with 'X' | 'O' | null
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [gameKey, setGameKey] = useState(0); // used to re-seed animations if needed

  // Calculate winner and draw
  const { winner, winningLine } = useMemo(() => calculateWinner(board), [board]);
  const isBoardFull = useMemo(() => board.every((c) => c !== null), [board]);
  const isDraw = !winner && isBoardFull;

  // Handle clicking a cell
  const handleCellClick = (index) => {
    if (board[index] || winner) return; // ignore clicks on filled or finished game
    const next = board.slice();
    next[index] = xIsNext ? 'X' : 'O';
    setBoard(next);
    setXIsNext((prev) => !prev);
  };

  // PUBLIC_INTERFACE
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setGameKey((k) => k + 1);
  };

  // Status message for aria-live region
  const statusMessage = winner
    ? `${winner} wins`
    : isDraw
      ? 'Draw'
      : `Player ${xIsNext ? 'X' : 'O'}'s turn`;

  return (
    <div className="app-root">
      <main className="game-container" role="main" aria-label="Tic Tac Toe Game">
        <header className="header">
          <h1 className="title">Tic Tac Toe</h1>
          <p className="subtitle">Two players on the same device</p>
        </header>

        <section
          className="status"
          aria-live="polite"
          aria-atomic="true"
          role="status"
        >
          <span
            className={`badge ${winner ? 'badge-win' : isDraw ? 'badge-draw' : 'badge-turn'}`}
            data-testid="game-status"
          >
            {statusMessage}
          </span>
        </section>

        <Board
          key={gameKey}
          board={board}
          onCellClick={handleCellClick}
          winningLine={winningLine}
          disabled={Boolean(winner) || isDraw}
        />

        <footer className="controls">
          <button
            className="btn btn-primary"
            onClick={resetGame}
            aria-label="Reset and start a new game"
          >
            New Game
          </button>
          {!winner && !isDraw && (
            <div className="turn-indicator" aria-hidden="true">
              <TurnPill player={xIsNext ? 'X' : 'O'} />
            </div>
          )}
        </footer>
      </main>
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * Board renders a 3x3 grid of cells.
 */
function Board({ board, onCellClick, winningLine, disabled }) {
  return (
    <div className="board" role="grid" aria-label="3 by 3 Tic Tac Toe board">
      {board.map((value, idx) => {
        const isWinning = winningLine?.includes(idx);
        return (
          <Cell
            key={idx}
            index={idx}
            value={value}
            onClick={onCellClick}
            disabled={disabled || Boolean(value)}
            isWinning={Boolean(isWinning)}
          />
        );
      })}
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * Cell renders an individual cell with styling and state.
 */
function Cell({ index, value, onClick, disabled, isWinning }) {
  const label = value
    ? `Cell ${index + 1}, ${value}`
    : `Cell ${index + 1}, empty${disabled ? ', disabled' : ''}`;

  return (
    <button
      type="button"
      className={`cell ${value ? 'cell-filled' : ''} ${isWinning ? 'cell-winning' : ''}`}
      onClick={() => onClick(index)}
      disabled={disabled}
      aria-label={label}
      role="gridcell"
      aria-disabled={disabled ? 'true' : 'false'}
      data-testid={`cell-${index}`}
    >
      {value && <span className={`mark ${value === 'X' ? 'mark-x' : 'mark-o'}`}>{value}</span>}
    </button>
  );
}

/**
 * PUBLIC_INTERFACE
 * TurnPill shows the current player's turn with accent color.
 */
function TurnPill({ player }) {
  return (
    <span className={`pill pill-${player === 'X' ? 'x' : 'o'}`}>
      Turn: {player}
    </span>
  );
}

/**
 * PUBLIC_INTERFACE
 * calculateWinner determines if there's a winning line on the board.
 */
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6], // diagonals
  ];
  for (const line of lines) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], winningLine: line };
    }
  }
  return { winner: null, winningLine: null };
}

export default App;
