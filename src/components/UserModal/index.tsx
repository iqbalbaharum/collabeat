import { Dialog, Transition } from '@headlessui/react'
import { DisconnectIcon } from 'components/Icons/system'
import { useWeb3Auth } from 'hooks/use-web3auth'
import { Fragment, useState } from 'react'
import { useBoundStore } from 'store'
import { shortenAddress } from 'utils'

const UserModal = () => {
  const { modal, setModalState } = useBoundStore()
  const { disconnect, address } = useWeb3Auth()

  const onClickDisconnect = async () => {
    await disconnect()
    setModalState({ user: { isOpen: false } })
  }
  return (
    <Transition appear show={modal.user.isOpen} as={Fragment}>
      <Dialog as="div" onClose={() => setModalState({ user: { isOpen: false } })}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className={`fixed inset-0 bg-blue-800/40 backdrop-blur z-10`} aria-hidden="true" />
        </Transition.Child>

        <div className="max-w-md mx-auto fixed inset-0 overflow-y-auto z-20">
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
              <Dialog.Panel className="w-full h-1/3 fixed max-w-md bottom-0 text-center transform overflow-hidden bg-blue-900 align-middle shadow-xl transition-all">
                <div className={`flex flex-col p-4 backdrop-blur shadow-2xl h-full `}>
                  <h3 className="flex-1 flex flex-col items-center justify-center font-bold text-lg text-white">
                    {shortenAddress(address)}
                  </h3>
                  <div className="h-1/3 flex justify-center items-center gap-2 w-full">
                    <button
                      className="w-1/2 font-semibold bg-white px-2 rounded-lg py-4 border-1 border-slate-600 flex gap-2 items-center justify-center text-slate-600 text-sm cursor-pointer"
                      onClick={() => {}}
                    >
                      <DisconnectIcon /> Copy Address
                    </button>
                    <button
                      className="w-1/2 font-semibold bg-white px-2 rounded-lg py-4 border-1 border-slate-600 flex gap-2 items-center justify-center text-slate-600 text-sm cursor-pointer"
                      onClick={() => onClickDisconnect()}
                    >
                      <DisconnectIcon /> Disconnect
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default UserModal
