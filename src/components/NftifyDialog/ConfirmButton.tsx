import { LoadingSpinner } from 'components/Icons/icons'
import { AlertMessageContext } from 'hooks/use-alert-message'
import { useContext, useState } from 'react'
import { useBoundStore } from 'store'
import { parseEther } from 'viem'
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'

interface Props {
  cid: string
  onForkSuccess: () => void
}

const ConfirmButton = ({ cid, onForkSuccess }: Props) => {
  const { showError } = useContext(AlertMessageContext)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { nft } = useBoundStore()
  const { data_key, metadata, version } = nft

  const { config } = usePrepareContractWrite({
    address: String(import.meta.env.VITE_COLLABEAT) as `0x${string}`,
    abi: [
      {
        inputs: [
          {
            internalType: 'string',
            name: 'data_key',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'version',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'nft_name',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'ipfs_address',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'cid',
            type: 'string',
          },
        ],
        name: 'mintRequest',
        outputs: [],
        stateMutability: 'payable',
        type: 'function',
      },
    ],
    functionName: 'mintRequest',
    args: [data_key, version, metadata?.name, import.meta.env.VITE_IPFS_FORK_MULTIADDRESS ?? '', cid],
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
      className="mr-2 bg-green-500 px-5 py-3 text-white"
      disabled={isLoading}
      onClick={() => onHandleConfirmClicked()}
    >
      {isLoading ? <LoadingSpinner /> : 'Confirm'}
    </button>
  )
}

export default ConfirmButton
