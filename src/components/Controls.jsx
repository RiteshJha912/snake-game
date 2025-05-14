// src/components/Controls.jsx
import React from 'react'

const Controls = ({
  gameStarted,
  gameOver,
  isPaused,
  lastDirection,
  handleControlButtonClick,
  setIsPaused,
}) => {
  if (!gameStarted || gameOver) return null

  return (
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
  )
}

export default Controls
