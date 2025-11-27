import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders status and allows first move by X', () => {
  render(<App />);
  const status = screen.getByTestId('game-status');
  expect(status).toHaveTextContent(/Player X's turn/i);

  const firstCell = screen.getByTestId('cell-0');
  fireEvent.click(firstCell);
  expect(firstCell).toHaveTextContent('X');
  expect(status).toHaveTextContent(/Player O's turn/i);
});

test('can reset the game', () => {
  render(<App />);
  const firstCell = screen.getByTestId('cell-0');
  fireEvent.click(firstCell);
  expect(firstCell).toHaveTextContent('X');

  const resetButton = screen.getByRole('button', { name: /new game/i });
  fireEvent.click(resetButton);
  expect(firstCell).toHaveTextContent('');
});
