import { Transition } from '@headlessui/react'
import { PlayIcon, StopIcon } from 'components/Icons/icons'
import ImageContainer from 'components/ImageContainer'
import { useEffect } from 'react'
import { useBoundStore } from 'store'
import { usePlayer } from './hooks/usePlayer'

const Player = () => {
  const { modal } = useBoundStore()
  const { playBeats, stopBeats, isPlaying } = usePlayer()

  const handlePlay = async () => {
    if (modal.player.nft) {
      await playBeats(modal.player.nft.metadata.beats)
    }
  }

  useEffect(() => {
    if (isPlaying) {
      stopBeats()
    }
  }, [modal.player.nft.metadata.name, stopBeats])

  useEffect(() => {
    return () => {
      stopBeats()
    }
  }, [])

  return (
    <Transition
      show={modal.player.isOpen}
      enter="transition ease-out duration-300 transform"
      enterFrom="opacity-0 translate-y-full"
      enterTo="opacity-100 translate-y-0"
      leave="transition ease-in duration-200 transform"
      leaveFrom="opacity-100 translate-y-0"
      leaveTo="opacity-0 translate-y-full"
    >
      <div className={`max-w-md mx-auto absolute w-full h-14`}>
        <div className="min-h-full">
          <div className="w-full fixed max-w-md bottom-0 text-center transform overflow-hidden bg-blue-900 align-middle shadow-xl transition-all">
            <div className="border border-yellow-500 w-full"></div>
            <div className={`flex justify-between items-center p-2 backdrop-blur shadow-2xl h-full`}>
              <div className="flex gap-4 items-center">
                <ImageContainer
                  src={modal.player.nft?.metadata.image as string}
                  className="h-10 w-10 bg-white rounded-md"
                />
                <div className="text-md font-semibold">{modal.player.nft?.metadata.name}</div>
              </div>
              <div className="flex gap-2">
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
