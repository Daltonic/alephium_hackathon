import 'dotenv/config'
import { ONE_ALPH, waitForTxConfirmation, web3 } from '@alephium/web3'
import { testNodeWallet } from '@alephium/web3-test'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { receiverAddress, amount } = req.body

    if (!receiverAddress) {
      return res.status(400).json({ error: 'Receiver address is required' })
    }

    if (!amount) {
      return res.status(400).json({ error: 'Receiving amount is required' })
    }

    web3.setCurrentNodeProvider(process.env.NODE_URL || '', undefined, fetch)
    const nodeProvider = web3.getCurrentNodeProvider()

    const signer = await testNodeWallet()
    const [sender] = await signer.getAccounts()
    await signer.setSelectedAccount(sender.address)

    // Transfer ALPH from sender to receiverAddress
    try {
      const tx = await signer.signAndSubmitTransferTx({
        signerAddress: sender.address,
        destinations: [{ address: receiverAddress, attoAlphAmount: BigInt(amount) * ONE_ALPH }]
      })

      await waitForTxConfirmation(tx.txId, 1, 2)

      const { balance: receiverBalanceAfter } = await nodeProvider.addresses.getAddressesAddressBalance(receiverAddress)

      res.status(200).json({
        message: `Claim successful, receiver balance: ${receiverBalanceAfter}`
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Failed to process claim' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
