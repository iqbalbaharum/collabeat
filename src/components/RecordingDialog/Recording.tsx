import { useEffect, useState } from 'react'
import { RecordingDialogState } from '.'

interface RecordingProp {
  state: RecordingDialogState
  onHandleStopRecordingClicked: () => any
  setAudioData: (obj: any) => void
  mediaStream: MediaStream | undefined
}

const Recording = (prop: RecordingProp) => {
  const [second, setSecond] = useState('00')
  const [minute, setMinute] = useState('00')
  const [timer, setTimer] = useState(0)

  useEffect(() => {
    let intervalIdTime: NodeJS.Timer

    if (prop.state == RecordingDialogState.RECORD) {
      intervalIdTime = setInterval(() => {
        const secondCounter = timer % 60
        const minuteCounter = Math.floor(timer / 60)
        const hourCounter = Math.floor(timer / 3600)

        const computedSecond = String(secondCounter).length === 1 ? `0${secondCounter}` : secondCounter
        const computedMinute = String(minuteCounter).length === 1 ? `0${minuteCounter}` : minuteCounter

        setSecond(computedSecond as string)
        setMinute(computedMinute as string)

        setTimer(counter => counter + 1)
      }, 1000)
    }

    return () => clearInterval(intervalIdTime)
  }, [prop.state, timer])

  const onHandleStop = () => {
    setSecond('00')
    setMinute('00')

    setTimer(0)

    prop.onHandleStopRecordingClicked()
  }

  return (
    <div className="text-center">
      <div className="inter mt-4 text-center text-2xl font-medium text-white">
        <div className="mr-1 inline-block h-4 w-4 rounded-full bg-red-600"></div> Recording{' '}
        <span className="minute">{minute}</span>
        <span>:</span>
        <span className="second">{second}</span>
      </div>
      <button
        className="mt-3 inline-flex items-center gap-2 rounded-full bg-indigo-600 bg-indigo-600 px-5 py-3 px-8 text-white"
        onClick={onHandleStop}
      >
        <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9 6h6v12H9V6zM19 12.5c0 1.4-.4 2.7-1 3.9l1.4 1.4c1.1-1.9 1.6-4.1 1.6-5.3 0-1.2-.5-3.4-1.6-5.3L18 8.6c.6 1.2 1 2.5 1 3.9zm-9 0c0-1.4.4-2.7 1-3.9L8.6 7.2C7.5 9.1 7 11.3 7 12.5c0 1.2.5 3.4 1.6 5.3l1.4-1.4c-.6-1.2-1-2.5-1-3.9z" />
        </svg>
        <span className="font-medium"> Stop Recording</span>
      </button>
    </div>
  )
}

export default Recording
