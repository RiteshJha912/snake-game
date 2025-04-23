import React, { useState, useEffect, useRef } from 'react'
import './SnakeGame.css'

const SnakeGame = () => {
  const [snake, setSnake] = useState([[0, 0]])
  const [food, setFood] = useState([5, 5])
  const [direction, setDirection] = useState('RIGHT')
  const [gameOver, setGameOver] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [score, setScore] = useState(0)
  const [speed, setSpeed] = useState(200) // Speed in ms (lower is faster)
  const [lastDirection, setLastDirection] = useState('RIGHT') // Track last direction for mobile responsiveness
  const gameAreaRef = useRef(null)
  const lastMoveTime = useRef(Date.now())
  const controlGesture = useRef({ startX: 0, startY: 0 })

  const moveSnake = () => {
    if (isPaused) return

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
          (segment, index) =>
            index !== 0 && segment[0] === head[0] && segment[1] === head[1]
        )
      ) {
        setGameOver(true)
        return prevSnake
      }

      const newSnake = [head, ...prevSnake]
      if (head[0] === food[0] && head[1] === food[1]) {
        // Generate new food that's not on the snake
        let newFood
        do {
          newFood = [
            Math.floor(Math.random() * 20),
            Math.floor(Math.random() * 20),
          ]
        } while (
          newSnake.some(
            (segment) => segment[0] === newFood[0] && segment[1] === newFood[1]
          )
        )

        setFood(newFood)
        setScore((prev) => prev + 10)

        // Increase speed slightly as snake grows
        if (speed > 60) {
          setSpeed((prev) => Math.max(prev - 2, 60))
        }
      } else {
        newSnake.pop() // Remove last segment if not eating
      }
      return newSnake
    })
  }

  const handleKeyPress = (event) => {
    if (!gameStarted || gameOver) return

    // Handle pause
    if (event.key === ' ' || event.key === 'Escape') {
      setIsPaused((prev) => !prev)
      event.preventDefault() // Prevent page scrolling
      return
    }

    // Prevent default action for arrow keys to stop browser scrolling
    if (
      ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)
    ) {
      event.preventDefault()
    }

    // Only process direction changes if game is not paused
    if (!isPaused) {
      const now = Date.now()
      // Add a small delay to prevent rapid direction changes (100ms)
      if (now - lastMoveTime.current < 100) {
        return
      }

      switch (event.key) {
        case 'ArrowRight':
          if (direction !== 'LEFT') {
            setDirection('RIGHT')
            setLastDirection('RIGHT')
            lastMoveTime.current = now
          }
          break
        case 'ArrowLeft':
          if (direction !== 'RIGHT') {
            setDirection('LEFT')
            setLastDirection('LEFT')
            lastMoveTime.current = now
          }
          break
        case 'ArrowUp':
          if (direction !== 'DOWN') {
            setDirection('UP')
            setLastDirection('UP')
            lastMoveTime.current = now
          }
          break
        case 'ArrowDown':
          if (direction !== 'UP') {
            setDirection('DOWN')
            setLastDirection('DOWN')
            lastMoveTime.current = now
          }
          break
        default:
          break
      }
    }
  }

  // Touch gesture controls for mobile
  const handleTouchStart = (event) => {
    if (!gameStarted || gameOver || isPaused) return

    const touch = event.touches[0]
    controlGesture.current.startX = touch.clientX
    controlGesture.current.startY = touch.clientY
  }

  const handleTouchMove = (event) => {
    event.preventDefault() // Prevent screen scrolling while playing
  }

  const handleTouchEnd = (event) => {
    if (!gameStarted || gameOver || isPaused) return

    const touch = event.changedTouches[0]
    const deltaX = touch.clientX - controlGesture.current.startX
    const deltaY = touch.clientY - controlGesture.current.startY

    // Only register touch if it moved more than 20px
    if (Math.abs(deltaX) < 20 && Math.abs(deltaY) < 20) return

    // Determine the primary direction of the swipe
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (deltaX > 0 && direction !== 'LEFT') {
        // Right swipe
        setDirection('RIGHT')
        setLastDirection('RIGHT')
      } else if (deltaX < 0 && direction !== 'RIGHT') {
        // Left swipe
        setDirection('LEFT')
        setLastDirection('LEFT')
      }
    } else {
      // Vertical swipe
      if (deltaY > 0 && direction !== 'UP') {
        // Down swipe
        setDirection('DOWN')
        setLastDirection('DOWN')
      } else if (deltaY < 0 && direction !== 'DOWN') {
        // Up swipe
        setDirection('UP')
        setLastDirection('UP')
      }
    }
  }

  const handleControlButtonClick = (newDirection) => {
    if (!isPaused && gameStarted && !gameOver) {
      const now = Date.now()
      // Throttle button clicks for mobile (150ms)
      if (now - lastMoveTime.current < 150) {
        return
      }

      // Check if the new direction is valid based on current direction
      if (
        (newDirection === 'UP' && direction !== 'DOWN') ||
        (newDirection === 'DOWN' && direction !== 'UP') ||
        (newDirection === 'LEFT' && direction !== 'RIGHT') ||
        (newDirection === 'RIGHT' && direction !== 'LEFT')
      ) {
        setDirection(newDirection)
        setLastDirection(newDirection)
        lastMoveTime.current = now
      }
    }
  }

  useEffect(() => {
    if (!gameStarted || gameOver || isPaused) return

    const interval = setInterval(() => {
      moveSnake()
    }, speed)

    return () => clearInterval(interval)
  }, [direction, gameStarted, gameOver, isPaused, speed])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [direction, gameStarted, gameOver, isPaused])

  // Focus the game area when game starts
  useEffect(() => {
    if (gameStarted && gameAreaRef.current) {
      gameAreaRef.current.focus()
    }
  }, [gameStarted])

  const startGame = () => {
    setSnake([[0, 0]])
    setFood([5, 5])
    setDirection('RIGHT')
    setLastDirection('RIGHT')
    setGameOver(false)
    setGameStarted(true)
    setIsPaused(false)
    setScore(0)
    setSpeed(200)
  }

  const resumeGame = () => {
    setIsPaused(false)
  }

  const resetGame = () => {
    setSnake([[0, 0]])
    setFood([5, 5])
    setDirection('RIGHT')
    setLastDirection('RIGHT')
    setGameOver(false)
    setGameStarted(false)
    setIsPaused(false)
    setScore(0)
    setSpeed(200)
  }

  // Determine snake head direction for styling
  const getHeadClass = () => {
    return `snake-head head-${direction.toLowerCase()}`
  }

  return (
    <div className='snake-game-container'>
      <div className='game-header'>
        <h1>Snake Game</h1>
        <div className='stats-container'>
          <div className='stat-box'>
            <span className='stat-label'>Score</span>
            <span className='stat-value'>{score}</span>
          </div>
          <div className='stat-box'>
            <span className='stat-label'>Length</span>
            <span className='stat-value'>{snake.length}</span>
          </div>
        </div>
      </div>

      <div
        className={`game-area ${
          gameStarted ? 'game-active' : 'game-inactive'
        } ${isPaused ? 'game-paused' : ''}`}
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

      {gameStarted && !gameOver && (
        <div className='game-controls'>
          <div className='control-buttons'>
            <button
              onClick={() => handleControlButtonClick('UP')}
              className={`control-button ${
                lastDirection === 'UP' ? 'active-direction' : ''
              }`}
              aria-label='Move Up'
            >
              <svg viewBox='0 0 24 24' fill='currentColor'>
                <path d='M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z' />
              </svg>
            </button>
            <div className='horizontal-controls'>
              <button
                onClick={() => handleControlButtonClick('LEFT')}
                className={`control-button ${
                  lastDirection === 'LEFT' ? 'active-direction' : ''
                }`}
                aria-label='Move Left'
              >
                <svg viewBox='0 0 24 24' fill='currentColor'>
                  <path d='M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z' />
                </svg>
              </button>
              <button
                onClick={() => setIsPaused((prev) => !prev)}
                className='control-button pause-button'
                aria-label={isPaused ? 'Resume Game' : 'Pause Game'}
              >
                {isPaused ? (
                  <svg viewBox='0 0 24 24' fill='currentColor'>
                    <path d='M8 5v14l11-7z' />
                  </svg>
                ) : (
                  <svg viewBox='0 0 24 24' fill='currentColor'>
                    <path d='M6 19h4V5H6v14zm8-14v14h4V5h-4z' />
                  </svg>
                )}
              </button>
              <button
                onClick={() => handleControlButtonClick('RIGHT')}
                className={`control-button ${
                  lastDirection === 'RIGHT' ? 'active-direction' : ''
                }`}
                aria-label='Move Right'
              >
                <svg viewBox='0 0 24 24' fill='currentColor'>
                  <path d='M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z' />
                </svg>
              </button>
            </div>
            <button
              onClick={() => handleControlButtonClick('DOWN')}
              className={`control-button ${
                lastDirection === 'DOWN' ? 'active-direction' : ''
              }`}
              aria-label='Move Down'
            >
              <svg viewBox='0 0 24 24' fill='currentColor'>
                <path d='M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z' />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Game instructions that appear when game starts */}
      {/* {gameStarted && !gameOver && !isPaused && (
        <div className='game-instructions'>
          <p>Use arrow keys, swipe, or buttons to move</p>
          <p>Press Space/Escape or the center button to pause</p>
        </div>
      )} */}
    </div>
  )
}

export default SnakeGame
