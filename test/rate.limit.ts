import { web3 } from '@alephium/web3'
import { PrivateKeyWallet } from '@alephium/web3-wallet'
import 'dotenv/config'

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

web3.setCurrentNodeProvider(process.env.NEXT_PUBLIC_NODE_URL as string, undefined, fetch)

const signer = new PrivateKeyWallet({
  privateKey: process.env.NEXT_PUBLIC_PRIVATE_KEYS as string
})

async function execute() {
  const receiverAddress = '12ekAuxEKSbCnhY7GkxEFuRzpczL5mrMUGWrFbZkweCpR'
  const senderAddress = signer.address

  // Transfer ALPH from sender to receiverAddress
  try {
    const transactions: Transaction[] = await fetchTransactions(receiverAddress, 1, '03')
    // Has sent transactions to this wallet in the last 1 hour
    console.log(hasSentUpToThreeTransactions(transactions, senderAddress, receiverAddress, 2))
  } catch (error) {
    console.error(error)
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

execute()
