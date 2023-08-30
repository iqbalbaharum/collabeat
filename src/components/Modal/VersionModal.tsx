import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
interface VersionModalProp {
  isOpen: boolean
  onClose: () => void
  chainId: String
  tokenAddress: String
  tokenId: String
}

const VersionModal = (prop: VersionModalProp) => {
  const navigate = useNavigate()

  const [uuid, setUuid] = useState<String>('')

  useEffect(() => {
    if (!uuid) {
      const id = uuidv4()
      setUuid(id as String)
    }
  }, [uuid])

  const redirectToEditor = () => {
    navigate(`/editor/${prop.chainId}/${prop.tokenAddress}/${prop.tokenId}/${uuid}`)
    prop.onClose()
  }

  const closeDialog = () => {
    prop.onClose()
  }

  return (
    <>
      <Transition appear show={prop.isOpen} as={Fragment} afterLeave={() => setUuid('')}>
        <Dialog as="div" className="relative z-10" onClose={closeDialog}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full text-center max-w-sm transform overflow-hidden rounded-2xl bg-white p-6 align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    New version
                  </Dialog.Title>
                  <div className="w-full text-sm text-center bg-gray-800 text-gray-400 p-3 rounded-xl mt-2">{uuid}</div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      The version is only make permanent after you register the first beat.
                    </p>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={redirectToEditor}
                    >
                      Got it, thanks!
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default VersionModal
