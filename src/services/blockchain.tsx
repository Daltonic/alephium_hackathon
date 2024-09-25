import { Deployments } from '@alephium/cli'
import { NodeProvider, web3 } from '@alephium/web3'
import { testNodeWallet } from '@alephium/web3-test'
import configuration from 'alephium.config'
import { AlphHack } from '../../artifacts/ts'

const network = configuration.networks.devnet
const nodeProvider = new NodeProvider(network.nodeUrl)
web3.setCurrentNodeProvider(nodeProvider)

const signer = await testNodeWallet()
const [sender, receiver] = await signer.getAccounts()
await signer.setSelectedAccount(sender.address)

const deployments = await Deployments.load(configuration, 'devnet')
const contractAddress = deployments.getDeployedContractResult(0, 'AlphHack')?.contractInstance.address

const contract = AlphHack.at(contractAddress || '')

// const getProposalCount = async (): Promise<bigint> => {
//   let proposalCount = await contract.view.getProposalCount()
//   console.log(`Proposal Count: ${proposalCount.returns}`)
//   return proposalCount.returns
// }

export { getProposalCount }
