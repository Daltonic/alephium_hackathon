import { Deployer, DeployFunction, Network } from '@alephium/cli'
import { Settings } from '../alephium.config'
import { AlphHack } from '../artifacts/ts'
import { CallContractParams, ONE_ALPH } from '@alephium/web3'
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

  // const params: CallContractParams<{ user: string }> = {
  //   args: { user: account.address }
  // }

  const contract = result.contractInstance

  console.log('////')
  console.log('Balance before funding')
  let getBalance = await contract.view.getBalance()
  console.log(getBalance.returns)

  await contract.transact.fundBalance({
    signer,
    args: { amount: ONE_ALPH * 2n },
    attoAlphAmount: ONE_ALPH * 2n
  })

  console.log('////')
  console.log('Balance after funding')
  getBalance = await contract.view.getBalance()
  console.log(Number(getBalance.returns))

  // let getBalance = await contract.view.getUserBal(params)
}

export default deployContract
