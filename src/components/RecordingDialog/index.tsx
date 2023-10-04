import { useState } from 'react'
import classNames from 'classnames'
import Waveform from 'components/Waveform'
import { useEffect } from 'react'
import { useAccount } from 'wagmi'
import Recording from './Recording'
import CountdownTimer from './CountDownTimer'
import StartRecording from './StartRecording'
import Upload from './Upload'
import { AudioState, PlayerState } from 'lib'
import Success from './Success'
interface RecordingDialogProp {
  dataKey: String
  chainId: String
  address: String
  tokenId: String
  version: String
  isOpened: boolean
  onDialogClosed: () => void
  setAllMuted: (muted: boolean) => void
  setAllState: (state: PlayerState) => void
}

export enum RecordingDialogState {
  START,
  COUNTDOWN,
  RECORD,
  UPLOAD,
  FINISH,
}

const RecordingDialog = (prop: RecordingDialogProp) => {
  const [state, setState] = useState<RecordingDialogState>(RecordingDialogState.START)
  const [audioData, setAudioData] = useState<{blob: Blob | null, url: string}>({
    blob: null,
    url: '',
  })
  const [filteredData, setFilteredData] = useState<Array<AudioState>>([])
  const { address } = useAccount()

  const [isAllBeatsMuted, setIsAllBeatsMuted] = useState(false)

  const onHandleConfirmClicked = () => {
    prop.onDialogClosed()
  }

  const onHandleMuteClicked = (muted: boolean) => {
    prop.setAllMuted(muted)
    setIsAllBeatsMuted(muted)
  }
  async function onRecordingStart() {
    try {
      await getMicrophoneAccess()
      setState(RecordingDialogState.COUNTDOWN)
    } catch (e) {
      console.log(e)
    }
  }

  const onRecordingFinished = () => {
    mediaRecorder?.stop()

    if (audioData) {
      setState(RecordingDialogState.UPLOAD)
    } else {
      setState(RecordingDialogState.START)
    }
    removeMicrophoneAccess()
    prop.setAllState(PlayerState.STOP)
  }

  const onCountdownFinished = () => {
    setState(RecordingDialogState.RECORD)
    prop.setAllState(PlayerState.PLAY)
  }

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

  const onPlayOneAudio = (state: AudioState) => {
    const index = filteredData.findIndex(item => item.key === state.key)
    const updatedData = [...filteredData]

    updatedData[index] = {
      ...updatedData[index],
      playerState: PlayerState.PLAY,
    }

    setFilteredData(updatedData)
    prop.setAllState(PlayerState.PLAY)
  }

  const onStopOneAudio = (state: AudioState) => {
    const index = filteredData.findIndex(item => item.key === state.key)
    const updatedData = [...filteredData]

    updatedData[index] = {
      ...updatedData[index],
      playerState: PlayerState.STOP,
    }

    setFilteredData(updatedData)
    prop.setAllState(PlayerState.STOP)
  }

  const [mediaStream, setMediaStream] = useState<MediaStream>()
  const [chunks, setChunks] = useState<Blob[]>([])
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)

  const getMicrophoneAccess = async () => {
    try {
      const constraints = {
        audio: { autoGainControl: false, echoCancellation: false, noiseSuppression: false },
        video: false,
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)

      const recorder = new MediaRecorder(stream)
      setChunks([])

      recorder.ondataavailable = event => {
        setChunks(prev => [...prev, event.data])
      }

      setMediaRecorder(recorder)
      setMediaStream(stream)
    } catch (ex) {
      console.log(ex)
    }
  }

  const removeMicrophoneAccess = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop())
      setMediaStream(undefined)
    }
  }

  useEffect(() => {
    if (mediaRecorder && state === RecordingDialogState.RECORD) mediaRecorder.start()
  }, [state])

  useEffect(() => {
    if (chunks.length > 0) {
      const blob = new Blob(chunks, { type: 'audio/mpeg' })
      const url = URL.createObjectURL(blob)
      setAudioData({
        blob,
        url,
      })
    }
  }, [chunks])

  return (
    <>
      <div
        className={classNames('fixed inset-0 z-10 overflow-y-auto', {
          hidden: !prop.isOpened,
        })}
      >
        <div className="flex min-h-screen items-center justify-center px-2 py-4 text-center text-sm text-white md:text-lg bg-black/80">
          <div className=" min-w-[20rem] bg-gray-900 px-2 py-4 md:w-full md:max-w-lg md:px-4">
            <div className="flex justify-end pr-2 md:pr-0">
              <button
                className="rounded-md bg-red-600 text-sm py-2 px-2 md:px-5 md:hover:scale-105"
                onClick={() => prop.onDialogClosed()}
              >
                Close
              </button>
            </div>
            <div className="border-1 m-1 rounded p-2 text-left">
              <div className="flex items-center justify-center">
                {state == RecordingDialogState.START && (
                  <StartRecording onHandleStartRecordingClicked={onRecordingStart} />
                )}
                {state === RecordingDialogState.COUNTDOWN && (
                  <div className='my-16'>
                    <CountdownTimer onCountdownFinish={() => onCountdownFinished()} />
                  </div>
                )}
                {state === RecordingDialogState.RECORD && (
                  <Recording
                    state={state}
                    onHandleStopRecordingClicked={() => onRecordingFinished()}
                    setAudioData={setAudioData}
                    mediaStream={mediaStream}
                  />
                )}
                {state === RecordingDialogState.UPLOAD && (
                  <div className="items-center justify-center w-full">
                    <div className='py-6'>
                    {audioData.url && (
                      <Waveform
                        url={audioData.url }
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
                )}
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
