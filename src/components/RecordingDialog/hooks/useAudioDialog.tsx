import { RecordingDialogState } from 'lib/RecordingDialogState'
import React, { createContext, useContext, useEffect, useState } from 'react'
import useMediaAccess from './useMediaAccess'
import { useAudioList } from 'hooks/useAudioList'
import { PlayerState } from 'lib'

interface AudioDialogContextProps {
  dialogState: RecordingDialogState
  audioData: any
  audioRef: any
  mediaStream: any
  onRecordingStart: (voiceFlag: boolean) => void
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
  const [isVoice, setIsVoice] = useState(false)
  const { audioRef, mediaStream, audioData, mediaRecorder, initTone, initVoiceAccess, deinitVoiceAccess, clear } =
    useMediaAccess()
  const { setAllState } = useAudioList()

  const onRecordingStart = (voiceFlag: boolean) => {
    setIsVoice(voiceFlag)
    if (isVoice) {
      initVoiceAccess().catch(console.log)
    } else {
      initTone()
    }
    setDialogState(RecordingDialogState.COUNTDOWN)
  }

  const onRecordingFinished = () => {
    if (audioData) {
      setDialogState(RecordingDialogState.UPLOAD)
      if (isVoice) {
        deinitVoiceAccess()
      }
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
        break
      case RecordingDialogState.UPLOAD:
        mediaRecorder?.stop()
        setAllState(PlayerState.STOP)
        break
      case RecordingDialogState.RECORD:
        setAllState(PlayerState.PLAY)
    }
  }, [dialogState])

  useEffect(() => {
    if (mediaRecorder && dialogState === RecordingDialogState.RECORD) {
      mediaRecorder.start()
    }
  }, [dialogState, mediaRecorder])

  return (
    <AudioDialogContext.Provider
      value={{
        audioRef,
        audioData,
        mediaStream,
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
