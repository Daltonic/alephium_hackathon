import React from 'react'
import Link from 'next/link'
import Menu from './Menu'
import logo from '../../assets/logo.png'
import Image from 'next/image'
import dynamic from 'next/dynamic'

const ConnectionStatusSSR = dynamic(() => import('./ConnectionStatusSSR'), { ssr: false })

const Header = () => {
  return (
    <div className="fixed top-0 w-full bg-[#121926] text-slate-200 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center p-4 px-8">
        <Link href="/" className="flex gap-2 items-center text-lg sm:text-2xl ">
          <span>
            <Image src={logo} alt="logo" width={30} height={30} />
          </span>
          <h1 className=" font-semibold ">AlphHack</h1>
        </Link>

        <div className="flex items-center gap-10">
          <ul className="hidden md:flex gap-4 font-medium list-none">
            <Link href="/">Game</Link>
            <Link href="/proposals">Proposals</Link>
            <Link href="/account">Account</Link>
          </ul>
          <Menu />
          <div className="hidden md:block">
            <ConnectionStatusSSR />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header
