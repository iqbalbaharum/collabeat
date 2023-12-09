import { XMarkIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames'
import { useIpfs } from 'hooks/use-ipfs'
import { SelectedAudio } from 'lib'
import { useContext, useEffect, useState } from 'react'
import { AlertMessageContext } from 'hooks/use-alert-message'
import ConfirmButton from './ConfirmButton'
import { useBoundStore } from 'store'

interface NftifyDialogProp {
  tokenId: String
}

const NftifyDialog = (prop: NftifyDialogProp) => {
  const [uploadedCid, setUplodedCid] = useState('')
  const { showSuccess } = useContext(AlertMessageContext)
  const { modal, setModalState } = useBoundStore()
  const { ipfs } = useIpfs()

  function handleSuccess() {
    showSuccess('Congrats on your first cool achievement')
    onDialogClosed()
  }

  const onDialogClosed = () => {
    setModalState({ nftify: { isOpen: false, selections: [] } })
  }

  useEffect(() => {
    const uploadToIpfs = async () => {
      try {
        const cid = await ipfs.dag.put(modal.nftify.selections)
        setUplodedCid(cid.toString())
      } catch (e) {
        console.log(e)
      }
    }

    if (!uploadedCid) {
      // uploadToIpfs()
    }
  }, [uploadedCid, ipfs, prop])

  return (
    <>
      <div
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
                {/* {uploadedCid && <ConfirmButton cid={uploadedCid} onForkSuccess={() => handleSuccess()} />} */}
                <button className="bg-red-600 px-5 py-3 text-white" onClick={onDialogClosed}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default NftifyDialog
