import { Transition } from '@headlessui/react'
import { PlayIcon, StopIcon } from 'components/Icons/icons'
import ImageContainer from 'components/ImageContainer'
import { useEffect } from 'react'
import { useBoundStore } from 'store'
import { usePlayer } from './hooks/usePlayer'
import { BoostIcon, ClosePlayerIcon } from 'components/Icons/system'

const Player = () => {
  const { modal, setModalState } = useBoundStore()
  const { playBeats, stopBeats, isPlaying } = usePlayer()

  const handlePlay = async () => {
    if (modal.player.nft) {
      await playBeats(modal.player.nft.metadata.beats)
    }
  }

  const hideModal = () => {
    setModalState({ player: { isOpen: false, nft: undefined, tokenId: '' } })
  }

  useEffect(() => {
    if (isPlaying) {
      stopBeats()
    }
  }, [modal.player.nft?.metadata.name, stopBeats])

  useEffect(() => {
    return () => {
      stopBeats()
    }
  }, [])

  return (
    <Transition
      show={modal.player.isOpen}
      enter="transition ease duration-500 transform"
      enterFrom="opacity-80 translate-y-4"
      enterTo="opacity-100 translate-y-0"
      leave="transition ease duration-300 transform"
      leaveFrom="opacity-100 translate-y-0"
      leaveTo="opacity-80 translate-y-4"
    >
      <div className={`max-w-md mx-auto absolute w-full bottom-0 h-11`}>
        <div className="">
          <div className="w-full fixed max-w-md text-center transform overflow-hidden bg-slate-800 align-middle shadow-xl transition-all">
            <div className="border border-yellow-800/80 w-full"></div>
            <div className={`flex justify-between items-center p-2 backdrop-blur shadow-2xl h-full`}>
              <div className="flex gap-4 items-center">
                <button onClick={hideModal}>
                  <ClosePlayerIcon />
                </button>
                <ImageContainer
                  src={modal.player.nft?.metadata.image as string}
                  className="h-10 w-10 bg-white rounded-md"
                />
                <div className="text-md font-semibold">{modal.player.nft?.metadata.name}</div>
              </div>
              <div className="flex gap-5">
                <button
                  className="text-md flex items-center gap-3 font-xs text-orange-500"
                  onClick={() => setModalState({ buyVote: { isOpen: true, tokenId: modal.player.tokenId } })}
                >
                  <BoostIcon />
                </button>
                {!isPlaying && (
                  <div className="text-green-300 cursor-pointer hover:text-green-500" onClick={handlePlay}>
                    <PlayIcon />
                  </div>
                )}
                {isPlaying && (
                  <div className="text-red-500 hover:text-red-300 cursor-pointer" onClick={stopBeats}>
                    <StopIcon />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  )
}

export default Player
