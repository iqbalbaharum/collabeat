import Waveform from 'components/Waveform'
import { AudioState, Metadata, PlayerState, SelectedAudio } from 'lib'
import { useContext, useEffect, useState } from 'react'
import RecordingDialog from 'components/RecordingDialog'
import NftifyDialog from 'components/NftifyDialog'
import ShareDialog from 'components/ShareDialog'
import { DownloadIcon, JSONIcon, LoadingSpinner, ShareIcon } from 'components/Icons/icons'
import LoadingIndicator from 'components/LoadingIndicator'
import { useAccount } from 'wagmi'
import { AlertMessageContext } from 'hooks/use-alert-message'
import { formatDataKey } from 'utils'
import { useParams, useNavigate } from 'react-router-dom'
import exportImg from 'assets/icons/export.png'
import { useBoundStore } from 'store'
import { useWeb3Auth } from 'hooks/use-web3auth'
import { AudioListProvider } from 'hooks/useAudioList'
import { useGetMetadataBlock } from 'repositories/rpc.repository'
import PlaylistControlPanel from 'components/Playlist/ControlPanel'
import PlaylistList from 'components/Playlist/List'
import NFTifyButton from 'components/Playlist/NFTifyButton'
import { AudioDialogProvider } from 'components/RecordingDialog/hooks/useAudioDialog'

const PageEditor = () => {
  const navigate = useNavigate()
  const { chainId, tokenAddress, version, tokenId } = useParams()
  const { nft, setNFTState } = useBoundStore()
  const { address } = useWeb3Auth()
  const isOwner = true

  const { showError } = useContext(AlertMessageContext)

  const [nftKey, setNftKey] = useState('')

  const [isShareDialogShow, setIsShareDialogShow] = useState(false)

  // init
  useEffect(() => {
    const init = () => {
      const key = formatDataKey(chainId as String, tokenAddress as String, tokenId as String)
      setNFTState({ data_key: key, version })
      setNftKey(key)
    }

    if (!nftKey) {
      init()
    }
  }, [chainId, nftKey, tokenAddress, tokenId])

  useEffect(() => {
    if (!nft?.owner) navigate('/inventory')
  }, [])

  // const onHandleDialogClosed = () => {
  //   setTimeout(() => {
  //     setData(undefined)
  //     setFilteredData([])
  //     setIsLoad(false)
  //     setIsDialogRecordingOpened(!isDialogRecordingOpened)
  //   }, 2000)
  // }

  return (
    <AudioListProvider>
      <div className="px-2 pb-[130px]">
        <PlaylistControlPanel />
        {nftKey && tokenId && (
          <div className="flex items-center justify-between py-5">
            <div className="flex gap-1 md:gap-2">
              <NFTifyButton nftKey={nftKey} />
            </div>
            <div className="ml-2 inline-block">
              <button className="bg-green-300 p-3 text-black" onClick={() => setIsShareDialogShow(true)}>
                <ShareIcon />
              </button>
            </div>
          </div>
        )}
        <PlaylistList nftKey={nftKey} />
      </div>
      {nftKey && tokenId && (
        <AudioDialogProvider>
          <RecordingDialog
            dataKey={nftKey}
            chainId={chainId as String}
            address={tokenAddress as String}
            tokenId={tokenId}
            version={version as String}
          />
        </AudioDialogProvider>
      )}
      <NftifyDialog tokenId={tokenId as string} dataKey={nftKey} />
      {isShareDialogShow && nftKey && (
        <ShareDialog
          chainId={chainId as String}
          tokenAddress={tokenAddress as String}
          tokenId={tokenId as String}
          version={version as String}
          onHandleCloseClicked={() => setIsShareDialogShow(false)}
        />
      )}
    </AudioListProvider>
  )
}

export default PageEditor
