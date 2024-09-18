import React from 'react'
import Head from 'next/head'
import logo from '../../assets/logo.png'
import Image from 'next/image'
import Link from 'next/link'

export default function Page() {
  return (
    <div>
      <Head>
        <title>AlphHack - Create</title>
        <meta name="description" content="Generated by @alephium/cli init" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="text-gray-300 font-light">
        <div className="w-11/12 md:w-2/5 h-7/12 mx-auto">
          <div className="flex flex-col justify-center items-center rounded-xl mt-5 mb-5">
            <h4 className="p-2 text-lg">Account Details</h4>
          </div>

          <div className="flex flex-col bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex flex-row items-center">
              <Image src={logo} alt="logo" width={40} height={40} />
              <div className="ml-4">
                <h4 className="text-lg font-medium text-gray-200">0x...1234</h4>
                <p className="text-sm text-gray-400">@your_account</p>
              </div>
            </div>
            <div className="flex justify-between items-end">
              <div className="mt-6">
                <h4 className="text-lg font-medium text-gray-200">Account Balance:</h4>
                <p className="text-2xl font-bold text-gray-200">1.234 ALPH</p>
              </div>
              <Link
                href={'/create'}
                className="bg-green-500 shadow-lg shadow-black text-white
              rounded-full p-1 min-w-28 text-md hidden md:block hover:bg-[#141f34]
              transition duration-300 ease-in-out transform hover:scale-105 text-center"
              >
                Propose
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
