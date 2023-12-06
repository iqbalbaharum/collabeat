import { RecordingDialogState } from 'lib/RecordingDialogState'
import React, { createContext, useContext, useEffect, useState } from 'react'
import useMediaAccess from './useMediaAccess'
import { useAudioList } from 'hooks/useAudioList'
import { PlayerState } from 'lib'

interface AudioDialogContextProps {
  dialogState: RecordingDialogState
  onRecordingStart?: () => void
  onRecordingFinished: () => void
  onCountdownFinished: () => void
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

  const { audioData, mediaRecorder, getMicrophoneAccess, removeMicrophoneAccess } = useMediaAccess()
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
    <AudioDialogContext.Provider value={{ onCountdownFinished, dialogState, onRecordingStart, onRecordingFinished }}>
      {children}
    </AudioDialogContext.Provider>
  )
}
