import 'dotenv/config'
import { NetworkId } from '@alephium/web3'
import { loadDeployments } from '../../artifacts/ts/deployments'

export interface AlphHackConfig {
  network: NetworkId
  groupIndex: number
  alphHackAddress: string
  alphHackId: string
}

function getNetwork(): NetworkId {
  const network = (process.env.NEXT_PUBLIC_NETWORK ?? 'devnet') as NetworkId
  return network
}

function getAlphHackConfig(): AlphHackConfig {
  const network = getNetwork()
  const alphHack = loadDeployments(network).contracts.AlphHack.contractInstance
  const groupIndex = alphHack.groupIndex
  const alphHackAddress = alphHack.address
  const alphHackId = alphHack.contractId
  return { network, groupIndex, alphHackAddress, alphHackId }
}

export const truncateAddress = (address: string): string => {
  if (!address || typeof address !== 'string') return ''

  const truncatedLength = 4
  const truncatedAddress = `${address.slice(0, truncatedLength)}...${address.slice(-truncatedLength)}`

  return truncatedAddress
}

export const isValidNetworkId = (networkId: string): networkId is NetworkId => {
  return ['mainnet', 'testnet', 'devnet'].includes(networkId)
}

export const alphHackConfig = getAlphHackConfig()
