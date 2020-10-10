import React from 'react'
import { useLocalStorageState } from '../utils';

const initialSquares = Array(9).fill(null);


function Board({ squares, handleSelectSquare, handleRestart }) {

  function renderSquare(i) {
    return (
      <button className="square" onClick={() => handleSelectSquare(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
      <button className="restart" onClick={handleRestart}>
        restart
      </button>
    </div>
  )
}

function History({ history, currentStep, handleMoveToStep }) {
  return <ol>
    {history.map((historyItem, index) => {
      const textStep = index === 0 ? 'Go To Game Start' : `Go To Move #${index}`;
      return <li key={index}><button onClick={() => handleMoveToStep(index)} disabled={currentStep === index}>{textStep}</button></li>
    })}
  </ol>
}

function Game() {
  const [history, setHistory] = useLocalStorageState('history', [initialSquares]);
  const [currentStep, setCurrentStep] = useLocalStorageState('currentStep', 0);

  const squares = history[currentStep];
  const nextValue = calculateNextValue(squares)
  const winner = calculateWinner(squares)
  const status = calculateStatus(winner, squares, nextValue)

  const handleRestart = () => {
    setHistory([initialSquares]);
    setCurrentStep(0);
  }

  const handleSelectSquare = (squareIndex) => {
    if (winner || squares[squareIndex]) return;

    const squaresUpdate = [...squares];
    squaresUpdate[squareIndex] = nextValue;

    const historyUpdate = [...history];
    const currentStepUpdate = currentStep + 1;
    historyUpdate.push(squaresUpdate);

    setCurrentStep(currentStepUpdate);
    setHistory(historyUpdate);
  }

  const handleMoveToStep = (step) => {
    setCurrentStep(step);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board squares={squares} handleRestart={handleRestart} handleSelectSquare={handleSelectSquare} />
      </div>
      <div className="game-info">
        <div>{status}</div>
        <History history={history} currentStep={currentStep} handleMoveToStep={handleMoveToStep} />
      </div>
    </div>
  )
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
      ? `Scratch: Cat's game`
      : `Next player: ${nextValue}`
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  const xSquaresCount = squares.filter(r => r === 'X').length
  const oSquaresCount = squares.filter(r => r === 'O').length
  return oSquaresCount === xSquaresCount ? 'X' : 'O'
}

// eslint-disable-next-line no-unused-vars
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}
function App() {
  return <Game />
}

export default App
