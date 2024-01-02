import { useEffect, useState } from 'react'
import { useAudioDialog } from './hooks/useAudioDialog'
import { PlayIcon, StopIcon } from 'components/Icons/icons'
import { useAudioList } from 'hooks/useAudioList'
import { PlayerState } from 'lib'

interface Prop {
  isPlayAll: boolean
}

const PlayButton = (prop: Prop) => {
  const [isRecordedPlaying, setIsRecordedPlaying] = useState(false)

  const { audioRef, audioData } = useAudioDialog()
  const { setAllState } = useAudioList()

  const onHandlePlayClicked = () => {
    if (!prop.isPlayAll && audioData.url.length <= 0) {
      return
    }
    if (audioRef) {
      audioRef.current.play()
      setIsRecordedPlaying(true)
    }

    if (prop.isPlayAll) setAllState(PlayerState.PLAY)
  }

  const onHandleStopClicked = () => {
    if (audioRef) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setIsRecordedPlaying(false)
    }
    if (prop.isPlayAll) setAllState(PlayerState.STOP)
  }

  useEffect(() => {
    audioRef.current?.addEventListener('ended', () => setIsRecordedPlaying(false))
  }, [audioRef])

  return (
    <div className="flex items-center justify-center">
      <>
        {isRecordedPlaying ? (
          <button
            className="rounded-md capitalize py-2.5 px-2 flex flex-col items-center justify-center gap-2 text-sm text-red-400"
            onClick={onHandleStopClicked}
          >
            <StopIcon />
            Stop
          </button>
        ) : (
          <button
            className={`capitalize py-2.5 px-2 flex flex-col items-center gap-2 justify-center ${
              !prop.isPlayAll ? (audioData.url.length > 0 ? 'text-green-600' : 'text-slate-400') : 'text-yellow-500'
            }`}
            disabled={!prop.isPlayAll ? audioData.url.length <= 0 : false}
            onClick={onHandlePlayClicked}
          >
            <PlayIcon />
            {prop.isPlayAll && <span className="text-sm">All</span>}
            {!prop.isPlayAll && <span className="text-sm">Single</span>}
          </button>
        )}
      </>
    </div>
  )
}

export default PlayButton
