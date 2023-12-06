import { useState } from 'react'
import { usePublishTransaction } from 'repositories/rpc.repository'
import { useAudioDialog } from './useAudioDialog'
import { useWeb3Auth } from 'hooks/use-web3auth'
import { useAlertMessage } from 'hooks/use-alert-message'
import { useIpfs } from 'hooks/use-ipfs'

interface Prop {
  tokenId: string
  tokenAddress: string
  chainId: string
}

const useCollab = (prop: Prop) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  const { ipfs } = useIpfs()
  const { isConnected, signMessage, address } = useWeb3Auth()
  const { audioData } = useAudioDialog()
  const { mutateAsync: publishTx } = usePublishTransaction()
  const { showError, showSuccess } = useAlertMessage()

  const publish = async (version: string) => {
    if (!audioData.blob) return

    if (!isConnected()) {
      showError('Connect your wallet to add beat to NFT')
      return
    }

    setIsLoading(true)
    setIsSuccess(false)

    try {
      const resp = await ipfs.storeBlob(audioData.blob)
      const url = `ipfs://${resp}`
      const signed = await signMessage(JSON.stringify(url))
      await publishTx({
        alias: '',
        chain_id: prop.chainId,
        data: url,
        mcdata: '',
        meta_contract_id: import.meta.env.VITE_META_CONTRACT_ID as string,
        method: 'metadata',
        public_key: address,
        signature: signed?.signature as string,
        token_address: prop.tokenAddress,
        token_id: prop.tokenId,
        version: version,
      })
      setIsSuccess(true)
      showSuccess(`Congratulations, you've succeeded in making that terrible sound even more unbearable.`)
    } catch (e: any) {
      showError(`${error}`)
      setError(error)
      setIsSuccess(false)
    } finally {
      setIsLoading(false)
    }
  }

  return { isLoading, isSuccess, publish, error }
}

export default useCollab
