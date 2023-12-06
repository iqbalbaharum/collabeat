import { useEffect, useState } from 'react'
import { useAudioDialog } from './hooks/useAudioDialog'
import { PlayIcon, StopIcon } from 'components/Icons/icons'

const PlayButton = () => {
  const [isRecordedPlaying, setIsRecordedPlaying] = useState(false)

  const { audioRef, audioData } = useAudioDialog()

  const onHandlePlayClicked = () => {
    if (audioRef) {
      audioRef.current.play()
      setIsRecordedPlaying(true)
    }
  }

  const onHandleStopClicked = () => {
    if (audioRef) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setIsRecordedPlaying(false)
    }
  }

  useEffect(() => {
    audioRef.current?.addEventListener('ended', () => setIsRecordedPlaying(false))
  }, [audioRef])

  return (
    <div className="flex items-center justify-center">
      {audioData.url.length > 0 && (
        <>
          {isRecordedPlaying ? (
            <button
              className="rounded-md capitalize py-2.5 px-2 flex flex-col items-center justify-center gap-2"
              onClick={onHandleStopClicked}
            >
              <StopIcon />
              Stop
            </button>
          ) : (
            <button
              className="capitalize text-yellow-400 py-2.5 px-2 flex flex-col items-center gap-2 justify-center"
              onClick={onHandlePlayClicked}
            >
              <PlayIcon />
              Play
            </button>
          )}
        </>
      )}
    </div>
  )
}

export default PlayButton
