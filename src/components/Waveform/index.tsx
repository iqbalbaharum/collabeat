import { PlayerState } from 'lib'
import { useEffect, useRef } from 'react'
import classNames from 'classnames'
import { MutedSpeakerIcon, UnmutedSpeakerIcon } from 'components/Icons/icons'
import { replaceIpfsUrl } from 'utils/conversion'

interface WaveformProps {
  url: string
  playerState: PlayerState
  isMuted: boolean
  isSelecting?: Boolean
  isSelected?: Boolean
  onToggleSound: (muted: boolean) => void
  onFinish?: () => void
  isMuteButtonHidden?: boolean
}

const Waveform: React.FC<WaveformProps> = ({
  url,
  playerState,
  isMuted,
  onToggleSound,
  onFinish,
  isSelecting,
  isSelected,
  isMuteButtonHidden,
}) => {
  const waveformRef = useRef<HTMLDivElement>(null)
  const wavesurferRef = useRef<WaveSurfer | null>(null)

  useEffect(() => {
    let isMounted = true

    const loadWaveSurfer = async () => {
      if (typeof window === 'undefined') {
        return
      }

      const { default: WaveSurfer } = await import('wavesurfer.js')

      if (isMounted && waveformRef.current) {
        wavesurferRef.current = WaveSurfer.create({
          container: waveformRef.current,
          waveColor: 'red',
          backend: 'WebAudio',
          hideCursor: true,
          responsive: true,
          normalize: true,
          height: 25,
          barHeight: 10,
          barWidth: 2,
          fillParent: false,
          minPxPerSec: window.innerWidth < 720 ? 1 : 5,
          scrollParent: false,
        })

        const gatewayUrl = replaceIpfsUrl(url)
        wavesurferRef.current.load(gatewayUrl)
        wavesurferRef.current.setMute(isMuted)

        wavesurferRef.current.on('ready', () => {
          switch (playerState) {
            case PlayerState.PLAY:
              wavesurferRef.current?.play()
              break
            case PlayerState.PAUSED:
              if (wavesurferRef.current?.isPlaying) {
                wavesurferRef.current?.pause()
              }
              break
            case PlayerState.STOP:
            default:
              wavesurferRef.current?.stop()
              break
          }
        })

        wavesurferRef.current.on('finish', () => {
          if (onFinish) {
            onFinish()
          }
        })
      }
    }

    loadWaveSurfer()

    return () => {
      isMounted = false
      wavesurferRef.current?.destroy()
    }
  }, [url, playerState])

  useEffect(() => {
    // this.backend is referred inside setMute, it can be null since wavesurfer is destroyed in cleanup function
    if (wavesurferRef?.current && wavesurferRef.current.backend !== null) {
      wavesurferRef?.current?.setMute(isMuted)
    }
  }, [isMuted])

  return (
    <div className="flex items-center justify-between">
      <div ref={waveformRef} />

      {!isSelecting && !isMuteButtonHidden && (
        <button className="rounded-full text-lg" onClick={() => onToggleSound(!isMuted)}>
          {isMuted && <MutedSpeakerIcon />}
          {!isMuted && <UnmutedSpeakerIcon />}
        </button>
      )}
      {isSelecting && (
        <button
          className={classNames('rounded-sm text-sm px-4 py-2 text-black', {
            'bg-yellow-500': !isSelected,
            'bg-green-500': isSelected,
          })}
        >
          {!isSelected ? 'Select' : 'Unselect'}
        </button>
      )}
    </div>
  )
}

export default Waveform
