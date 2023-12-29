import { Transition } from '@headlessui/react'
import { PlayIcon } from 'components/Icons/icons'
import { useBoundStore } from 'store'

const Player = () => {
  const { modal } = useBoundStore()

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
                <img src={modal.player.nft?.metadata.image} className="h-10 w-10 bg-white rounded-md" />
                <div className="text-md font-semibold">{modal.player.nft?.metadata.name}</div>
              </div>
              <div className="mr-3">
                <PlayIcon />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  )
}

export default Player
