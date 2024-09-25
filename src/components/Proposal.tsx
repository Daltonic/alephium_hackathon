import { truncateAddress } from '@/services/utils'
import { ProposalStruct } from '../../artifacts/ts/types'
import React, { useEffect, useState } from 'react'
import { Account, hexToString, ONE_ALPH, waitForTxConfirmation, web3 } from '@alephium/web3'
import { useWallet } from '@alephium/web3-react'
import { toast } from 'react-toastify'
import { loadDeployments } from 'artifacts/ts/deployments'

interface ProposalProps {
  proposalId: number
}

const Proposal: React.FC<ProposalProps> = ({ proposalId }) => {
  web3.setCurrentNodeProvider('http://127.0.0.1:22973')
  const contract = loadDeployments('devnet').contracts.AlphHack.contractInstance

  const [proposal, setProposal] = useState<ProposalStruct>()
  const [hasVoted, setHasVoted] = useState<boolean>()
  const [account, setAccount] = useState<Account>()
  const { connectionStatus, signer } = useWallet()
  const votingCost = 1n

  const fetchVoteStatus = async () => {
    if (!proposalId || !account) return

    try {
      const response = await fetch(`/api/voted?proposalId=${proposalId}&voterAddress=${account.address}`)
      const data = await response.json()

      setHasVoted(data.voted)
    } catch (error) {
      console.error('Error fetching proposal:', error)
    }
  }

  const fetchProposal = async () => {
    if (!proposalId) return

    try {
      const response = await fetch(`/api/proposal?proposalId=${proposalId}&`)
      const data = await response.json()

      setProposal(data.proposal)
    } catch (error) {
      console.error('Error fetching proposal:', error)
    }
  }

  useEffect(() => {
    signer?.getSelectedAccount().then((account) => setAccount(account))
  }, [signer, connectionStatus, account])

  useEffect(() => {
    fetchProposal()
    fetchVoteStatus()
  }, [proposalId, account])

  const handleVote = async (choice: boolean) => {
    if (connectionStatus !== 'connected' && !account) return toast.error('Please connect wallet first.')
    if (!signer || hasVoted) return

    await toast.promise(
      new Promise<void>((resolve, reject) => {
        contract.transact
          .vote({
            signer,
            args: {
              pid: BigInt(proposalId),
              choosen: choice,
              amount: votingCost
            },
            attoAlphAmount: ONE_ALPH * votingCost
          })
          .then(async (res: any) => {
            await waitForTxConfirmation(res.txId, 1, 4000)
            await fetchProposal()
            await fetchVoteStatus()
            console.log(res.txId)
            resolve(res)
          })
          .catch((error) => reject(error))
      }),
      {
        pending: 'Voting...',
        success: 'Proposal voted successfully 👌',
        error: 'Encountered error 🤯'
      }
    )
  }

  return (
    <div className="text-start mb-5 w-full bg-gray-300 bg-opacity-10 p-4 rounded-xl">
      <h1 className="text-xl mb-2">{hexToString(proposal?.title || '')}</h1>
      <p className="text-sm">{hexToString(proposal?.description || '')}</p>
      <div className="flex space-x-3 my-3">
        <i className="fas fa-pen text-xs text-blue-500 cursor-pointer"></i>
        <i className="fas fa-trash-alt text-xs text-red-500 cursor-pointer"></i>
      </div>
      <div className="flex justify-between items-center flex-wrap my-2 w-full">
        <div className="flex space-x-2 justify-center">
          <button
            className={`flex justify-center items-center px-2 py-1 rounded border-blue-500
              text-xs align-center w-max border transition duration-300 ease space-x-1
              text-blue-500 hover:bg-blue-500 hover:text-white ${hasVoted ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => handleVote(true)}
            disabled={hasVoted}
          >
            <i className="fas fa-ethereum text-xs cursor-pointer"></i>
            <span>{Number(proposal?.upvotes)} Upvote</span>
          </button>
          <button
            className={`flex justify-center items-center px-2 py-1 rounded border-red-500
              text-xs align-center w-max border transition duration-300 ease space-x-1
              text-red-500 hover:bg-red-500 hover:text-white ${hasVoted ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => handleVote(false)}
            disabled={hasVoted}
          >
            <i className="fas fa-ethereum text-xs cursor-pointer"></i>
            <span>{Number(proposal?.downvotes)} Downvote</span>
          </button>
        </div>
        <div className="flex justify-center items-center space-x-2">
          <div className="rounded-full bg-gray-400 w-5 h-5"></div>
          <p className="text-sm">{truncateAddress(proposal?.owner || '')}</p>
        </div>
      </div>
    </div>
  )
}

export default Proposal
