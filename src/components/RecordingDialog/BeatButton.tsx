import { Beat } from 'lib/Beat'
import { useEffect, useRef, useState } from 'react'
import * as Tone from 'tone'

interface Prop {
  color: string
  textColor: string
  beat: Beat
}
const BeatButton = (prop: Prop) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const player = useRef<Tone.Player>(new Tone.Player({ url: prop.beat.url, loop: true }).toDestination())

  const onHandleClicked = () => {
    setIsActive(!isActive)
  }

  useEffect(() => {
    if (isActive && player) {
      player.current?.start()
    } else {
      player.current?.stop()
    }
  }, [isActive])

  return (
    <button
      onClick={onHandleClicked}
      className={`h-24 w-full rounded-md capitalize ${prop.color} ${prop.textColor} ${
        !isActive ? `bg-opacity-20 text-opacity-100` : `bg-opacity-60`
      }`}
    >
      {prop.beat.name}
    </button>
  )
}

export default BeatButton
