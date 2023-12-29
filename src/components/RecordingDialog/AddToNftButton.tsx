import { RecordingDialogState } from 'lib/RecordingDialogState'
import { useAudioDialog } from './hooks/useAudioDialog'
import useCollab from './hooks/useCollab'
import { LoadingSpinner, SubmitIcon } from 'components/Icons/icons'
import { useBoundStore } from 'store'
import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { RQ_KEY } from 'repositories'
import { useParams } from 'react-router-dom'

const AddToNftButton = () => {
  const { nftKey } = useParams()
  const { dialogState, onDialogClosed } = useAudioDialog()
  const { modal, setModalState } = useBoundStore()
  const { audioData } = useAudioDialog()
  const { publish, isLoading, isSuccess } = useCollab({
    tokenId: modal.audioRecording.tokenId,
    tokenAddress: modal.audioRecording.address,
    chainId: modal.audioRecording.chainId,
  })

  const queryClient = useQueryClient()

  useEffect(() => {
    function handleSuccess() {
      let timer = setTimeout(async () => {
        await queryClient.invalidateQueries([RQ_KEY.GET_BEATS_BY_VERSION, nftKey, modal.audioRecording.version])
      }, 3000)

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
      return () => clearTimeout(timer)
    }

    if (isSuccess) handleSuccess()
  }, [isSuccess])

  return (
    <>
      <button
        className={`${
          dialogState === RecordingDialogState.UPLOAD && audioData.url ? 'bg-yellow-400' : 'bg-slate-400'
        }  rounded-md text-black flex flex-col items-center justify-center gap-2 md:px-5 md:hover:scale-105 text-sm`}
        disabled={isLoading || (dialogState !== RecordingDialogState.UPLOAD && audioData.url)}
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
    </>
  )
}

export default AddToNftButton
