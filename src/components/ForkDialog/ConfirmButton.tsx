import { LoadingSpinner } from 'components/Icons/icons'
import { AlertMessageContext } from 'hooks/use-alert-message'
import { useContext, useState } from 'react'
import { parseEther } from 'viem'
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'

interface Props { 
  cid:string, 
  onForkSuccess: () => void
}

const ConfirmButton = ({ cid, onForkSuccess }: Props) => {
  const { showError } = useContext(AlertMessageContext)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { config } = usePrepareContractWrite({
    address: String(import.meta.env.VITE_COLLABEAT) as `0x${string}`,
    abi: [
      {
        inputs: [
          { internalType: 'string', name: 'name', type: 'string' },
          { internalType: 'string', name: 'ipfs_address', type: 'string' },
          { internalType: 'string', name: 'cid', type: 'string' },
        ],
        name: 'fork',
        outputs: [],
        stateMutability: 'payable',
        type: 'function',
      },
    ],
    functionName: 'fork',
    args: ['', import.meta.env.VITE_IPFS_FORK_MULTIADDRESS ?? '', cid],
    value: parseEther('0.015'),
    onError(error) {
      console.log('Error', error)
    },
  })

  const { data, writeAsync } = useContractWrite(config)

  const { isSuccess } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess: () => {
      onForkSuccess()
      setIsLoading(false)
    },
  })

  const onHandleConfirmClicked = async () => {
    setIsLoading(true)

    try {
      await writeAsync?.()
    } catch (e: unknown) {
      const error = e as Error
      showError(`${error.message}`)
      setIsLoading(false)
    }
  }

  return (
    <button
      className="mr-2 bg-green-500 px-5 py-3 text-black"
      disabled={isLoading}
      onClick={() => onHandleConfirmClicked()}
    >
      {isLoading ? <LoadingSpinner /> : 'Confirm'}
    </button>
  )
}

export default ConfirmButton
