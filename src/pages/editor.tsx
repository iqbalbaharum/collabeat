import Waveform from 'components/Waveform'
import { AudioState, Metadata, PlayerState, SelectedAudio } from 'lib'
import { useContext, useEffect, useState } from 'react'
import RecordingDialog from 'components/RecordingDialog'
import ForkDialog from 'components/ForkDialog'
import ShareDialog from 'components/ShareDialog'
import { DownloadIcon, JSONIcon, LoadingSpinner, ShareIcon } from 'components/Icons/icons'
import LoadingIndicator from 'components/LoadingIndicator'
import { useAccount } from 'wagmi'
import { AlertMessageContext } from 'hooks/use-alert-message'
import { createMixedAudio, formatDataKey } from 'utils'
import audioBuffertoWav from 'audiobuffer-to-wav'
import { useParams, useNavigate } from 'react-router-dom'
import exportImg from 'assets/icons/export.png'
import { useApi } from 'hooks/use-api'
import { useBoundStore } from 'store'

const PageEditor = () => {
  const navigate = useNavigate()
  const { chainId, tokenAddress, version, tokenId } = useParams()
  const { address } = useAccount()
  const { rpc } = useApi()
  const { nft, setNFTState } = useBoundStore()
  const isOwner = Boolean(address) && nft?.owner?.toLowerCase() === address?.toLowerCase()

  const { showError } = useContext(AlertMessageContext)

  const [displayDownloadButton, setDisplayDownloadButton] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  const [nftKey, setNftKey] = useState('')
  const [data, setData] = useState<Metadata[]>()
  const [isLoad, setIsLoad] = useState(false)
  const [filteredData, setFilteredData] = useState<Array<AudioState>>([])
  const [forkData, setForkData] = useState<Array<SelectedAudio>>([])
  const [isForking, setIsForking] = useState(false)

  const [isDialogRecordingOpened, setIsDialogRecordingOpened] = useState(false)
  const [isDialogForkOpened, setIsDialogForkOpened] = useState(false)
  const [isShareDialogShow, setIsShareDialogShow] = useState(false)
  const [canRecord, setCanRecord] = useState(false)

  // simple way to keep track whether all beats finished playing; once finished, set button to play
  const [finishedCounter, setFinishedCounter] = useState(-1)
  useEffect(() => {
    if (finishedCounter === 0) setAllState(PlayerState.STOP)
  }, [finishedCounter])

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
    const load = async () => {
      try {
        const response = await rpc.getMetadataUseKeyByBlock(
          nftKey as String,
          import.meta.env.VITE_META_CONTRACT_ID as String,
          version as String
        )
        const metadatas = response.data.result.metadatas as Metadata[]
        const filteredData: AudioState[] = []
        for (const meta of metadatas) {
          if (meta.version === version) {
            const res = await rpc.getContentFromIpfs(meta.cid)
            const data = JSON.parse(res.data.result.content as string)
            filteredData.push({
              key: meta.public_key,
              data: data.content,
              isMuted: false,
              playerState: PlayerState.STOP,
            } as AudioState)
          }
        }

        setFilteredData(filteredData)
        setIsLoad(true)

        if (filteredData.length > 10) {
          setCanRecord(false)
        } else {
          setCanRecord(true)
        }
      } catch (e) {
        console.log(e)
      }
    }

    if (!nft?.owner) navigate('/inventory')

    if (data == null && nftKey && !isLoad) {
      load()
    }
  }, [nftKey, data, isLoad, rpc, version])

  /*  
   const { data: isMinted } = useCheckBookmarkedSheets(address ?? '0x', tokenId as string)
   setDisplayDownloadButton(Boolean(isMinted)) 
  */

  const setAllState = (state: PlayerState) => {
    setFilteredData(prev =>
      prev.map(audio => {
        return { ...audio, playerState: state }
      })
    )

    if (state === PlayerState.PLAY) setFinishedCounter(filteredData.length)
    if (state === PlayerState.STOP) setFinishedCounter(-1)
  }

  const setAllMuted = (muted: boolean) => {
    setFilteredData(prev =>
      prev.map(audio => {
        return { ...audio, isMuted: muted }
      })
    )
  }

  const resetAllSelection = () => {
    setFilteredData(prev =>
      prev.map(audio => {
        return { ...audio, selected: false, isMuted: false }
      })
    )
  }

  const onToggleSound = (state: AudioState) => {
    const index = filteredData.findIndex(item => item.key === state.key)
    const updatedData = [...filteredData]

    updatedData[index] = {
      ...updatedData[index],
      isMuted: !state.isMuted,
    }

    setFilteredData(updatedData)
  }

  const onToggleSelection = (state: AudioState) => {
    const index = filteredData.findIndex(item => item.key === state.key)
    const updatedData = [...filteredData]

    updatedData[index] = {
      ...updatedData[index],
      selected: !state.selected,
      isMuted: state.selected as boolean,
    }

    setFilteredData(updatedData)
  }

  const onHandleCheckMetadata = () => {
    window.open(`${import.meta.env.VITE_LINEAGE_METADATA_URL}/${nftKey}`, '_blank')
  }

  const onHandleDialogClosed = () => {
    setTimeout(() => {
      setData(undefined)
      setFilteredData([])
      setIsLoad(false)
      setIsDialogRecordingOpened(!isDialogRecordingOpened)
    }, 2000)
  }

  const toggleForkingMode = () => {
    if (!address) {
      showError('Connect your wallet to fork this beat')
      return
    }

    setIsForking(!isForking)

    if (isForking) {
      resetAllSelection()
    } else {
      setAllMuted(true)
    }
  }

  const fork = () => {
    const selections: SelectedAudio[] = []

    filteredData.forEach(audio => {
      if (audio.selected) {
        selections.push({
          owner: audio.key,
          data_key: nftKey,
          cid: audio.data,
        } as SelectedAudio)
      }
    })

    setForkData(selections)
  }

  const [audioContext] = useState(new AudioContext())

  async function downloadBeat() {
    setIsDownloading(true)

    const mixed = await createMixedAudio(audioContext, nftKey)
    const blob = new Blob([audioBuffertoWav(mixed)], { type: 'audio/wav' })

    const url = window.URL.createObjectURL(blob)

    const id = 'download-beats-link'
    const fileName = `Collabeat #${tokenId}`
    let linkEl = document.getElementById(id) as HTMLAnchorElement

    if (linkEl) {
      linkEl.href = url
      linkEl.setAttribute('download', fileName)
    } else {
      linkEl = document.createElement('a')
      linkEl.id = id
      linkEl.href = url
      linkEl.setAttribute('download', fileName)
      document.body.appendChild(linkEl)
    }

    linkEl.click()
    setIsDownloading(false)
  }

  return (
    <>
      <div className="px-2 pb-[130px]">
        <div className="fixed bottom-0 left-0 mb-5 flex w-full items-center justify-center">
          <div className="flex items-center justify-between rounded-xl bg-gray-700 p-2">
            {finishedCounter <= 0 ? (
              <button
                className="mr-2 rounded-xl px-8 py-3 text-black  hover:bg-[#1C1C1C]"
                onClick={() => setAllState(PlayerState.PLAY)}
              >
                <svg fill="#00FF00" height="32px" width="32px" version="1.1" viewBox="0 0 32 32">
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                  <g id="SVGRepo_iconCarrier">
                    <path d="M21.6,15.2l-9-7c-0.3-0.2-0.7-0.3-1.1-0.1C11.2,8.3,11,8.6,11,9v14c0,0.4,0.2,0.7,0.6,0.9C11.7,24,11.9,24,12,24 c0.2,0,0.4-0.1,0.6-0.2l9-7c0.2-0.2,0.4-0.5,0.4-0.8S21.9,15.4,21.6,15.2z"></path>{' '}
                  </g>
                </svg>
              </button>
            ) : (
              <button
                className="mr-2 rounded-xl px-8 py-3 text-black hover:bg-[#1C1C1C]"
                onClick={() => setAllState(PlayerState.STOP)}
              >
                <svg fill="#00FF00" height="32px" width="32px" version="1.1" viewBox="0 0 32 32">
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                  <g id="SVGRepo_iconCarrier">
                    <path d="M23,8H9C8.4,8,8,8.4,8,9v14c0,0.6,0.4,1,1,1h14c0.6,0,1-0.4,1-1V9C24,8.4,23.6,8,23,8z"></path>
                  </g>
                </svg>
              </button>
            )}

            {!isForking && canRecord && (
              <button
                className="from-20% mr-2 inline-block min-w-[8rem] rounded-xl bg-gradient-to-t from-[#7224A7] to-[#FF3065] px-8 py-3  font-bold text-white md:hover:scale-105"
                onClick={() => setIsDialogRecordingOpened(!isDialogRecordingOpened)}
              >
                Record
              </button>
            )}

            {isForking && (
              <button
                className="from-20% mr-2 min-w-[8rem] rounded-xl bg-gradient-to-t from-[#F5517B] to-[#FEDC00] px-8 py-3 font-bold text-white md:hover:scale-105"
                onClick={() => {
                  fork()
                  setIsDialogForkOpened(true)
                }}
              >
                Export
              </button>
            )}
          </div>
        </div>
        {nftKey && tokenId && (
          <div className="flex items-center justify-between py-5">
            <div className="flex gap-1 md:gap-2">
              {/* {tokenId && <MintButton tokenId={tokenId} />} */}

              {isOwner && (
                <>
                  {isForking ? (
                    <button
                      className={`flex h-20 w-20 flex-col items-center justify-center rounded-sm bg-red-500 p-2 text-xs font-bold text-white md:hover:scale-105`}
                      onClick={() => toggleForkingMode()}
                    >
                      <span> Cancel</span>
                    </button>
                  ) : (
                    <button
                      className={`from-20% flex h-20 w-20 flex-col items-center justify-center rounded-sm bg-gradient-to-t from-[#F5517B] to-[#FEDC00] p-2 text-xs font-bold text-white md:hover:scale-105`}
                      onClick={() => toggleForkingMode()}
                    >
                      <img className="mb-1" src={exportImg} height={20} width={20} alt="fork" />
                      <span>Export</span>
                    </button>
                  )}
                </>
              )}

              {displayDownloadButton && (
                <button
                  className={`from-20% flex h-20 w-20 flex-col items-center justify-center rounded-sm bg-gradient-to-t from-[#F7507B] to-[#7523A7] p-2 text-xs font-bold text-white md:hover:scale-105`}
                  disabled={isDownloading}
                  onClick={() => downloadBeat()}
                >
                  {isDownloading ? (
                    <LoadingSpinner />
                  ) : (
                    <>
                      <DownloadIcon />
                      <span>Download</span>
                      <span>Beat</span>
                    </>
                  )}
                </button>
              )}
            </div>
            <div className="ml-2 inline-block">
              <button className="mr-2 bg-green-100 p-3" onClick={onHandleCheckMetadata}>
                <JSONIcon />
              </button>
              <button className="bg-green-300 p-3 text-black" onClick={() => setIsShareDialogShow(true)}>
                <ShareIcon />
              </button>
            </div>
          </div>
        )}
        <div className="w-full">
          {filteredData.length > 0 || isLoad ? (
            filteredData.map((audioState, key) => {
              if (audioState.data) {
                return (
                  <div key={key} className="border-1 m-1 h-[90px] rounded-lg bg-[#181818] px-8 py-2 text-left">
                    <div className="mb-2 whitespace-nowrap text-gray-400 text-sm text-black">
                      {audioState.key.toString()}
                    </div>
                    <div className="h-1/2 w-full">
                      <Waveform
                        url={audioState.data as string}
                        playerState={audioState.playerState}
                        isMuted={audioState.isMuted}
                        onToggleSound={() => onToggleSound(audioState)}
                        isSelecting={isForking}
                        isSelected={audioState.selected}
                        onSelectButtonClicked={() => onToggleSelection(audioState)}
                        onFinish={() => setFinishedCounter(prev => prev - 1)}
                      />
                    </div>
                  </div>
                )
              }
            })
          ) : (
            <LoadingIndicator text={'Fetching data...'} />
          )}
        </div>
      </div>
      {isDialogRecordingOpened && nftKey && tokenId && (
        <RecordingDialog
          dataKey={nftKey}
          chainId={chainId as String}
          address={tokenAddress as String}
          tokenId={tokenId}
          version={version as String}
          isOpened={isDialogRecordingOpened}
          onDialogClosed={() => onHandleDialogClosed()}
          setAllMuted={muted => setAllMuted(muted)}
          setAllState={state => setAllState(state)}
        />
      )}
      {isDialogForkOpened && nftKey && tokenId && (
        <ForkDialog
          tokenId={tokenId}
          dataKey={nftKey}
          isOpened={isDialogForkOpened}
          selectedAudios={forkData}
          onDialogClosed={() => setIsDialogForkOpened(false)}
        />
      )}
      {isShareDialogShow && nftKey && (
        <ShareDialog
          chainId={chainId as String}
          tokenAddress={tokenAddress as String}
          tokenId={tokenId as String}
          version={version as String}
          onHandleCloseClicked={() => setIsShareDialogShow(false)}
        />
      )}
    </>
  )
}

export default PageEditor
