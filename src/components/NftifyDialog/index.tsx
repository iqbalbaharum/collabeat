import { XMarkIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames'
import { useIpfs } from 'hooks/use-ipfs'
import { SelectedAudio } from 'lib'
import { useContext, useEffect, useState } from 'react'
import { AlertMessageContext } from 'hooks/use-alert-message'
import ConfirmButton from './ConfirmButton'
import { useBoundStore } from 'store'
import useMint from './hooks/useMint'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import GenericButton from 'components/Button/GenericButton'
import { ethers } from 'ethers'
interface NftifyDialogProp {
  tokenId: String
}

const NftifyDialog = (prop: NftifyDialogProp) => {
  const [uploadedCid, setUplodedCid] = useState('')
  const { showSuccess } = useContext(AlertMessageContext)
  const { modal, setModalState } = useBoundStore()
  const { ipfsFork } = useIpfs()
  const { mintPrice } = useMint()

  const onDialogClosed = () => {
    setModalState({ nftify: { isOpen: false, selections: [], dataKey: '', nft: undefined } })
  }

  useEffect(() => {
    const uploadToIpfs = async () => {
      try {
        const cid = await ipfsFork.dag.put(modal.nftify.selections)
        setUplodedCid(cid.toString())
      } catch (e) {
        console.log(e)
      }
    }

    if (!uploadedCid) {
      uploadToIpfs().catch(console.log)
    }
  }, [uploadedCid, ipfsFork, prop, modal.nftify.selections])

  return (
    <>
      <Transition appear show={modal.nftify.isOpen} as={Fragment}>
        <Dialog as="div" onClose={onDialogClosed}>
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
                <Dialog.Panel className="w-full h-2/5 fixed max-w-md bottom-0 text-center transform overflow-hidden bg-blue-900 align-middle shadow-xl transition-all">
                  <div className="flex flex-col p-4 text-white h-full">
                    <h3 className="text-lg font-bold">NFTify beats</h3>
                    <h5 className="text-md">
                      Convert selected beat(s) into an NFT(s) and send to collaborators as proof of collaboration.
                    </h5>
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center flex flex-col gap-1">
                        <h2 className="text-2xl font-semibold text-orange-400">
                          {`${modal.nftify.selections.length} beat${modal.nftify.selections.length > 1 ? 's' : ''}`}
                        </h2>
                      </div>
                    </div>
                    <div className="my-3 pr-3 w-full text-right">
                      <h3>
                        NFTify Price:{' '}
                        <span className="font-bold">{ethers.formatEther(BigInt(mintPrice)) ?? 0} ETH</span>
                      </h3>
                      <div className="text-center flex justify-end gap-2 mt-2">
                        {uploadedCid && mintPrice && (
                          <ConfirmButton
                            cid={uploadedCid}
                            dataKey={modal.nftify.dataKey}
                            name={modal.nftify.nft?.metadata.name as string}
                            onNftifySuccess={onDialogClosed}
                          />
                        )}
                        <GenericButton name="Cancel" onClick={onDialogClosed} />
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      {/* <div
        className={classNames('fixed inset-0 z-10 overflow-y-auto', {
          hidden: !modal.nftify.isOpen,
        })}
      >
        <div className="flex min-h-screen items-center justify-center px-4 py-4 text-center bg-black/70">
          <div className="z-99 border-gradient inline-block transform overflow-hidden rounded-2xl bg-white pt-4 pb-10 px-4 shadow-xl transition-all w-full md:max-w-lg">
            <div className="">
              <div className="flex justify-end text-black">
                <XMarkIcon className="h-6 w-6 cursor-pointer" aria-hidden="true" onClick={onDialogClosed} />
              </div>
            </div>
            <div className="text-center">
              <h3 className="Roboto mb-6 text-lg md:text-xl font-medium leading-6 text-gray-800" id="modal-headline">
                NFTify Sheet
              </h3>
              <div className="mt-2">
                <p className="Roboto text-xs md:text-sm text-gray-500">
                  You are NFTifying <b>{`${modal.nftify.selections.length}`} beat(s)</b>
                </p>
              </div>
              <div className="mt-6 flex justify-center">
                {uploadedCid && mintPrice && (
                  <ConfirmButton
                    cid={uploadedCid}
                    dataKey={modal.nftify.dataKey}
                    name={modal.nftify.nft?.name as string}
                  />
                )}
                <button className="bg-red-600 px-5 py-3 text-white" onClick={onDialogClosed}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </>
  )
}

export default NftifyDialog
