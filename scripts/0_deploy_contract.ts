import { Deployer, DeployFunction, Network } from '@alephium/cli'
import { Settings } from '../alephium.config'
import { AlphHack } from '../artifacts/ts'
import {
  Address,
  CallContractParams,
  DUST_AMOUNT,
  ONE_ALPH,
  stringToHex,
  hexToString,
  web3,
  isHexString
} from '@alephium/web3'
import { getSigners } from '@alephium/web3-test'

interface Proposal {
  id: string
  title: string
  description: string
  upvotes: string
  downvotes: string
  timestamp: number
  owner: string
}

web3.setCurrentNodeProvider('http://127.0.0.1:22973', undefined, fetch)
const nodeProvider = web3.getCurrentNodeProvider()

const deployContract: DeployFunction<Settings> = async (
  deployer: Deployer,
  network: Network<Settings>
): Promise<void> => {
  const [sender, receiver] = await getSigners(2)

  const result = await deployer.deployContract(AlphHack, {
    initialFields: {
      owner: sender.address,
      balance: BigInt(0),
      totalProposals: BigInt(0)
    }
  })

  const amount = BigInt(5)

  const contract = result.contractInstance
  console.log(contract.address)

  console.log('////')
  console.log('Balance before funding')
  // let getBalance = await contract.view.getBalance()
  // console.log(Number(getBalance.returns))

  console.log(`Contract Balance Before: ${await getALPHBalance(contract.address)}`)
  console.log(`Sender Balance Before: ${await getALPHBalance(sender.address)}`)
  console.log(`Receiver Balance Before: ${await getALPHBalance(receiver.address)}`)

  const gasFee = BigInt(result.gasAmount) * BigInt(result.gasPrice)
  console.log('Gas Fee: ', gasFee)

  await contract.transact.receive({
    signer: sender,
    args: { amount: amount * ONE_ALPH },
    attoAlphAmount: ONE_ALPH * 10n + DUST_AMOUNT
  })

  console.log('////')
  console.log('Balance after funding')
  // getBalance = await contract.view.getBalance()
  // console.log(Number(getBalance.returns))
  console.log(`Contract Balance After: ${await getALPHBalance(contract.address)}`)
  console.log(`Sender Balance After: ${await getALPHBalance(sender.address)}`)
  console.log(`Receiver Balance After: ${await getALPHBalance(receiver.address)}`)

  await contract.transact.transfer({
    signer: sender,
    args: { receiver: receiver.address, amount: amount * ONE_ALPH },
    attoAlphAmount: ONE_ALPH * 10n + DUST_AMOUNT
  })

  console.log('////')
  console.log('Balance after claiming')
  // getBalance = await contract.view.getBalance()
  // console.log(Number(getBalance.returns))
  console.log(`Contract Balance Now: ${await getALPHBalance(contract.address)}`)
  console.log(`Sender Balance Now: ${await getALPHBalance(sender.address)}`)
  console.log(`Receiver Balance Now: ${await getALPHBalance(receiver.address)}`)

  console.log('////')
  console.log('Before Proposing')

  let proposalCount = await result.contractInstance.view.getProposalCount()
  console.log(`Proposal Count: ${proposalCount.returns}`)

  const title = 'This is my first title'
  const description = 'Hello, description here'
  const proposeCost = BigInt(5)

  await contract.transact.propose({
    signer: sender,
    args: { title: stringToHex(title), description: stringToHex(description), amount: proposeCost * ONE_ALPH },
    attoAlphAmount: ONE_ALPH * 10n + DUST_AMOUNT
  })

  console.log('////')
  console.log('After Proposing')

  proposalCount = await result.contractInstance.view.getProposalCount()
  console.log(`Proposal Count: ${proposalCount.returns}`)

  const params: CallContractParams<{ pid: bigint }> = {
    args: { pid: BigInt(1) }
  }

  const proposal: any = await result.contractInstance.view.getProposal(params)
  const proposalObject = getProposalObject(proposal)

  console.log(proposalObject)
}

async function getALPHBalance(address: Address): Promise<bigint> {
  const balances = await nodeProvider.addresses.getAddressesAddressBalance(address)
  return BigInt(balances.balance)
}

function getProposalObject(proposal: any): Record<string, any> {
  const proposalObject: Record<string, any> = {}

  for (const key in proposal.returns) {
    const value = proposal.returns[key]

    if (typeof value === 'string') {
      if (isHexString(value)) {
        proposalObject[key] = hexToString(value)
      } else {
        proposalObject[key] = value
      }
    } else if (typeof value === 'bigint') {
      proposalObject[key] = Number(value)
    } else {
      proposalObject[key] = value
    }
  }

  return proposalObject
}

export default deployContract
