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
  isHexString,
  MINIMAL_CONTRACT_DEPOSIT
} from '@alephium/web3'
import { testNodeWallet } from '@alephium/web3-test'
import { ProposalStruct } from '../artifacts/ts/types'

web3.setCurrentNodeProvider('http://127.0.0.1:22973', undefined, fetch)
const nodeProvider = web3.getCurrentNodeProvider()

const deployContract: DeployFunction<Settings> = async (
  deployer: Deployer,
  network: Network<Settings>
): Promise<void> => {
  const signer = await testNodeWallet()
  const [sender, receiver] = await signer.getAccounts()
  await signer.setSelectedAccount(sender.address)

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
    signer,
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
    signer,
    args: { receiver: '13k6iGXSJamjtKV59r9e4VKkNbpHyiAb7mtVFon9pd61Z', amount: amount * ONE_ALPH },
    attoAlphAmount: ONE_ALPH * 10n + DUST_AMOUNT
  })

  console.log('////')
  console.log('Balance after claiming')
  // getBalance = await contract.view.getBalance()
  // console.log(Number(getBalance.returns))
  console.log(`Contract Balance Now: ${await getALPHBalance(contract.address)}`)
  console.log(`Sender Balance Now: ${await getALPHBalance(sender.address)}`)
  console.log(`Receiver Balance Now: ${await getALPHBalance('13k6iGXSJamjtKV59r9e4VKkNbpHyiAb7mtVFon9pd61Z')}`)

  console.log('////')
  console.log('Before Proposing')

  let proposalCount = await result.contractInstance.view.getProposalCount()
  console.log(`Proposal Count: ${proposalCount.returns}`)

  const title = 'This is my first title'
  const description = 'Hello, description here'
  const proposeCost = BigInt(5)

  await contract.transact.propose({
    signer,
    args: { title: stringToHex(title), description: stringToHex(description), amount: proposeCost },
    attoAlphAmount: proposeCost * ONE_ALPH
  })

  console.log('////')
  console.log('After Proposing')

  
  proposalCount = await result.contractInstance.view.getProposalCount()
  console.log(`Proposal Count: ${proposalCount.returns}`)

  const params: CallContractParams<{ pid: bigint }> = {
    args: { pid: proposalCount.returns }
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
  const proposalObject: ProposalStruct = {
    id: BigInt(0),
    title: '',
    description: '',
    upvotes: BigInt(0),
    downvotes: BigInt(0),
    timestamp: BigInt(0),
    owner: ''
  }

  for (const key in proposal.returns) {
    const value = proposal.returns[key]

    if (typeof value === 'string') {
      if (isHexString(value)) {
        proposalObject[key] = hexToString(value)
      } else {
        proposalObject[key] = value
      }
    } else if (typeof value === 'bigint') {
      proposalObject[key] = value
    } else {
      proposalObject[key] = value
    }
  }

  return proposalObject
}

export default deployContract
