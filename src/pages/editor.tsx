import { useState } from 'react'
import RecordingDialog from 'components/RecordingDialog'
import NftifyDialog from 'components/NftifyDialog'
import ShareDialog from 'components/ShareDialog'
import { ShareIcon } from 'components/Icons/icons'
import { useParams } from 'react-router-dom'
import { AudioListProvider } from 'hooks/useAudioList'
import PlaylistControlPanel from 'components/Playlist/ControlPanel'
import PlaylistList from 'components/Playlist/List'
import NFTifyButton from 'components/Playlist/NFTifyButton'
import { AudioDialogProvider } from 'components/RecordingDialog/hooks/useAudioDialog'
import { useGetNftMetadata } from 'repositories/rpc.repository'
import GenericButton from 'components/Button/GenericButton'

const PageEditor = () => {
  const { nftKey } = useParams()

  const { data: nft } = useGetNftMetadata(nftKey as string)

  const [isShareDialogShow, setIsShareDialogShow] = useState(false)

  return (
    <AudioListProvider>
      <div className="px-2 pb-[130px]">
        <PlaylistControlPanel
          chainId={nft?.token.chain as string}
          tokenId={nft?.token.id as string}
          address={nft?.token.address as string}
          version={''}
        />
        {nftKey && (
          <div className="flex items-center justify-between py-5">
            <div className="flex gap-1 md:gap-2">
              <NFTifyButton nftKey={nftKey} />
            </div>
            <div className="ml-2 inline-block">
              <GenericButton icon={<ShareIcon />} onClick={() => setIsShareDialogShow(true)} />
            </div>
          </div>
        )}
        <PlaylistList nftKey={nftKey as string} version={''} />
      </div>
      {nftKey && (
        <AudioDialogProvider>
          <RecordingDialog />
        </AudioDialogProvider>
      )}
      <NftifyDialog tokenId={nft?.token.id as string} />
      {isShareDialogShow && nftKey && (
        <ShareDialog
          chainId={nft?.token.chain as string}
          tokenId={nft?.token.id as string}
          tokenAddress={nft?.token.address as string}
          version={''}
          onHandleCloseClicked={() => setIsShareDialogShow(false)}
        />
      )}
    </AudioListProvider>
  )
}

export default PageEditor
