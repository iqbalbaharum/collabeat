import { useAccount, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import { BigNumber } from '@ethersproject/bignumber'
import { AlertMessageContext } from 'hooks/use-alert-message'
import { useContext, useState } from 'react'
import { LoadingSpinner } from 'components/Icons/icons'
import { parseEther } from 'viem'

interface MintProp {
  tokenId: String
}

const MintButton = (prop: MintProp) => {
  const { address } = useAccount()
  const { showError, showSuccess } = useContext(AlertMessageContext)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { config } = usePrepareContractWrite({
    address: String(import.meta.env.VITE_COLLABEAT) as `0x${string}`,
    abi: [
      {
        inputs: [
          { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
          { internalType: 'uint32', name: 'amount', type: 'uint32' },
        ],
        name: 'mint',
        outputs: [],
        stateMutability: 'payable',
        type: 'function',
      },
    ],
    functionName: 'mint',
    args: [BigNumber.from(prop.tokenId)._hex, 1],
    value: parseEther('0.015'),
    onError(error) {
      console.log('Error', error)
    },
  })


  const { data, writeAsync } = useContractWrite(config)

  const handleBookmark = async () => {
    if (!address) {
      showError('Connect your wallet to bookmark this beat')
      return
    }
    setIsLoading(true)

    try {
      await writeAsync?.()
    } catch (e: unknown) {
      const error = e as Error
      showError(`${error.message}`)
      setIsLoading(false)
    }
  }

  const { isSuccess } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess: () => {
      showSuccess('Your NFT is a true masterpiece...said no one ever.')
      setIsLoading(false)
    },
  })

  return (
    <button
      className={`from-20% flex h-20 w-20 flex-col items-center justify-center rounded-sm bg-gradient-to-t from-[#A726F8] to-[#FFDD00] p-2 text-xs font-bold text-white md:hover:scale-105`}
      disabled={isLoading}
      onClick={() => handleBookmark()}
    >
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <img className="mb-1 " src="/assets/plus-icon.png" height={20} width={20} alt="plus icon" />
          <span>Bookmark</span>
          <span>Beat</span>
        </>
      )}
    </button>
  )
}

export default MintButton
