import { Deployer, DeployFunction, Network } from '@alephium/cli'
import { Settings } from '../alephium.config'
import { AlphHack } from '../artifacts/ts'
import { Address, DUST_AMOUNT, ONE_ALPH, web3 } from '@alephium/web3'
import { getSigners } from '@alephium/web3-test'

web3.setCurrentNodeProvider('http://127.0.0.1:22973', undefined, fetch)
const nodeProvider = web3.getCurrentNodeProvider()

const deployContract: DeployFunction<Settings> = async (
  deployer: Deployer,
  network: Network<Settings>
): Promise<void> => {
  const [sender, receive] = await getSigners(2)

  const result = await deployer.deployContract(AlphHack, {
    initialFields: {
      owner: sender.address,
      balance: BigInt(0)
    }
  })

  // console.log('Contract id: ' + result.contractInstance.contractId)
  // console.log('Contract address: ' + result.contractInstance.address)

  // const signer = await testNodeWallet()
  const amount = BigInt(5)

  // const params: CallContractParams<{ user: string }> = {
  //   args: { user: account.address }
  // }

  const contract = result.contractInstance
  console.log(contract.address)

  console.log('////')
  console.log('Balance before funding')
  // let getBalance = await contract.view.getBalance()
  // console.log(Number(getBalance.returns))

  console.log(`Contract Balance Before: ${await getALPHBalance(contract.address)}`)
  console.log(`Sender Balance Before: ${await getALPHBalance(sender.address)}`)
  console.log(`Receiver Balance Before: ${await getALPHBalance(receive.address)}`)

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
  console.log(`Receiver Balance After: ${await getALPHBalance(receive.address)}`)

  await contract.transact.send({
    signer: sender,
    args: { receiver: receive.address, amount: amount * ONE_ALPH },
    attoAlphAmount: ONE_ALPH * 10n + DUST_AMOUNT
  })

  console.log('////')
  console.log('Balance after claiming')
  // getBalance = await contract.view.getBalance()
  // console.log(Number(getBalance.returns))
  console.log(`Contract Balance Now: ${await getALPHBalance(contract.address)}`)
  console.log(`Sender Balance Now: ${await getALPHBalance(sender.address)}`)
  console.log(`Receiver Balance Now: ${await getALPHBalance(receive.address)}`)
}

async function getALPHBalance(address: Address): Promise<bigint> {
  const balances = await nodeProvider.addresses.getAddressesAddressBalance(address)
  return BigInt(balances.balance)
}

export default deployContract
