import { useState } from 'react'
import RecordingDialog from 'components/RecordingDialog'
import NftifyDialog from 'components/NftifyDialog'
import ShareDialog from 'components/ShareDialog'
import { useParams } from 'react-router-dom'
import { AudioListProvider } from 'hooks/useAudioList'
import PlaylistControlPanel from 'components/Playlist/ControlPanel'
import PlaylistList from 'components/Playlist/List'
import NFTifyButton from 'components/Playlist/NFTifyButton'
import { AudioDialogProvider } from 'components/RecordingDialog/hooks/useAudioDialog'
import { useGetNftMetadata, useGetNftToken } from 'repositories/rpc.repository'
import { useWeb3Auth } from 'hooks/use-web3auth'

const PageEditor = () => {
  const { nftKey } = useParams()
  const { address } = useWeb3Auth()

  const { data: token } = useGetNftToken(nftKey as string)
  const { data: nft } = useGetNftMetadata(nftKey as string)
  const [isShareDialogShow, setIsShareDialogShow] = useState(false)

  return (
    <>
      {token && (
        <AudioListProvider>
          <div className="px-2 pb-[130px]">
            <PlaylistControlPanel chainId={token?.chain} tokenId={token?.id} address={token?.address} version={''} />
            {nftKey && (
              <div className="flex items-center justify-between p-2">
                <div className="flex gap-1 md:gap-2">
                  {nft && address && <NFTifyButton nftKey={nftKey} nft={nft} />}
                </div>
                <div className="ml-2 inline-block">
                  {/* <GenericButton icon={<ShareIcon />} onClick={() => setIsShareDialogShow(true)} /> */}
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
          {address && <NftifyDialog tokenId={token?.id} />}
          {isShareDialogShow && nftKey && (
            <ShareDialog
              chainId={token?.chain}
              tokenId={token?.id}
              tokenAddress={token?.address}
              version={''}
              onHandleCloseClicked={() => setIsShareDialogShow(false)}
            />
          )}
        </AudioListProvider>
      )}
    </>
  )
}

export default PageEditor
