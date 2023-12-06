import { RecordingDialogState } from 'lib/RecordingDialogState'
import React, { createContext, useContext, useEffect, useState } from 'react'
import useMediaAccess from './useMediaAccess'
import { useAudioList } from 'hooks/useAudioList'
import { PlayerState } from 'lib'

interface AudioDialogContextProps {
  dialogState: RecordingDialogState
  audioData: any
  audioRef: any
  onRecordingStart?: () => void
  onRecordingFinished: () => void
  onCountdownFinished: () => void
  onDialogClosed: () => void
}

interface AudioDialogProviderProps {
  children: React.ReactNode
}

const AudioDialogContext = createContext<AudioDialogContextProps | undefined>(undefined)

export const useAudioDialog = () => {
  const context = useContext(AudioDialogContext)
  if (context === undefined) {
    throw new Error('useAudioDialog must be used within a AudioDialogProvider')
  }
  return context
}

export const AudioDialogProvider = ({ children }: AudioDialogProviderProps) => {
  const [dialogState, setDialogState] = useState<RecordingDialogState>(RecordingDialogState.START)
  const { audioRef, audioData, mediaRecorder, getMicrophoneAccess, removeMicrophoneAccess, clear } = useMediaAccess()
  const { setAllState } = useAudioList()

  const onRecordingStart = () => {
    setDialogState(RecordingDialogState.COUNTDOWN)
  }

  const onRecordingFinished = () => {
    if (audioData) {
      setDialogState(RecordingDialogState.UPLOAD)
    } else {
      setDialogState(RecordingDialogState.START)
    }
  }

  const onCountdownFinished = () => {
    setDialogState(RecordingDialogState.RECORD)
  }

  const onDialogClosed = () => {
    clear()
  }

  useEffect(() => {
    switch (dialogState) {
      case RecordingDialogState.COUNTDOWN:
        getMicrophoneAccess().catch(console.log)
        break
      case RecordingDialogState.UPLOAD:
        mediaRecorder?.stop()
        removeMicrophoneAccess()
        setAllState(PlayerState.STOP)
        break
      case RecordingDialogState.RECORD:
        setAllState(PlayerState.PLAY)
    }
  }, [dialogState])

  useEffect(() => {
    if (mediaRecorder && dialogState === RecordingDialogState.RECORD) mediaRecorder.start()
  }, [dialogState, mediaRecorder])

  return (
    <AudioDialogContext.Provider
      value={{
        audioRef,
        audioData,
        onCountdownFinished,
        dialogState,
        onRecordingStart,
        onRecordingFinished,
        onDialogClosed,
      }}
    >
      {children}
    </AudioDialogContext.Provider>
  )
}
