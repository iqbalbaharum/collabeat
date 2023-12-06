import { RecordingDialogState } from 'lib/RecordingDialogState'
import { useAudioDialog } from './hooks/useAudioDialog'
import useCollab from './hooks/useCollab'
import { LoadingSpinner, SubmitIcon } from 'components/Icons/icons'
import { useBoundStore } from 'store'
import { useEffect } from 'react'

const AddToNftButton = () => {
  const { dialogState, onDialogClosed } = useAudioDialog()
  const { modal, setModalState } = useBoundStore()

  const { publish, isLoading, isSuccess } = useCollab({
    tokenId: modal.audioRecording.tokenId,
    tokenAddress: modal.audioRecording.address,
    chainId: modal.audioRecording.chainId,
  })

  useEffect(() => {
    if (isSuccess) {
      setModalState({
        audioRecording: {
          isOpen: false,
          chainId: '',
          address: '',
          tokenId: '',
          version: '',
        },
      })
      onDialogClosed()
    }
  }, [isSuccess, onDialogClosed, setModalState])

  return (
    <>
      {dialogState === RecordingDialogState.UPLOAD && (
        <button
          className="bg-yellow-400 rounded-md text-black flex flex-col items-center justify-center gap-2 md:px-5 md:hover:scale-105 text-sm"
          disabled={isLoading}
          onClick={() => publish(modal.audioRecording.version)}
        >
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="flex flex-col items-center justify-center">
              <SubmitIcon />
              Collab
            </div>
          )}
        </button>
      )}
    </>
  )
}

export default AddToNftButton