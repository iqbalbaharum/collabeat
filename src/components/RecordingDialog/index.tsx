import { useState } from 'react'
import classNames from 'classnames'
import { useWeb3Auth } from 'hooks/use-web3auth'
import NewRecording from './New'
import { useAudioDialog } from './hooks/useAudioDialog'
import { useAudioList } from 'hooks/useAudioList'
import { useBoundStore } from 'store'

const RecordingDialog = () => {
  const { onDialogClosed } = useAudioDialog()
  const { setAllMuted, filteredData } = useAudioList()
  const { modal, setModalState } = useBoundStore()
  const { address } = useWeb3Auth()

  const [isAllBeatsMuted, setIsAllBeatsMuted] = useState(false)

  const onHandleDialogClosed = () => {
    onDialogClosed()
    setModalState({
      audioRecording: {
        isOpen: false,
        chainId: '',
        address: '',
        tokenId: '',
        version: '',
      },
    })
  }

  // useEffect(() => {
  //   const filtered = []
  //   filtered.push({
  //     key: address ?? '',
  //     data: '',
  //     isMuted: false,
  //     playerState: PlayerState.STOP,
  //   })

  //   // setFilteredData(filtered)
  // }, [address])

  return (
    <>
      <div
        className={classNames('md:max-w-md fixed inset-0 z-10 overflow-y-auto mx-auto', {
          hidden: !modal.audioRecording.isOpen,
        })}
      >
        <div className="flex min-h-screen items-center justify-center text-center text-sm text-white md:text-lg bg-black/80">
          <div className="w-full h-screen bg-gray-900/50 backdrop-blur px-2 py-4 md:px-4">
            <div className="flex justify-end pr-2 md:pr-0">
              <button
                className="rounded-md bg-red-600 text-sm py-2 px-2 md:px-5 md:hover:scale-105"
                onClick={onHandleDialogClosed}
              >
                Close
              </button>
            </div>
            <NewRecording />
          </div>
        </div>
      </div>
    </>
  )
}

export default RecordingDialog
