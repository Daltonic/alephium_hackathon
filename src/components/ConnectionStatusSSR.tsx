import React, { useEffect, useState } from 'react'
import { useConnect, useConnectSettingContext, useWallet } from '@alephium/web3-react'
import { Account } from '@alephium/web3'
import { truncateAddress } from '@/services/utils'

const ConnectionStatusSSR = () => {
  const [account, setAccount] = useState<Account>()
  const { connectionStatus, signer } = useWallet()
  const { disconnect } = useConnect()
  const { setOpen } = useConnectSettingContext()

  useEffect(() => {
    signer?.getSelectedAccount().then((account) => setAccount(account))
  }, [signer, connectionStatus, account])

  return (
    <>
      {connectionStatus === 'disconnected' && (
        <button
          className="bg-blue-500 shadow-lg shadow-black text-white
        rounded-full p-1 min-w-28 text-md hover:bg-[#141f34]
        transition duration-300 ease-in-out transform hover:scale-105"
          onClick={() => setOpen(true)}
          // onClick={() => connect()}
        >
          Connect
        </button>
      )}

      {connectionStatus === 'connecting' && (
        <button
          className="bg-blue-500 shadow-lg shadow-black text-white
        rounded-full p-1 min-w-28 text-md hover:bg-[#141f34]
        transition duration-300 ease-in-out transform hover:scale-105"
        >
          Connecting...
        </button>
      )}

      {connectionStatus === 'connected' && (
        <button
          className="bg-blue-500 shadow-lg shadow-black text-white
        rounded-full p-1 min-w-28 text-md hover:bg-[#141f34]
        transition duration-300 ease-in-out transform hover:scale-105"
          onClick={() => disconnect()}
        >
          {truncateAddress(account?.address || '')}
        </button>
      )}
    </>
  )
}

export default ConnectionStatusSSR
