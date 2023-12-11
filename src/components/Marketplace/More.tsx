import { Dialog, Transition } from '@headlessui/react'
import GenericButton from 'components/Button/GenericButton'
import { OpenseaIcon } from 'components/Icons/socials'
import { DisconnectIcon } from 'components/Icons/system'
import { useWeb3Auth } from 'hooks/use-web3auth'
import { Fragment, useState } from 'react'
import { useBoundStore } from 'store'

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
                    <div className="flex flex-col gap-4 justify-start items-start text-gray-200 p-3">
                      <div className="flex gap-4">
                        <img src={modal.moreInfo.metadata?.image} className="h-16 w-16 rounded-md" />
                        <div className="text-left">
                          <div className="text-white text-sm">{modal.moreInfo.metadata?.name}</div>
                          <div className="text-xs uppercase text-gray-200">2 Collaborators</div>
                          <div className="text-xs uppercase text-gray-200">8 VOTES</div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-end gap-2">
                          <GenericButton
                            name="Buy"
                            onClick={() =>
                              setModalState({ buyVote: { isOpen: true, tokenId: modal.moreInfo.tokenId } })
                            }
                          />
                          <GenericButton
                            name="Sell"
                            onClick={() =>
                              setModalState({ sellVote: { isOpen: true, tokenId: modal.moreInfo.tokenId } })
                            }
                          />
                        </div>
                      </div>
                      <button
                        className="text-md flex items-center gap-2"
                        onClick={() => setModalState({ sellVote: { isOpen: true, tokenId: modal.moreInfo.tokenId } })}
                      >
                        <OpenseaIcon /> Original NFT
                      </button>
                      <button
                        className="text-md flex items-center gap-2"
                        onClick={() => setModalState({ sellVote: { isOpen: true, tokenId: modal.moreInfo.tokenId } })}
                      >
                        <OpenseaIcon /> Opensea
                      </button>
                    </div>
                  </div>
                  <button className="text-white" onClick={onHandleClose}>
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
