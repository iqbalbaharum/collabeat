import { useRef, useState } from 'react'
import { CountdownCircleTimer } from 'react-countdown-circle-timer'

interface CountdownProp {
  onCountdownFinish: () => void
}

const CountdownTimer = (prop: CountdownProp) => {
  return (
    <CountdownCircleTimer
      isPlaying
      duration={3}
      colors={['#8500B4', '#DE296A', '#FFDD00']}
      colorsTime={[3, 2, 0]}
      onComplete={prop.onCountdownFinish}
      size={100}
    >
      {({ remainingTime }) => <div className="text-2xl">{remainingTime}</div>}
    </CountdownCircleTimer>
  )
}

export default CountdownTimer
