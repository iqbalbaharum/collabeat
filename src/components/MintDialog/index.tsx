import { XMarkIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames'
import ConfirmButton from './ConfirmButton'
import { shortenAddress } from 'utils/'
import { useContext } from 'react'
import { AlertMessageContext } from 'hooks/use-alert-message'

interface MintDialogProp {
  beat: { tokenId: String; owner: string }
  isOpened: boolean
  onDialogClosed: () => void
}

const MintDialog = ({ beat, isOpened, onDialogClosed }: MintDialogProp) => {
  const { showSuccess } = useContext(AlertMessageContext)

  function handleSuccess() {
    showSuccess('Wow, an NFT. Your life is complete.')
    onDialogClosed()
  }

  return (
    <>
      <div
        className={classNames('fixed inset-0 z-10 overflow-y-auto', {
          hidden: !isOpened,
        })}
      >
        <div className="flex min-h-screen items-center justify-center px-4 py-4 text-center">
          <div className="z-99 border-gradient inline-block transform overflow-hidden rounded-sm bg-black p-4 shadow-xl transition-all sm:w-full md:max-w-lg">
            <div className="">
              <div className="flex justify-end text-white">
                <XMarkIcon className="h-6 w-6 cursor-pointer" aria-hidden="true" onClick={() => onDialogClosed()} />
              </div>
            </div>
            <div className="text-center">
              <h3 className="Roboto mb-8 text-lg font-medium leading-6 text-[#DCDCDC]" id="modal-headline">
                Bookmarking Beat
              </h3>
              <div className="mt-2">
                <p className="Roboto text-xs text-[#DCDCDC]">
                  You are bookmarking <b> {`Collabeat #${beat.tokenId} - Started By ${shortenAddress(beat.owner)}`}</b>
                </p>
              </div>
              <div className=" mt-6 flex justify-center">
                {beat.tokenId && <ConfirmButton tokenId={beat.tokenId} onBookmarkSuccess={() => handleSuccess()} />}
                <button className="bg-red-600 px-5 py-3 text-white" onClick={() => onDialogClosed()}>
                  CANCEL
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default MintDialog
