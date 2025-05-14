// src/components/GameBoard.jsx
import React from 'react'

const GameBoard = ({
  gameAreaRef,
  gameStarted,
  isPaused,
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd,
  snake,
  food,
  getHeadClass,
  gameOver,
  score,
  startGame,
  resetGame,
  resumeGame,
}) => {
  return (
    <div
      className={`game-area ${gameStarted ? 'game-active' : 'game-inactive'} ${
        isPaused ? 'game-paused' : ''
      }`}
      ref={gameAreaRef}
      tabIndex='0'
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className='grid'>
        {Array.from({ length: 20 }).map((_, row) => (
          <div key={row} className='row'>
            {Array.from({ length: 20 }).map((_, col) => {
              const isSnakeHead = snake[0][0] === col && snake[0][1] === row
              const isSnakeBody =
                !isSnakeHead &&
                snake.some(
                  (segment, i) =>
                    i > 0 && segment[0] === col && segment[1] === row
                )
              const isFood = food[0] === col && food[1] === row
              return (
                <div
                  key={col}
                  className={`cell ${isSnakeHead ? getHeadClass() : ''} ${
                    isSnakeBody ? 'snake-body' : ''
                  } ${isFood ? 'food' : ''}`}
                ></div>
              )
            })}
          </div>
        ))}
      </div>

      {!gameStarted && (
        <div className='overlay start-screen'>
          <div className='menu-card'>
            <h2>Welcome to Snake</h2>
            <p>Use arrow keys, swipe, or on-screen controls to play</p>
            <button
              onClick={startGame}
              className='primary-button pulse-animation'
            >
              Start Game
            </button>
          </div>
        </div>
      )}

      {gameOver && (
        <div className='overlay game-over-screen'>
          <div className='menu-card'>
            <h2>Game Over!</h2>
            <p>Your Score: {score}</p>
            <p>Snake Length: {snake.length}</p>
            <button onClick={resetGame} className='primary-button'>
              Back to Menu
            </button>
            <button onClick={startGame} className='secondary-button'>
              Play Again
            </button>
          </div>
        </div>
      )}

      {isPaused && !gameOver && gameStarted && (
        <div className='overlay pause-screen'>
          <div className='menu-card'>
            <h2>Game Paused</h2>
            <button onClick={resumeGame} className='primary-button'>
              Resume
            </button>
            <button onClick={resetGame} className='secondary-button'>
              Quit Game
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default GameBoard
