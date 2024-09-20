import { Account, CallContractParams, web3 } from '@alephium/web3'
import { testNodeWallet } from '@alephium/web3-test'
import { AlphHack } from '../artifacts/ts'
import { NodeWallet } from '@alephium/web3-wallet'

async function test() {
  let signer: NodeWallet
  let contractAddress: string = '23s5db3o5MbAU2P3f5T4B8aaxdW3K1mTnkg8LWHAKFmV9'
  let accounts: Account[]

  web3.setCurrentNodeProvider('http://127.0.0.1:22973', undefined, fetch)
  signer = await testNodeWallet()
  accounts = await signer.getAccounts()

  const account = accounts[1]

  const params: CallContractParams<{ user: string }> = {
    args: { user: account.address }
  }

  await signer.setSelectedAccount(account.address)
  const contract = AlphHack.at(contractAddress)

  // let getUserBalance = await contract.view.getBalance(params)
  // let getBalance = await contract.view.getBalance()
  // console.log(getBalance.returns)
  let getBalance = await contract.view.getUserBal(params)
  console.log(getBalance.returns)
}

test()
