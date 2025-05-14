// src/SnakeGame.jsx
import React, { useRef, useEffect } from 'react'
import './SnakeGame.css'
import GameBoard from './components/GameBoard'
import Controls from './components/Controls'
import useSnakeGame from './components/useSnakeGame'
import { useState } from 'react'

// Import your logo here - you'll need to adjust the path to where your logo is stored
// For example, if it's in the public folder:
// import logo from './logo.png'

const SnakeGame = () => {
  const gameAreaRef = useRef(null)
  const controlGesture = useRef({ startX: 0, startY: 0 })

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const {
    snake,
    food,
    direction,
    gameOver,
    gameStarted,
    isPaused,
    score,
    lastDirection,
    startGame,
    resumeGame,
    resetGame,
    getHeadClass,
    handleControlButtonClick,
    handleKeyPress,
    setIsPaused,
  } = useSnakeGame()

  // Show message for PC users to use arrow keys
  const [showPCMessage, setShowPCMessage] = useState(false)

  useEffect(() => {
    if (!isMobile && gameStarted) {
      setShowPCMessage(true)
      const timer = setTimeout(() => setShowPCMessage(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [gameStarted, isMobile])

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
        handleControlButtonClick('RIGHT')
      } else if (deltaX < 0 && direction !== 'RIGHT') {
        // Left swipe
        handleControlButtonClick('LEFT')
      }
    } else {
      // Vertical swipe
      if (deltaY > 0 && direction !== 'UP') {
        // Down swipe
        handleControlButtonClick('DOWN')
      } else if (deltaY < 0 && direction !== 'DOWN') {
        // Up swipe
        handleControlButtonClick('UP')
      }
    }
  }

  // Focus the game area when game starts
  useEffect(() => {
    if (gameStarted && gameAreaRef.current) {
      gameAreaRef.current.focus()
    }
  }, [gameStarted])

  return (
    <div className='snake-game-container'>
      <div className='game-header'>
        <div className='header-with-logo'>
          <img 
          src='/logonew.png' 
          className='game-logo' 
          alt='Slinket.io Logo' 
          />
          <h1>Slinket.io</h1>
          <img 
          src='/logonew.png' 
          className='game-logo' 
          alt='Slinket.io Logo' 
          />
        </div>
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

      {showPCMessage && (
        <div className='pc-controls-hint'>
          Use arrow keys to move. Press space bar to pause.
        </div>
      )}

      <GameBoard
        gameAreaRef={gameAreaRef}
        gameStarted={gameStarted}
        isPaused={isPaused}
        handleTouchStart={handleTouchStart}
        handleTouchMove={handleTouchMove}
        handleTouchEnd={handleTouchEnd}
        snake={snake}
        food={food}
        getHeadClass={getHeadClass}
        gameOver={gameOver}
        score={score}
        startGame={startGame}
        resetGame={resetGame}
        resumeGame={resumeGame}
      />

      {isMobile && (
        <Controls
          gameStarted={gameStarted}
          gameOver={gameOver}
          isPaused={isPaused}
          lastDirection={lastDirection}
          handleControlButtonClick={handleControlButtonClick}
          setIsPaused={setIsPaused}
        />
      )}
    </div>
  )
}

export default SnakeGame
