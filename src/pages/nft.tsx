import ChainName from 'components/ChainName'
import ShareDialog from 'components/ShareDialog'
import { PlayerState, Sheet } from 'lib'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { createMixedAudio, formatDataKey } from 'utils'
import AddMusicIcon from 'assets/icons/addmusic.svg'
import VersionModal from 'components/Modal/VersionModal'
import { useApi } from 'hooks/use-api'
import VersionCard from 'components/VersionCard'
import { useGetMetadataBlock } from 'repositories/rpc.repository'

const PageNft = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { rpc } = useApi()

  const { nft } = location.state || {}
  const [nftKey, setNftKey] = useState('')
  // versions
  const [data, setData] = useState<String[]>([])
  const [isDataLoaded, setIsDataLoaded] = useState(false)

  const { data: metadata } = useGetMetadataBlock(nftKey)

  useEffect(() => {
    if (metadata && metadata.length > 0) {
      const uniqueVersions: String[] = []
      metadata.map(item => {
        if (!uniqueVersions.includes(item.version)) {
          uniqueVersions.push(item.version)
        }
      })

      setIsDataLoaded(true)
      setData(uniqueVersions)
    }

    if (!nft) {
      navigate('/create-beat')
    }

    if (nft && !isDataLoaded && !nftKey) {
      // loadVersion()
    }
  }, [metadata, nft, navigate, isDataLoaded, nftKey, rpc])

  const [shareDialogState, setShareDialogState] = useState({
    chainId: '',
    tokenAddress: '',
    tokenId: '',
    version: '',
    opened: false,
  })

  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  // init
  useEffect(() => {
    const init = () => {
      const key = formatDataKey(nft.chain_id, nft.token_address, nft.token_id)
      setNftKey(key)
    }

    if (nft && !nftKey) init()
  }, [nft, nftKey])

  const [audioContext, setAudioContext] = useState(new AudioContext())
  const [audioPlayerState, setAudioPlayerState] = useState<{ [key: string]: PlayerState }>({})
  const [mixedAudio, setMixedAudio] = useState<{ [key: string]: AudioBuffer } | null>({})

  const updatePlayerState = (dataKey: string, state: PlayerState) => {
    setAudioPlayerState(prev => ({
      ...prev,
      [dataKey]: state,
    }))
  }

  const playerButtonHandler = async (dataKey: string) => {
    const isFirstPlay = audioPlayerState[dataKey] === undefined

    if (isFirstPlay) {
      updatePlayerState(dataKey, PlayerState.LOADING)

      const mixed = await createMixedAudio(audioContext, dataKey)

      updatePlayerState(dataKey, PlayerState.PLAY)

      setMixedAudio(prev => ({
        ...prev,
        [dataKey]: mixed,
      }))
      return
    }

    switch (audioPlayerState[dataKey]) {
      case PlayerState.STOP:
        updatePlayerState(dataKey, PlayerState.PLAY)
        break
      case PlayerState.PLAY:
        updatePlayerState(dataKey, PlayerState.PAUSED)
        break
      case PlayerState.PAUSED:
        updatePlayerState(dataKey, PlayerState.PLAY)
        break
      default:
        break
    }
  }

  return (
    <>
      {nft && (
        <div className="flex justify-center">
          <div className="block w-[90%] md:4/5 lg:w-3/4">
            <div className="bg-[#181818] rounded p-4">
              <div className="flex flex-wrap">
                <div className="flex-auto md:w-1/4">
                  <img src={nft.metadata.image} className="rounded-lg bg-white w-full h-full" />
                </div>
                <div className="flex-auto w-3/4 md:px-5 py-6 md:py-0">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold">{nft.metadata.name}</span>
                  </div>
                  <div>
                    <div className="flex text-gray-400 text-sm my-2">
                      <div className="">
                        <span className="truncate block min-w-64 w-72 md:inline">Address: {nft.token_address}</span>
                        <span className="mx-3">&#8226;</span> #{nft.token_id} <span className="mx-3">&#8226;</span>{' '}
                        <ChainName chainId="56" />
                      </div>
                    </div>

                    <p className="">{nft.metadata.description}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 bg-[#181818] rounded p-4">
              <div className="text-2xl font-semibold mb-4">Released Audios</div>
              <div className="font-xs text-gray-400">You have have not release any audios yet</div>
            </div>

            <div className="mt-5 bg-[#181818] rounded p-4">
              <div className="text-2xl font-semibold mb-4">Unreleased Audios</div>
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-4">
                <button
                  className="bg-red-900 rounded-lg px-4 py-2 text-white w-full flex items-center justify-center cursor-pointer hover:border hover:border-white"
                  onClick={() => openModal()}
                >
                  <div className="block">
                    <img src={AddMusicIcon} className="mx-auto" />
                    <div className="text-sm mt-1">New Audio</div>
                  </div>
                </button>
                {data.map((d, index) => (
                  <VersionCard
                    key={index}
                    nftKey={nftKey}
                    chainId={nft.chain_id}
                    tokenAddress={nft.token_address}
                    tokenId={nft.token_id}
                    version={d}
                    onHandleShareClicked={() =>
                      setShareDialogState({
                        chainId: nft.chain_id,
                        tokenAddress: nft.token_address,
                        tokenId: nft.token_id,
                        version: d.toString(),
                        opened: true,
                      })
                    }
                  />
                ))}
              </div>
            </div>

            {shareDialogState.opened && (
              <ShareDialog
                chainId={shareDialogState.chainId}
                tokenAddress={shareDialogState.tokenAddress}
                tokenId={shareDialogState.tokenId}
                version={shareDialogState.version}
                onHandleCloseClicked={() =>
                  setShareDialogState({
                    chainId: '',
                    tokenAddress: '',
                    tokenId: '',
                    version: '',
                    opened: false,
                  })
                }
              />
            )}
          </div>
        </div>
      )}
      <VersionModal
        chainId={nft.chain_id}
        tokenAddress={nft.token_address}
        tokenId={nft.token_id}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </>
  )
}

export default PageNft
