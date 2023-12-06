import { useAudioList } from 'hooks/useAudioList'
import { PlayerState } from 'lib'
import { useBoundStore } from 'store'

interface Prop {
  chainId: string
  address: string
  tokenId: string
  version: string
}

const PlaylistControlPanel = (prop: Prop) => {
  const { finishedCounter, setAllState, canRecord } = useAudioList()
  const { setModalState } = useBoundStore()

  const onHandleRecordClicked = () => {
    setModalState({
      audioRecording: {
        isOpen: true,
        chainId: prop.chainId,
        address: prop.address,
        tokenId: prop.tokenId,
        version: prop.version,
      },
    })
  }

  return (
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

        {true && (
          <button
            className="from-20% mr-2 inline-block min-w-[8rem] rounded-xl bg-gradient-to-t from-[#7224A7] to-[#FF3065] px-8 py-3  font-bold text-white md:hover:scale-105"
            onClick={onHandleRecordClicked}
          >
            Record
          </button>
        )}
      </div>
    </div>
  )
}

export default PlaylistControlPanel
