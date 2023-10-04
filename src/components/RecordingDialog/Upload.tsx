
import { useContext, useEffect, useState } from 'react'
import { useAccount, useSignMessage } from 'wagmi'
// import { add_beat } from '_aqua/music'
import { LoadingSpinner, PlayIcon, StopIcon } from 'components/Icons/icons'
import { AlertMessageContext } from 'hooks/use-alert-message'
import { useApi } from 'hooks/use-api'
import { useWeb3Auth } from 'hooks/use-web3auth'
import { useIpfs } from 'hooks/use-ipfs'

interface UploadProp {
  audioData: any
  dataKey: String
  chainId: String
  address: String
  tokenId: String
  version: String
  onHandlePlayClicked: () => void
  onHandleStopClicked: () => void
  onHandleRecordClicked: () => any
  onHandleConfirmClicked: () => void
  onHandleMuteClicked: (muted: boolean) => void
  isRecordedPlaying: boolean
  isAllBeatsMuted: boolean
}

const Upload = (prop: UploadProp) => {
  const [audioUrl, setAudioUrl] = useState<string>('')

  const { ipfs } = useIpfs()
  const { rpc } = useApi()
  const { publish } = rpc

  const { address } = useAccount()
  const { signMessage: signMessageWeb3Auth, isConnected, getAccounts } = useWeb3Auth()

  const { signMessageAsync } = useSignMessage({
    onSuccess(signature) {
      add_new_beat({ signature, chainId: prop.chainId as string, address: address as `0x${string}` })
    },
  })

  const { showError, showSuccess } = useContext(AlertMessageContext)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const add_to_nft = async () => {
    if (!prop.audioData.blob) return

    if (!address && !isConnected()) {
      showError('Connect your wallet to add beat to NFT')
      return
    }

    setIsLoading(true)

    try {
      const resp = await ipfs.storeBlob(prop.audioData.blob)
      const url = `${import.meta.env.VITE_IPFS_BEAT_STORAGE_URL}/${resp}`
      setAudioUrl(url)
    } catch (e: unknown) {
      const error = e as Error
      showError(`${error.message}`)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const signMessage = async () => {
      try {
        await signMessageAsync({ message: audioUrl })
      } catch (e: unknown) {
        const error = e as Error
        showError(`${error.message}`)
        setIsLoading(false)
        setAudioUrl('')
      }
    }

    async function signWeb3AuthMessage() {
      try {
        const results = await signMessageWeb3Auth(audioUrl)
        if (!results) throw Error('unable to sign')

        const { signature } = results
        const address = await getAccounts()

        await add_new_beat({
          signature,
          chainId: import.meta.env.VITE_DEFAULT_CHAIN_ID as string,
          address: address as `0x${string}`,
        })
      } catch (e: unknown) {
        const error = e as Error
        showError(`${error.message}`)
        setIsLoading(false)
        setAudioUrl('')
      }
    }

    if (audioUrl && address) {
      signMessage()
    } else if (audioUrl && isConnected()) {
      signWeb3AuthMessage()
    }
  }, [audioUrl, showError, signMessageAsync])

  const add_new_beat = async ({
    chainId,
    address,
    signature,
  }: {
    chainId: string
    address: `0x${string}`
    signature: string
  }) => {
    try {
      await publish({
        alias: '',
        chain_id: chainId,
        data: audioUrl,
        mcdata: '',
        meta_contract_id: import.meta.env.VITE_META_CONTRACT_ID as string,
        method: 'metadata',
        public_key: address,
        signature,
        token_address: prop.address.toString(),
        token_id: prop.tokenId.toString(),
        version: prop.version as string,
      })
    } catch (e: unknown) {
      console.log(e)
    }

    prop.onHandleConfirmClicked()
    showSuccess(`Congratulations, you've succeeded in making that terrible sound even more unbearable.`)
    setIsLoading(false)
    setAudioUrl('')
  }

  return (
    <div className="mt-4 flex flex-col  gap-4 text-center text-sm text-white md:text-lg">
      <div className="flex justify-between">
        <div className='flex items-center gap-x-2'>
          <div>
            {prop.isRecordedPlaying ? (
              <button
                className="rounded-md bg-indigo-600 py-2.5 px-2 md:px-5 md:hover:scale-105"
                onClick={prop.onHandleStopClicked}
              >
                <StopIcon />
              </button>
            ) : (
              <button
                className="rounded-md bg-indigo-600 py-2.5 px-2 md:px-5 md:hover:scale-105"
                onClick={prop.onHandlePlayClicked}
              >
                <PlayIcon />
              </button>
            )}
          </div>

          <div>
            <button
              className="rounded-md bg-[#577192] py-3 px-2 md:px-4 text-sm md:hover:scale-105"
              onClick={() => prop.onHandleMuteClicked(!prop.isAllBeatsMuted)}
            >
              <span className='flex items-center gap-x-2'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.531V19.94a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.506-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.395C2.806 8.757 3.63 8.25 4.51 8.25H6.75z" />
                </svg>
                <span className="hidden md:block">
                  {prop.isAllBeatsMuted ? 'Unmute Beats' : 'Mute Beats'}
                </span>
              </span>
            </button>
          </div>
        </div>
  
        <button
          className="from-20% rounded-md bg-gradient-to-t from-[#7224A7] to-[#FF3065] py-2 px-2 md:px-5 md:hover:scale-105 text-sm"
          onClick={prop.onHandleRecordClicked}
        >
          Record again
        </button>
      </div>

      <button
          className=" rounded-md bg-[#FF9E2D] py-8 px-2 md:px-5 md:hover:scale-105 my-3 text-sm"
          disabled={isLoading}
          onClick={() => add_to_nft()}
        >
          {isLoading ? <LoadingSpinner /> : 'Add Beat to NFT'}
      </button>

      {/* <div className="grid gap-2 text-sm">
        <button
          className=" rounded-md bg-[#FF9E2D] py-6 px-2 md:px-5 md:hover:scale-105"
          disabled={isLoading}
          onClick={() => add_to_nft()}
        >
          {isLoading ? <LoadingSpinner /> : 'Add Beat to NFT'}
        </button>
        <button
          className="rounded-md bg-[#577192] py-6 px-2 md:px-5 md:hover:scale-105"
          onClick={() => prop.onHandleMuteClicked(!prop.isAllBeatsMuted)}
        >
          {prop.isAllBeatsMuted ? 'Unmute Beats' : 'Mute Beats'}
        </button>
      </div> */}
    </div>
  )
}

export default Upload

