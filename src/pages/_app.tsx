import React from 'react'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { AlephiumWalletProvider } from '@alephium/web3-react'
import { alphHackConfig } from '@/services/utils'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AlephiumWalletProvider theme="midnight" network={alphHackConfig.network} addressGroup={alphHackConfig.groupIndex}>
      <div className="flex flex-col min-h-[100vh]">
        <Header />

        <main className="flex-grow mt-16 p-4 sm:p-8 max-w-7xl sm:mx-auto w-full">
          <Component {...pageProps} />
        </main>
        <Footer />
      </div>
    </AlephiumWalletProvider>
  )
}
