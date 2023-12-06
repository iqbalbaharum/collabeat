import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import { useAudioDialog } from './hooks/useAudioDialog'

const CountdownTimer = () => {
  const { onCountdownFinished } = useAudioDialog()
  return (
    <CountdownCircleTimer
      isPlaying
      duration={3}
      colors={['#8500B4', '#DE296A', '#FFDD00']}
      colorsTime={[3, 2, 0]}
      onComplete={onCountdownFinished}
      size={100}
    >
      {({ remainingTime }) => <div className="text-2xl">{remainingTime}</div>}
    </CountdownCircleTimer>
  )
}

export default CountdownTimer
