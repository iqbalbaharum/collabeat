import { Beat } from 'lib/Beat'

interface Prop {
  color: string
  textColor: string
  beat: Beat
  isActive: boolean
  onHandleBeatClicked: (beat: Beat) => void
}

const BeatButton = (prop: Prop) => {
  const onHandleClicked = () => {
    prop.onHandleBeatClicked(prop.beat)
  }

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
