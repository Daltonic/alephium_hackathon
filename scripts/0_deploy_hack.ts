import { Deployer, DeployFunction, Network } from '@alephium/cli'
import { Settings } from '../alephium.config'
import { AlphHack } from '../artifacts/ts'
import { CallContractParams, DUST_AMOUNT, ONE_ALPH } from '@alephium/web3'
import { testNodeWallet } from '@alephium/web3-test'

const deployContract: DeployFunction<Settings> = async (
  deployer: Deployer,
  network: Network<Settings>
): Promise<void> => {
  const result = await deployer.deployContract(AlphHack, {
    initialFields: {
      balance: BigInt(0)
    }
  })

  // console.log('Contract id: ' + result.contractInstance.contractId)
  // console.log('Contract address: ' + result.contractInstance.address)

  const signer = await testNodeWallet()
  const accounts = await signer.getAccounts()
  const account = accounts[0]
  const amount = BigInt(5)

  // const params: CallContractParams<{ user: string }> = {
  //   args: { user: account.address }
  // }

  const contract = result.contractInstance
  console.log(contract.address)

  console.log('////')
  console.log('Balance before funding')
  let getBalance = await contract.view.getBalance()
  console.log(Number(getBalance.returns))
  console.log(
    `Contract Balances: ${(await signer.nodeProvider.addresses.getAddressesAddressBalance(contract.address)).balance}`
  )

  const gasFee = BigInt(result.gasAmount) * BigInt(result.gasPrice)
  console.log('Gas Fee: ', gasFee)

  await contract.transact.fundBalance({
    signer,
    args: { amount: amount * ONE_ALPH },
    attoAlphAmount: ONE_ALPH * 10n + DUST_AMOUNT
  })

  console.log('////')
  console.log('Balance after funding')
  getBalance = await contract.view.getBalance()
  console.log(Number(getBalance.returns))
  console.log(
    `Contract Balances: ${(await signer.nodeProvider.addresses.getAddressesAddressBalance(contract.address)).balance}`
  )
}

export default deployContract
