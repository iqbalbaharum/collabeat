import Waveform from 'components/Waveform'
import { useCallback, useEffect, useRef, useState } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface SuccessProp {
  onHandleSuccess: () => void
}

const Success = (prop: SuccessProp) => {
  return (
    <button className="rounded-full bg-indigo-600 w-full px-5 py-3 my-16" onClick={prop.onHandleSuccess}>
      Congratulations
    </button>
  )
}

export default Success