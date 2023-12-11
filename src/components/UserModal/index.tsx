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
          <div className={`fixed inset-0 bg-blue-800/40 backdrop-blur`} aria-hidden="true" />
        </Transition.Child>

        <Transition.Child
          as={Fragment}
          enter="transition ease-out duration-300 transform"
          enterFrom="opacity-0 translate-y-full"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-200 transform"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-full"
        >
          <div className="fixed w-full sm:bottom-0 lg:w-2/4 lg:-translate-x-1/2 lg:left-1/2 lg:top-1/2 -translate-y-1/2 transform rounded-lg bg-slate-900 text-white lg:h-2/5 sm:h-1/2 sm:max-w-md">
            <Dialog.Panel className="h-full text-center">
              <div
                className={`flex flex-col p-4 ring-1 ring-white backdrop-blur border shadow-2xl h-full border-slate-600`}
              >
                <h3 className="flex-1 flex flex-col items-center justify-center font-bold text-lg">
                  {shortenAddress(address)}
                </h3>
                <div className="h-1/3 flex justify-center items-center gap-2 w-full">
                  <button
                    className="w-1/2 font-semibold bg-white px-2 rounded-lg py-4 border-1 border-slate-600 flex gap-2 items-center justify-center text-slate-600 text-sm cursor-pointer"
                    onClick={() => onClickDisconnect()}
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
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  )
}

export default UserModal
