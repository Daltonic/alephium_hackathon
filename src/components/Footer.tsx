import React from 'react'
import logo from '../../assets/logo.png'
import Link from 'next/link'
import Image from 'next/image'

const Footer = () => {
  return (
    <footer className="bg-gray-800 bg-opacity-75 text-slate-200 mt-20 p-6 rounded-md">
      <div className="max-w-7xl mx-auto flex flex-col justify-center items-center p-4 sm:p-0 gap-6 sm:gap-0">
        <div className='text-center'>
          <Link href="/" className="flex gap-2 justify-center items-center text-lg sm:text-2xl ">
            <span>
              <Image src={logo} alt="logo" width={30} height={30} />
            </span>
            <h1 className=" font-semibold ">AlphHack</h1>
          </Link>
          <p className="text-sm">A presentation of how to build dApps on the Alephium Network.</p>
        </div>
      </div>
      <div className="flex items-center gap-3 justify-center mt-4">
        <p> Made with ❤️ from Daltonic</p>
      </div>
    </footer>
  )
}

export default Footer
