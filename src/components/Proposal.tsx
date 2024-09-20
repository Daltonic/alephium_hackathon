import React from 'react'

const Proposal = () => {
  return (
    <div className="text-start mb-5 w-full bg-gray-300 bg-opacity-10 p-4 rounded-xl">
      <h1 className="text-xl mb-2">Proposal Title</h1>
      <p className="text-sm">This is a sample proposal description.</p>
      <div className="flex space-x-3 my-3">
        <i className="fas fa-pen text-xs text-blue-500 cursor-pointer"></i>
        <i className="fas fa-trash-alt text-xs text-red-500 cursor-pointer"></i>
      </div>
      <div className="flex justify-between items-center flex-wrap my-2 w-full">
        <div className="flex space-x-2 justify-center">
          <button
            className="flex justify-center items-center px-2 py-1 rounded
            border-blue-500 text-xs align-center w-max border transition
            duration-300 ease space-x-1 text-blue-500 hover:bg-blue-500 hover:text-white"
          >
            <i className="fas fa-ethereum text-xs cursor-pointer"></i>
            <span>10 Upvote</span>
          </button>
          <button
            className="flex justify-center items-center px-2 py-1 rounded
            border-red-500 text-xs align-center w-max border transition
            duration-300 ease space-x-1 text-red-500 hover:bg-red-500 hover:text-white"
          >
            <i className="fas fa-ethereum text-xs cursor-pointer"></i>
            <span>4 Downvote</span>
          </button>
        </div>
        <div className="flex justify-center items-center space-x-2">
          <div className="rounded-full bg-gray-400 w-5 h-5"></div>
          <p className="text-sm">0x...1234</p>
        </div>
      </div>
    </div>
  )
}

export default Proposal
