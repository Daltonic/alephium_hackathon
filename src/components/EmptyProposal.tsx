import React from 'react'

const EmptyProposal: React.FC = () => {
  return (
    <div className="text-start mb-5 w-full bg-gray-300 bg-opacity-10 p-4 rounded-xl">
      <h1 className="text-xl mb-2">No Proposal Yet</h1>
      <p className="text-sm">Get started by creating a new proposal for only 1 ALPH.</p>
      <div className="flex space-x-3 my-3">
        <i className="fas fa-pen text-xs text-blue-500 cursor-pointer"></i>
        <i className="fas fa-trash-alt text-xs text-red-500 cursor-pointer"></i>
      </div>
    </div>
  )
}

export default EmptyProposal
