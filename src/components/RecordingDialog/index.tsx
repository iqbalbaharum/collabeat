import { useState } from 'react'
import classNames from 'classnames'
import Waveform from 'components/Waveform'
import { useEffect } from 'react'
import { AudioState, PlayerState } from 'lib'
import { useWeb3Auth } from 'hooks/use-web3auth'
import NewRecording from './New'
import { useAudioDialog } from './hooks/useAudioDialog'
import { useAudioList } from 'hooks/useAudioList'
import { useBoundStore } from 'store'

const RecordingDialog = () => {
  const { onDialogClosed } = useAudioDialog()
  const { setAllMuted, filteredData, setFilteredData } = useAudioList()
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

  const onHandleMuteClicked = (muted: boolean) => {
    setAllMuted(muted)
    setIsAllBeatsMuted(muted)
  }

  const onHandleRecord = () => {}

  useEffect(() => {
    const filtered = []
    filtered.push({
      key: address ?? '',
      data: '',
      isMuted: false,
      playerState: PlayerState.STOP,
    })

    setFilteredData(filtered)
  }, [address])

  const onToggleSound = (state: AudioState) => {
    const index = filteredData.findIndex(item => item.key === state.key)
    const updatedData = [...filteredData]

    updatedData[index] = {
      ...updatedData[index],
      isMuted: !state.isMuted,
    }

    setFilteredData(updatedData)
  }

  return (
    <>
      <div
        className={classNames('md:max-w-md fixed inset-0 z-10 overflow-y-auto sm:w-full lg:w-1/2 mx-auto', {
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
            <div className="border-1 rounded p-2 text-left">
              <div className="flex items-center justify-center">
                <NewRecording />
                {/* {dialogState == RecordingDialogState.START && (
                  <StartRecording onHandleStartRecordingClicked={onRecordingStart} />
                )}
                {dialogState === RecordingDialogState.COUNTDOWN && (
                  <div className="my-16">
                    <CountdownTimer onCountdownFinish={() => onCountdownFinished()} />
                  </div>
                )}
                {dialogState === RecordingDialogState.RECORD && (
                  // <Recording
                  //   state={state}
                  //   onHandleStopRecordingClicked={() => onRecordingFinished()}
                  //   mediaStream={mediaStream}
                  // />
                  <NewRecording />
                )}
                {dialogState === RecordingDialogState.UPLOAD && (
                  <div className="items-center justify-center w-full">
                    <div className="py-6">
                      {audioData.url && (
                        <Waveform
                          url={audioData.url}
                          playerState={filteredData[filteredData.length - 1].playerState}
                          isMuted={filteredData[filteredData.length - 1].isMuted}
                          onToggleSound={() => onToggleSound(filteredData[filteredData.length - 1])}
                          isMuteButtonHidden={true}
                          onFinish={() => onStopOneAudio(filteredData[filteredData.length - 1])}
                        />
                      )}
                    </div>
                    <Upload
                      audioData={audioData}
                      dataKey={prop.dataKey}
                      chainId={prop.chainId}
                      address={prop.address}
                      tokenId={prop.tokenId}
                      version={prop.version}
                      isAllBeatsMuted={isAllBeatsMuted}
                      isRecordedPlaying={filteredData[filteredData.length - 1].playerState === PlayerState.PLAY}
                      onHandleMuteClicked={muted => onHandleMuteClicked(muted)}
                      onHandleConfirmClicked={() => onHandleConfirmClicked()}
                      onHandleRecordClicked={() => onRecordingStart()}
                      onHandlePlayClicked={() => onPlayOneAudio(filteredData[filteredData.length - 1])}
                      onHandleStopClicked={() => onStopOneAudio(filteredData[filteredData.length - 1])}
                    />
                  </div>
                )} */}
                {/* {state === RecordingDialogState.FINISH && (
                  <Success
                    onHandleSuccess={}
                  />
                )} */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* {!audioUrl && (
        <div className="relative">
          <div className="absolute left-[6.5rem] inline-block h-[93%] border-l-2 border-[#D45BFF]" />
          <div className="ml-auto h-16 w-[84.2%] bg-[#595959]" />
          <div className="flex w-full flex-col  items-center justify-center bg-black pt-2 pb-8 ">
            <div className="flex w-full flex-row items-center justify-end gap-x-2 pr-2">
              <p className="Inter text-sm font-medium text-[#CCCCCC]">Collaboration_1</p>
              <img src={mute.src} alt="Mute" className="h-auto w-6" />
            </div>

            <div className="box-shadow relative h-40 w-40 rounded-full bg-[#FF3535] py-2">
              <button type="button" onClick={handleStop}>
                <div className="absolute top-2 left-2 h-36 w-36 rounded-full border-4 border-black border-opacity-50 bg-[#FF3535] ">
                  <div className="flex w-full justify-center">
                    <img src={bigmic.src} alt="Mic" className="absolute top-[1.2rem] left-[2.1rem] h-auto w-16" />
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )} */}
    </>
  )
}

export default RecordingDialog
