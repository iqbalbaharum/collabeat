import { Dialog, Transition } from '@headlessui/react'
import { OpenseaIcon } from 'components/Icons/socials'
import { BoostIcon, ShareUpIcon, UnboostIcon } from 'components/Icons/system'
import { Fragment } from 'react'
import { useBoundStore } from 'store'
import { RWebShare } from 'react-web-share'

const MarketplaceMore = () => {
  const { modal, setModalState } = useBoundStore()

  const onHandleClose = () => {
    setModalState({ moreInfo: { isOpen: false, tokenId: '', metadata: undefined } })
  }
  return (
    <Transition appear show={modal.moreInfo.isOpen} as={Fragment}>
      <Dialog as="div" onClose={onHandleClose}>
        <div className="max-w-md mx-auto fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center text-center">
            <Transition.Child
              as={Fragment}
              enter="transition ease-out duration-300 transform"
              enterFrom="opacity-0 translate-y-full"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-200 transform"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-full"
            >
              <Dialog.Panel className="w-full h-screen fixed max-w-md bottom-0 text-center transform overflow-hidden bg-black/80 backdrop-blur align-middle shadow-xl transition-all">
                <div className="flex h-screen flex-col justify-between items-stretch w-full pt-16 pb-40">
                  <div className="flex-1">
                    <div className="flex flex-col sm:gap-6 lg:gap-3 justify-start items-start text-gray-200 p-6">
                      <div className="flex gap-4 mb-3">
                        <img src={modal.moreInfo.metadata?.image} className="h-24 w-24 rounded-md" />
                        <div className="text-left">
                          <div className="text-white text-lg font-semibold">{modal.moreInfo.metadata?.name}</div>
                          <div className="text-xs uppercase text-gray-200">2 Collaborators</div>
                          <div className="text-xs uppercase text-gray-200">8 VOTES</div>
                        </div>
                      </div>
                      <button
                        className="text-xl flex items-center gap-3 font-semibold text-orange-500"
                        onClick={() => setModalState({ buyVote: { isOpen: true, tokenId: modal.moreInfo.tokenId } })}
                      >
                        <BoostIcon /> Boost
                      </button>
                      <button
                        className="text-xl flex items-center gap-3 font-semibold text-purple-400"
                        onClick={() => setModalState({ sellVote: { isOpen: true, tokenId: modal.moreInfo.tokenId } })}
                      >
                        <UnboostIcon /> Release Boost
                      </button>
                      <button
                        className="text-md flex items-center gap-3 font-semibold"
                        onClick={() => setModalState({ sellVote: { isOpen: true, tokenId: modal.moreInfo.tokenId } })}
                      >
                        <OpenseaIcon /> Original NFT
                      </button>
                      <button
                        className="text-md flex items-center gap-3 font-semibold"
                        onClick={() => setModalState({ sellVote: { isOpen: true, tokenId: modal.moreInfo.tokenId } })}
                      >
                        <OpenseaIcon /> Opensea
                      </button>
                      <RWebShare
                        data={{
                          title: `${import.meta.env.VITE_NAME}`,
                          url: `${import.meta.env.VITE_APPURL}`,
                          text: 'Check this out',
                        }}
                        onClick={() => {}}
                      >
                        <div className="text-md cursor-pointer flex items-center gap-3 font-semibold">
                          <ShareUpIcon /> Share
                        </div>
                      </RWebShare>
                    </div>
                  </div>
                  <button className="text-white font-semibold text-lg" onClick={onHandleClose}>
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default MarketplaceMore
