import { Deployments } from '@alephium/cli'
import { CallContractParams, web3 } from '@alephium/web3'
import { testNodeWallet } from '@alephium/web3-test'
import configuration from 'alephium.config'
import { AlphHack } from '../../../artifacts/ts'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const proposalId = req.query.proposalId as string

    if (!proposalId) {
      return res.status(400).json({ error: 'Proposal ID is required' })
    }

    web3.setCurrentNodeProvider('http://127.0.0.1:22973', undefined, fetch)

    const signer = await testNodeWallet()
    const [sender] = await signer.getAccounts()
    await signer.setSelectedAccount(sender.address)

    try {
      const deployments = await Deployments.load(configuration, 'devnet')
      const contractAddress = deployments.getDeployedContractResult(0, 'AlphHack')?.contractInstance.address
      const contract = AlphHack.at(contractAddress || '')

      const params: CallContractParams<{ pid: bigint }> = {
        args: { pid: BigInt(proposalId) }
      }

      let proposal = await contract.view.getProposal(params)

      res.status(200).json({
        message: `Total proposals available`,
        proposal: proposal.returns
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Failed to process claim' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
