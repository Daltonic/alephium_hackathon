import { DUST_AMOUNT, ONE_ALPH, web3 } from '@alephium/web3'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const receiverAddress = req.query.receiverAddress as string

    if (!receiverAddress) {
      return res.status(400).json({ error: 'Receiver address is required' })
    }

    web3.setCurrentNodeProvider('http://127.0.0.1:22973', undefined, fetch)
    const nodeProvider = web3.getCurrentNodeProvider()

    try {
      const { balance } = await nodeProvider.addresses.getAddressesAddressBalance(receiverAddress)

      res.status(200).json({
        message: `Balance in ALPH for: ${receiverAddress}`,
        balance: BigInt(balance) / ONE_ALPH
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Failed to process claim' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
