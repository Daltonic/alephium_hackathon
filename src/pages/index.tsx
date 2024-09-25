import React, { useEffect, useState, useRef } from 'react'
import Head from 'next/head'
import jumper from '../../assets/frog.gif'
import obstacle from '../../assets/flower.png'
import { useWallet } from '@alephium/web3-react'
import { Account } from '@alephium/web3'
import { toast } from 'react-toastify'

const Home: React.FC = () => {
  const [isJumping, setIsJumping] = useState<boolean>(false)
  const [isGameOver, setIsGameOver] = useState<boolean>(true)
  const [leftPosition, setLeftPosition] = useState<number>(100)
  const [obstacleSpeed, setObstacleSpeed] = useState<number>(1)
  const [position, setPosition] = useState<number>(270)
  const [increaseTime] = useState<number>(30)
  const [canJump, setCanJump] = useState<boolean>(true)
  const [resetObstacle, setResetObstacle] = useState<boolean>(false)
  const [survivalTime, setSurvivalTime] = useState<number>(0)
  const { connectionStatus, signer } = useWallet()

  const jumperRef = useRef<HTMLDivElement>(null)
  const obstacleRef = useRef<HTMLDivElement>(null)

  let animationId: number
  const [account, setAccount] = useState<Account>()

  useEffect(() => {
    signer?.getSelectedAccount().then((account) => setAccount(account))
  }, [connectionStatus, signer])

  const claimPrize = async () => {
    if (connectionStatus === 'connected' && account) {
      console.log('Sending...')

      const headersList = {
        Accept: '*/*',
        'User-Agent': 'Thunder Client (https://www.thunderclient.com)',
        'Content-Type': 'application/json'
      }

      const bodyContent = JSON.stringify({
        receiverAddress: account.address,
        amount: Math.round(survivalTime)
      })

      await toast.promise(
        new Promise<void>((resolve, reject) => {
          fetch('/api/claim', {
            method: 'POST',
            body: bodyContent,
            headers: headersList
          })
            .then(async (res: any) => {
              const data = await res.json()
              resetGame()
              console.log(data)
              console.log('Transfer successful')
              resolve(res)
            })
            .catch((error) => reject(error))
        }),
        {
          pending: 'Claiming...',
          success: 'Prize sent successfully 👌',
          error: 'Encountered error 🤯'
        }
      )

      const response = await fetch('/api/claim', {
        method: 'POST',
        body: bodyContent,
        headers: headersList
      })
    }
  }

  // Increment survival time
  useEffect(() => {
    let intervalId: NodeJS.Timeout

    if (!isGameOver) {
      let timeSwap = 0
      intervalId = setInterval(() => {
        setSurvivalTime((prevTime) => prevTime + 0.1)
        timeSwap += 1
        if (timeSwap === increaseTime) {
          setObstacleSpeed((prevSpeed) => prevSpeed + 1)
          timeSwap = 0
        }
      }, 1000)
    }

    return () => {
      clearInterval(intervalId)
    }
  }, [isGameOver])

  // Check collision
  const checkCollision = () => {
    if (isGameOver) return

    const obstacleLeft = obstacleRef.current?.style.left?.replace('%', '')
    const jumperTop = jumperRef.current?.style.top?.replace('px', '')

    if (obstacleLeft && jumperTop) {
      if (parseInt(obstacleLeft) <= 3 && parseInt(jumperTop) > 210) {
        setIsGameOver(true)
        cancelAnimationFrame(animationId)
      }
    }
  }

  // Animate obstacle
  useEffect(() => {
    const animateObstacle = () => {
      if (obstacleRef.current && !isGameOver) {
        const currentLeft = parseInt(obstacleRef.current.style.left || '0')
        const newLeft = Math.max(-10, currentLeft - obstacleSpeed)

        if (newLeft <= -10) {
          obstacleRef.current.style.left = '100%'
          setResetObstacle(true)
        } else {
          obstacleRef.current.style.left = `${newLeft}%`
        }
      }
      animationId = requestAnimationFrame(animateObstacle)
    }

    animationId = requestAnimationFrame(animateObstacle)

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [obstacleSpeed, isGameOver, resetObstacle])

  // Handle jumping
  useEffect(() => {
    let intervalId: NodeJS.Timeout

    if (isJumping) {
      let isGoingUp = true
      const jumpHeight = 100

      intervalId = setInterval(() => {
        if (isGoingUp) {
          setPosition((prevPos) => {
            if (prevPos <= jumpHeight) {
              isGoingUp = false
            }
            return Math.max(prevPos - 10, jumpHeight)
          })
        } else {
          setPosition((prevPos) => {
            if (prevPos >= 270) {
              clearInterval(intervalId)
              setIsJumping(false)
              setCanJump(true)
            }
            return Math.min(prevPos + 25, 270)
          })
        }
      }, 50)
    }

    return () => {
      clearInterval(intervalId)
    }
  }, [isJumping])

  const jump = () => {
    if (canJump) {
      setIsJumping(true)
      setPosition(120)
      setCanJump(false)
      setIsGameOver(false)
      setLeftPosition(100)
    }
  }

  useEffect(() => {
    const intervalId = setInterval(checkCollision, 10)
    return () => {
      clearInterval(intervalId)
    }
  }, [isGameOver])

  // Handle key press for jump
  useEffect(() => {
    if (isGameOver) return
    const handleKeyPress = (event: any) => {
      if (event.code === 'Space' && canJump) {
        jump()
      }
    }

    document.addEventListener('keydown', handleKeyPress)

    return () => {
      document.removeEventListener('keydown', handleKeyPress)
    }
  }, [canJump, jump])

  const resetGame = () => {
    setIsGameOver(false)
    setIsJumping(false)
    setCanJump(true)
    setLeftPosition(100)
    setPosition(270)
    setResetObstacle(false)
    setSurvivalTime(0)

    if (obstacleRef.current) {
      obstacleRef.current.style.left = '100%'
    }
  }

  return (
    <>
      <Head>
        <title>AlphHack</title>
        <meta name="description" content="Generated by @alephium/cli init" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="w-full h-80 mx-auto overflow-hidden relative bg-gray-300 bg-opacity-10 rounded-xl">
        <div
          ref={jumperRef}
          className={`bg-no-repeat w-16 h-16 relative bg-cover bg-center ${isJumping ? 'jump' : ''}`}
          style={{ backgroundImage: `url(${jumper.src})`, top: `${position}px` }}
        />
        <div
          ref={obstacleRef}
          className="bg-no-repeat w-16 h-16 relative top-[195px] bg-cover bg-center"
          style={{ backgroundImage: `url(${obstacle.src})`, left: `${leftPosition}%` }}
        />

        {isGameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-15 z-20">
            {survivalTime > 0 ? (
              <div className="flex flex-col items-center space-y-2">
                <h4 className="text-xl font-bold">Game Over!</h4>
                <p className="text-sm">You must get up to 5 ALPH before claiming free tokens.</p>
                <button
                  onClick={resetGame}
                  className="bg-gray-500 shadow-lg shadow-black text-white rounded-full
                  p-1 min-w-28 text-md hidden md:block hover:bg-[#141f34] transition
                  duration-300 ease-in-out transform hover:scale-105 mx-auto mt-5"
                >
                  Restart
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-2">
                <h4 className="text-xl font-bold">Welcome!</h4>
                <p className="text-sm">
                  Press <span className="text-red-500">Spacebar</span> to jump obstacles, speed doubles after{' '}
                  <span className="text-red-500">{increaseTime}sec</span>, claim your prize from{' '}
                  <span className="text-red-500">5 ALPH</span>.
                </p>
                <button
                  onClick={resetGame}
                  className="bg-gray-500 shadow-lg shadow-black text-white rounded-full
                  p-1 min-w-28 text-md hidden md:block hover:bg-[#141f34] transition
                  duration-300 ease-in-out transform hover:scale-105 mx-auto mt-5"
                >
                  Start
                </button>
              </div>
            )}
          </div>
        )}

        <div className="absolute top-2 left-4 bg-gray-100 bg-opacity-15 py-1 px-2 rounded-lg">
          Speed <span className="text-red-500">x{obstacleSpeed}</span>
        </div>
        <div className="absolute top-2 right-4 bg-gray-100 bg-opacity-15 py-1 px-2 rounded-lg">
          ALPH <span className="text-red-500">{survivalTime.toFixed(1)}</span>
        </div>
      </div>

      {!isGameOver && (
        <button
          onClick={jump}
          className="bg-red-500 shadow-lg shadow-black text-white rounded-full
          p-1 min-w-28 text-md hidden md:block hover:bg-[#141f34] transition
          duration-300 ease-in-out transform hover:scale-105 mx-auto mt-5"
        >
          Jump
        </button>
      )}

      {isGameOver && survivalTime > 3 && (
        <button
          className="bg-green-500 shadow-lg shadow-black text-white rounded-full
          p-1 min-w-28 text-md hidden md:block hover:bg-[#141f34] transition
          duration-300 ease-in-out transform hover:scale-105 mx-auto mt-5"
          onClick={() => claimPrize()}
        >
          Claim Prize
        </button>
      )}
    </>
  )
}

export default Home
