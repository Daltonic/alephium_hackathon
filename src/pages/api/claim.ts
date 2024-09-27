import 'dotenv/config'
import { waitForTxConfirmation, web3 } from '@alephium/web3'
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrivateKeyWallet } from '@alephium/web3-wallet'

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
