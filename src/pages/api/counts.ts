import 'dotenv/config'
import { Deployments } from '@alephium/cli'
import { web3 } from '@alephium/web3'
import configuration from 'alephium.config'
import { AlphHack } from '../../../artifacts/ts'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    web3.setCurrentNodeProvider(process.env.NODE_URL || '', undefined, fetch)

    try {
      const deployments = await Deployments.load(configuration, 'devnet')
      const contractAddress = deployments.getDeployedContractResult(0, 'AlphHack')?.contractInstance.address

      const contract = AlphHack.at(contractAddress || '')
      const proposalCount = await contract.view.getProposalCount()
      console.log(`Proposal Count: ${proposalCount.returns}`)

      res.status(200).json({
        message: `Total proposals available`,
        count: proposalCount.returns
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Failed to process claim' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
