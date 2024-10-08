import 'dotenv/config'
import { Configuration } from '@alephium/cli'
import { Number256 } from '@alephium/web3'

// Settings are usually for configuring
export type Settings = {
  issueTokenAmount: Number256
  openaiAPIKey?: string
  ipfs?: {
    infura?: {
      projectId: string
      projectSecret: string
    }
  }
}

const defaultSettings: Settings = {
  issueTokenAmount: 100n,
  openaiAPIKey: process.env.OPENAI_API_KEY || '',
  ipfs: {
    infura: {
      projectId: process.env.IPFS_INFURA_PROJECT_ID || '',
      projectSecret: process.env.IPFS_INFURA_PROJECT_SECRET || ''
    }
  }
}


const configuration: Configuration<Settings> = {
  networks: {
    devnet: {
      nodeUrl: process.env.NEXT_PUBLIC_NODE_URL as string,
      // here we could configure which address groups to deploy the contract
      privateKeys: process.env.NEXT_PUBLIC_PRIVATE_KEYS === undefined ? [] : process.env.NEXT_PUBLIC_PRIVATE_KEYS.split(','),
      settings: defaultSettings
    },

    testnet: {
      nodeUrl: process.env.NEXT_PUBLIC_NODE_URL as string,
      privateKeys: process.env.NEXT_PUBLIC_PRIVATE_KEYS === undefined ? [] : process.env.NEXT_PUBLIC_PRIVATE_KEYS.split(','),
      settings: defaultSettings
    },

    mainnet: {
      nodeUrl: process.env.NEXT_PUBLIC_NODE_URL as string,
      privateKeys: process.env.NEXT_PUBLIC_PRIVATE_KEYS === undefined ? [] : process.env.NEXT_PUBLIC_PRIVATE_KEYS.split(','),
      settings: defaultSettings
    }
  }
}

export default configuration
