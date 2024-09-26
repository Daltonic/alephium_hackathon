import 'dotenv/config'
import { Deployments } from '@alephium/cli'
import { CallContractParams, web3 } from '@alephium/web3'
import configuration from 'alephium.config'
import { AlphHack } from '../../../artifacts/ts'
import type { NextApiRequest, NextApiResponse } from 'next'
import { isValidNetworkId } from '@/services/utils'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const proposalId = req.query.proposalId as string
    const voterAddress = req.query.voterAddress as string

    if (!proposalId) {
      return res.status(400).json({ error: 'Proposal ID is required' })
    }

    if (!voterAddress) {
      return res.status(400).json({ error: 'Voter Address is required' })
    }

    web3.setCurrentNodeProvider(process.env.NEXT_PUBLIC_NODE_URL as string, undefined, fetch)

    try {
      const deployments = await Deployments.load(
        configuration,
        process.env.NEXT_PUBLIC_NETWORK && isValidNetworkId(process.env.NEXT_PUBLIC_NETWORK)
          ? process.env.NEXT_PUBLIC_NETWORK
          : 'devnet'
      )
      const contractAddress = deployments.getDeployedContractResult(0, 'AlphHack')?.contractInstance.address
      const contract = AlphHack.at(contractAddress || '')

      const params: CallContractParams<{ pid: bigint; voter: string }> = {
        args: { pid: BigInt(proposalId), voter: voterAddress }
      }

      const voted = await contract.view.hasVoted(params)

      res.status(200).json({
        message: `Total proposals available`,
        voted: voted.returns
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Failed to process claim' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
