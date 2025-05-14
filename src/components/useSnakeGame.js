// src/components/useSnakeGame.js
import { useState, useEffect, useRef } from 'react'

const useSnakeGame = () => {
  const [snake, setSnake] = useState([[0, 0]])
  const [food, setFood] = useState([5, 5])
  const [direction, setDirection] = useState('RIGHT')
  const [gameOver, setGameOver] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [score, setScore] = useState(0)
  const [speed, setSpeed] = useState(200) // Speed in ms (lower is faster)
  const [lastDirection, setLastDirection] = useState('RIGHT') // Track last direction for mobile responsiveness
  const lastMoveTime = useRef(Date.now())

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

  return {
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
  }
}

export default useSnakeGame
