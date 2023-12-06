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
  const [beats] = useState<Beat[]>([
    {
      quadrant: '1st',
      name: 'intro',
      url: 'https://bafybeiawdd4nvto73eqajq34qmyy363efg4eogwsamnya6ivkxu4ifhfvi.ipfs.nftstorage.link/Intro/Intro%201.wav',
    },
    {
      quadrant: '1st',
      name: 'intro',
      url: 'https://bafybeiawdd4nvto73eqajq34qmyy363efg4eogwsamnya6ivkxu4ifhfvi.ipfs.nftstorage.link/Intro/Intro%202.wav',
    },
    {
      quadrant: '2nd',
      name: 'riff',
      url: 'https://bafybeiawdd4nvto73eqajq34qmyy363efg4eogwsamnya6ivkxu4ifhfvi.ipfs.nftstorage.link/Riff/Riff%201.wav',
    },
    {
      quadrant: '2nd',
      name: 'riff',
      url: 'https://bafybeiawdd4nvto73eqajq34qmyy363efg4eogwsamnya6ivkxu4ifhfvi.ipfs.nftstorage.link/Riff/Riff%202.wav',
    },
    {
      quadrant: '1st',
      name: 'intro',
      url: 'https://bafybeiawdd4nvto73eqajq34qmyy363efg4eogwsamnya6ivkxu4ifhfvi.ipfs.nftstorage.link/Intro/Intro%203.wav',
    },
    {
      quadrant: '1st',
      name: 'intro',
      url: 'https://bafybeiawdd4nvto73eqajq34qmyy363efg4eogwsamnya6ivkxu4ifhfvi.ipfs.nftstorage.link/Intro/Intro%204.wav',
    },
    {
      quadrant: '2nd',
      name: 'riff',
      url: 'https://bafybeiawdd4nvto73eqajq34qmyy363efg4eogwsamnya6ivkxu4ifhfvi.ipfs.nftstorage.link/Riff/Riff%203.wav',
    },
    {
      quadrant: '2nd',
      name: 'riff',
      url: 'https://bafybeiawdd4nvto73eqajq34qmyy363efg4eogwsamnya6ivkxu4ifhfvi.ipfs.nftstorage.link/Riff/Riff%204.wav',
    },
  ])

  const { dialogState, onRecordingStart, onRecordingFinished } = useAudioDialog()

  const onHandleStop = () => {
    onRecordingFinished()
  }

  return (
    <>
      <div className="w-full text-center">
        <div className="py-2 grid grid-cols-4">
          <PlayButton />
          <div className="flex items-center justify-center">
            {(dialogState === RecordingDialogState.START || dialogState === RecordingDialogState.UPLOAD) && (
              <button
                className="flex flex-col items-center justify-center gap-2 md:px-5 md:hover:scale-105 text-sm"
                onClick={onRecordingStart}
              >
                <RecordIcon /> Record
              </button>
            )}
            {(dialogState === RecordingDialogState.RECORD || dialogState === RecordingDialogState.COUNTDOWN) && (
              <button
                className="flex flex-col items-center justify-center gap-2 md:px-5 md:hover:scale-105 text-sm"
                onClick={onRecordingStart}
              >
                <div className="h-5 w-5 rounded-full bg-red-400"></div>
                <span className="text-red-400">Recording</span>
              </button>
            )}
          </div>
          &nbsp;
          <AddToNftButton />
        </div>
        <div className="mt-2 grid grid-cols-4 gap-2 w-full">
          {beats.map((beat, index) => (
            <BeatButton
              key={index}
              color={defineBeatColorByQuadrant(beat.quadrant)}
              textColor={defineTextColorByQuadrant(beat.quadrant)}
              beat={beat}
            />
          ))}
        </div>

        {dialogState === RecordingDialogState.COUNTDOWN && (
          <div className="my-16">
            <CountdownTimer />
          </div>
        )}
        {dialogState === RecordingDialogState.RECORD && (
          <button
            className="mt-3 inline-flex items-center gap-2 rounded-full bg-indigo-600 py-3 px-8 text-white"
            onClick={onHandleStop}
          >
            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 6h6v12H9V6zM19 12.5c0 1.4-.4 2.7-1 3.9l1.4 1.4c1.1-1.9 1.6-4.1 1.6-5.3 0-1.2-.5-3.4-1.6-5.3L18 8.6c.6 1.2 1 2.5 1 3.9zm-9 0c0-1.4.4-2.7 1-3.9L8.6 7.2C7.5 9.1 7 11.3 7 12.5c0 1.2.5 3.4 1.6 5.3l1.4-1.4c-.6-1.2-1-2.5-1-3.9z" />
            </svg>
            <span className="font-medium"> Stop Recording</span>
          </button>
        )}
      </div>
    </>
  )
}

export default NewRecording
