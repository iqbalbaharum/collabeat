import { Beat } from 'lib/Beat'
import { useEffect, useRef, useState } from 'react'
import * as Tone from 'tone'
import { useAudioDialog } from './hooks/useAudioDialog'

interface Prop {
  color: string
  textColor: string
  beat: Beat
  isActive: boolean
  onHandleBeatClicked: (beat: Beat) => void
}
const BeatButton = (prop: Prop) => {
  const { mediaStream } = useAudioDialog()

  const player = useRef<Tone.Player>(new Tone.Player({ url: prop.beat.url, loop: true }).toDestination())

  const onHandleClicked = () => {
    Tone.Transport.scheduleOnce(() => {
      if (prop.isActive && player) {
        player.current?.start()
      } else {
        player.current?.stop()
      }
    }, Tone.Transport.nextSubdivision('4n'))

    prop.onHandleBeatClicked(prop.beat)
  }

  useEffect(() => {
    if (mediaStream) {
      player.current.connect(mediaStream)
    }

    return () => {
      player.current.disconnect(mediaStream)
    }
  }, [prop.isActive, mediaStream])

  return (
    <button
      onClick={onHandleClicked}
      className={`lg:h-14 h-20 w-full rounded-md capitalize text-sm font-semibold ${prop.color} ${prop.textColor} ${
        !prop.isActive ? `bg-opacity-20 text-opacity-100` : `bg-opacity-60`
      }`}
    >
      {prop.beat.name}
    </button>
  )
}

export default BeatButton
