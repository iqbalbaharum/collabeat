import { LoadingSpinner } from 'components/Icons/icons'
import { AlertMessageContext } from 'hooks/use-alert-message'
import { useWeb3Auth } from 'hooks/use-web3auth'
import { useContext, useEffect, useState } from 'react'
import { useBoundStore } from 'store'
import { parseEther } from 'viem'
import { useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import useMintRequest from './hooks/useMintRequest'
import AccentButton from 'components/Button/AccentButton'

const abis = [
  {
    inputs: [
      { internalType: 'string', name: 'data_key', type: 'string' },
      { internalType: 'string', name: 'version', type: 'string' },
      { internalType: 'string', name: 'nft_name', type: 'string' },
      { internalType: 'string', name: 'ipfs_address', type: 'string' },
      { internalType: 'string', name: 'cid', type: 'string' },
      { internalType: 'address', name: 'devWallet', type: 'address' },
    ],
    name: 'mintRequest',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'mintPrice',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
]
interface Props {
  cid: string
  dataKey: string
  name: string
  onNftifySuccess: () => void
}

const ConfirmButton = ({ dataKey, name, cid, onNftifySuccess }: Props) => {
  const { showSuccess, showError } = useContext(AlertMessageContext)
  const { nftify, isLoading } = useMintRequest()

  const onHandleConfirmClicked = async () => {
    try {
      await nftify(dataKey, name, cid)
      onNftifySuccess()
      showSuccess(`Successfully turn your beat(s) to NFT`)
    } catch (e: unknown) {
      const error = e as Error
      showError(`${error.message}`)
    }
  }

  return (
    <AccentButton
      name={isLoading ? '' : 'Confirm'}
      icon={isLoading ? <LoadingSpinner /> : ''}
      onClick={() => onHandleConfirmClicked()}
    />
  )
}

export default ConfirmButton
