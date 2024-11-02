// src/SnakeGame.jsx
import React, { useState, useEffect } from 'react'
import './SnakeGame.css' // Import CSS for styling

const SnakeGame = () => {
  const [snake, setSnake] = useState([[0, 0]])
  const [food, setFood] = useState([5, 5])
  const [direction, setDirection] = useState('RIGHT')
  const [gameOver, setGameOver] = useState(false)
  const [gameStarted, setGameStarted] = useState(false) // New state to track game start

  const moveSnake = () => {
    setSnake((prevSnake) => {
      const head = [...prevSnake[0]]
      switch (direction) {
        case 'RIGHT':
          head[0] += 1
          break
        case 'LEFT':
          head[0] -= 1
          break
        case 'UP':
          head[1] -= 1
          break
        case 'DOWN':
          head[1] += 1
          break
        default:
          break
      }

      // Check for collisions
      if (
        head[0] < 0 ||
        head[0] >= 20 ||
        head[1] < 0 ||
        head[1] >= 20 ||
        prevSnake.some(
          (segment) => segment[0] === head[0] && segment[1] === head[1]
        )
      ) {
        setGameOver(true)
        return prevSnake
      }

      const newSnake = [head, ...prevSnake]
      if (head[0] === food[0] && head[1] === food[1]) {
        // Generate new food
        setFood([
          Math.floor(Math.random() * 20),
          Math.floor(Math.random() * 20),
        ])
      } else {
        newSnake.pop() // Remove last segment if not eating
      }
      return newSnake
    })
  }

  const handleKeyPress = (event) => {
    switch (event.key) {
      case 'ArrowRight':
        if (direction !== 'LEFT') setDirection('RIGHT')
        break
      case 'ArrowLeft':
        if (direction !== 'RIGHT') setDirection('LEFT')
        break
      case 'ArrowUp':
        if (direction !== 'DOWN') setDirection('UP')
        break
      case 'ArrowDown':
        if (direction !== 'UP') setDirection('DOWN')
        break
      default:
        break
    }
  }

  useEffect(() => {
    if (!gameStarted || gameOver) return // Only move the snake if the game has started and is not over
    const interval = setInterval(() => {
      moveSnake()
    }, 200)
    window.addEventListener('keydown', handleKeyPress)

    return () => {
      clearInterval(interval)
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [direction, gameStarted, gameOver]) // Updated dependencies

  const startGame = () => {
    setSnake([[0, 0]])
    setFood([5, 5])
    setDirection('RIGHT')
    setGameOver(false)
    setGameStarted(true) // Set game started to true
  }

  const resetGame = () => {
    setSnake([[0, 0]])
    setFood([5, 5])
    setDirection('RIGHT')
    setGameOver(false)
    setGameStarted(false) // Set game started to false when resetting
  }

  return (
    <div className='snake-game'>
      <div className={`grid ${gameStarted ? 'game-active' : 'game-inactive'}`}>
        {Array.from({ length: 20 }).map((_, row) => (
          <div key={row} className='row'>
            {Array.from({ length: 20 }).map((_, col) => {
              const isSnake = snake.some(
                (segment) => segment[0] === col && segment[1] === row
              )
              const isFood = food[0] === col && food[1] === row
              return (
                <div
                  key={col}
                  className={`cell ${isSnake ? 'snake' : ''} ${
                    isFood ? 'food' : ''
                  }`}
                ></div>
              )
            })}
          </div>
        ))}
        {!gameStarted && ( // Center the start button
          <div className='start-button-container'>
            <button onClick={startGame} className='start-button'>
              Start Game
            </button>
          </div>
        )}
        {gameOver && ( // Display the game over message on the game box
          <div className='game-over'>
            <h2>Game Over!</h2>
            <button onClick={resetGame} className='restart-button'>
              Restart
            </button>
          </div>
        )}
      </div>
      {gameStarted && ( // Control Buttons with arrows
        <div className='controls'>
          <button onClick={() => setDirection('UP')}>&uarr;</button>
          <div>
            <button onClick={() => setDirection('LEFT')}>&larr;</button>
            <button onClick={() => setDirection('RIGHT')}>&rarr;</button>
          </div>
          <button onClick={() => setDirection('DOWN')}>&darr;</button>
        </div>
      )}
    </div>
  )
}

export default SnakeGame
