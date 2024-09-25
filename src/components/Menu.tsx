import dynamic from 'next/dynamic'
import Link from 'next/link'
import React, { useState } from 'react'
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai'

const ConnectionStatusSSR = dynamic(() => import('./ConnectionStatusSSR'), { ssr: false })

const Menu = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
    console.log(`Menue is now ${isOpen ? 'Open' : 'Close'}`)
  }

  return (
    <div className="flex items-center">
      <button className="text-gray-500 focus:outline-none md:hidden cursor-pointer" onClick={toggleMenu}>
        {isOpen ? (
          <AiOutlineClose className="h-6 w-6 text-red-500" />
        ) : (
          <AiOutlineMenu className="h-6 w-6 text-red-500" />
        )}
      </button>

      <div
        className={`md:hidden ${
          isOpen
            ? 'p-6 flex flex-col items-center gap-4 absolute top-14 left-0 w-full bg-black text-center text-white text-lg '
            : 'hidden'
        }`}
      >
        <Link href="/">Game</Link>
        <Link href="/proposals">Proposals</Link>
        <Link href="/account">Account</Link>
        <ConnectionStatusSSR />
      </div>
    </div>
  )
}

export default Menu
