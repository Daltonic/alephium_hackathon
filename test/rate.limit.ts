import 'dotenv/config'
import { ONE_ALPH, web3 } from '@alephium/web3'

web3.setCurrentNodeProvider(process.env.NEXT_PUBLIC_NODE_URL as string, undefined, fetch)
const nodeProvider = web3.getCurrentNodeProvider()

async function execute() {

  const receiverAddress = '12ekAuxEKSbCnhY7GkxEFuRzpczL5mrMUGWrFbZkweCpR'

  // Transfer ALPH from sender to receiverAddress
  try {
    const { balance: receiverBalanceAfter } = await nodeProvider.addresses.getAddressesAddressBalance(receiverAddress)
    nodeProvider.request

    console.log(`${Number(receiverBalanceAfter) / Number(ONE_ALPH)} ALPH`)
  } catch (error) {
    console.error(error)
  }
}

execute()
