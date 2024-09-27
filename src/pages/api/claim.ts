import 'dotenv/config'
import { waitForTxConfirmation, web3 } from '@alephium/web3'
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrivateKeyWallet } from '@alephium/web3-wallet'

interface Transaction {
  hash: string
  timestamp: number
  inputs: {
    address: string
  }[]
  outputs: {
    address: string
  }[]
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { receiverAddress, amount } = req.body

    if (!receiverAddress) {
      return res.status(400).json({ error: 'Receiver address is required' })
    }

    if (!amount) {
      return res.status(400).json({ error: 'Receiving amount is required' })
    }

    web3.setCurrentNodeProvider(process.env.NEXT_PUBLIC_NODE_URL as string, undefined, fetch)
    const nodeProvider = web3.getCurrentNodeProvider()

    const signer = new PrivateKeyWallet({
      privateKey: process.env.NEXT_PUBLIC_PRIVATE_KEYS as string
    })

    // Transfer ALPH from sender to receiverAddress
    try {
      const transactions: Transaction[] = await fetchTransactions(receiverAddress, 1, 10)
      const maxClaimsPerHour = 3
      // Has sent transactions to this wallet in the last 1 hour
      if (hasSentUpToThreeTransactions(transactions, signer.address, receiverAddress, maxClaimsPerHour)) {
        return res.status(400).json({ error: `You have received upto ${maxClaimsPerHour} claims in the last 1 hour, wait for 60 min.` })
      }

      const tx = await signer.signAndSubmitTransferTx({
        // signerAddress: sender.address,
        signerAddress: signer.address,
        destinations: [{ address: receiverAddress, attoAlphAmount: BigInt(amount) }]
      })

      await waitForTxConfirmation(tx.txId, 1, 4000)

      const { balance: receiverBalanceAfter } = await nodeProvider.addresses.getAddressesAddressBalance(receiverAddress)

      res.status(200).json({
        message: `Claim successful, receiver balance: ${receiverBalanceAfter}`,
        tx: tx.txId
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Failed to process claim' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}

async function fetchTransactions(address: string, page: number, limit: string | number): Promise<Transaction[]> {
  const endpoint = `https://backend.testnet.alephium.org/addresses/${address}/transactions?page=${page}&limit=${limit}`

  try {
    const response = await fetch(endpoint)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching transactions:', error)
    throw error
  }
}

const hasSentUpToThreeTransactions = (
  transactions: Transaction[],
  address1: string,
  address2: string,
  maxTransactions: number
) => {
  const oneHourAgo = Date.now() - 60 * 60 * 1000
  let transactionCount = 0

  for (const tx of transactions) {
    const isRecent = tx.timestamp >= oneHourAgo
    const isFromAddress1 = tx.inputs.some((input) => input.address === address1)
    const isToAddress2 = tx.outputs.some((output) => output.address === address2)

    if (isRecent && isFromAddress1 && isToAddress2) {
      transactionCount++

      if (transactionCount >= maxTransactions) {
        break
      }
    }
  }

  return transactionCount >= maxTransactions
}
