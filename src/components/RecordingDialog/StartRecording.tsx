import Waveform from 'components/Waveform'
import { useCallback, useEffect, useRef, useState } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface StartRecordingProp {
  onHandleStartRecordingClicked: () => void
}

const StartRecording = (prop: StartRecordingProp) => {
  return (
    <button className="rounded-full bg-indigo-600 px-5 py-3" onClick={prop.onHandleStartRecordingClicked}>
      Start Recording
    </button>
  )
}

export default StartRecording
