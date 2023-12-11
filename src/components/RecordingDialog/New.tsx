import { useState } from 'react'
import BeatButton from './BeatButton'
import { Beat } from 'lib/Beat'
import { RecordIcon } from 'components/Icons/icons'
import { defineBeatColorByQuadrant, defineTextColorByQuadrant } from 'utils/beat'
import { useAudioDialog } from './hooks/useAudioDialog'
import { RecordingDialogState } from 'lib/RecordingDialogState'
import CountdownTimer from './CountDownTimer'
import PlayButton from './PlayButton'
import AddToNftButton from './AddToNftButton'

const NewRecording = () => {
  const { dialogState, onRecordingStart, onRecordingFinished, beats, activeBeats, onHandleBeatClicked } =
    useAudioDialog()

  const onHandleStop = () => {
    onRecordingFinished()
  }

  return (
    <>
      <div className="w-full text-center flex flex-col h-full">
        <div className="py-2 grid grid-cols-4">
          <div className="flex items-center justify-center">
            {(dialogState === RecordingDialogState.START || dialogState === RecordingDialogState.UPLOAD) && (
              <button
                className="flex flex-col items-center justify-center gap-2 md:px-5 md:hover:scale-105 text-sm"
                onClick={() => onRecordingStart(false)}
              >
                <RecordIcon /> Record
              </button>
            )}
            {(dialogState === RecordingDialogState.RECORD || dialogState === RecordingDialogState.COUNTDOWN) && (
              <button
                className="flex flex-col items-center justify-center gap-2 md:px-5 md:hover:scale-105 text-sm"
                onClick={() => onRecordingFinished()}
              >
                <div className="h-5 w-5 rounded-full bg-red-400"></div>
                <span className="text-red-400">Recording</span>
              </button>
            )}
          </div>
          <PlayButton />
          &nbsp;
          <AddToNftButton />
        </div>
        <div className="mt-2 grid grid-cols-4 gap-2 w-full ">
          {beats.map((beat, index) => (
            <BeatButton
              key={index}
              color={defineBeatColorByQuadrant(beat.quadrant)}
              textColor={defineTextColorByQuadrant(beat.quadrant)}
              beat={beat}
              isActive={activeBeats.some(activeBeat => activeBeat.id === beat.id)}
              onHandleBeatClicked={onHandleBeatClicked}
            />
          ))}
        </div>

        {dialogState === RecordingDialogState.COUNTDOWN && (
          <div className="flex-grow h-full">
            <div className="flex h-full justify-center items-center">
              <CountdownTimer />
            </div>
          </div>
        )}
        {dialogState === RecordingDialogState.RECORD && (
          <div className="flex h-full justify-center items-center">
            <button
              className="mt-3 inline-flex items-center gap-2 rounded-full bg-indigo-600 py-3 px-8 text-white"
              onClick={onHandleStop}
            >
              <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 6h6v12H9V6zM19 12.5c0 1.4-.4 2.7-1 3.9l1.4 1.4c1.1-1.9 1.6-4.1 1.6-5.3 0-1.2-.5-3.4-1.6-5.3L18 8.6c.6 1.2 1 2.5 1 3.9zm-9 0c0-1.4.4-2.7 1-3.9L8.6 7.2C7.5 9.1 7 11.3 7 12.5c0 1.2.5 3.4 1.6 5.3l1.4-1.4c-.6-1.2-1-2.5-1-3.9z" />
              </svg>
              <span className="font-medium"> Stop Recording</span>
            </button>
          </div>
        )}
      </div>
    </>
  )
}

export default NewRecording
