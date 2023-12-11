import { RecordingDialogState } from 'lib/RecordingDialogState'
import React, { createContext, useContext, useEffect, useState } from 'react'
import useMediaAccess from './useMediaAccess'
import { useAudioList } from 'hooks/useAudioList'
import { PlayerState } from 'lib'
import { Beat } from 'lib/Beat'
import d from 'data/beats.json'
interface AudioDialogContextProps {
  dialogState: RecordingDialogState
  audioData: any
  audioRef: any
  mediaStream: any
  beats: Beat[]
  activeBeats: Beat[]
  onRecordingStart: (voiceFlag: boolean) => void
  onRecordingFinished: () => void
  onCountdownFinished: () => void
  onDialogClosed: () => void
  onHandleBeatClicked: (clickedBeat: Beat) => void
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
  const [beats] = useState<Beat[]>(d as Beat[])
  const [activeBeats, setActiveBeats] = useState<Beat[]>([])

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
    setActiveBeats([])
    clear()
  }

  const onHandleBeatClicked = (clickedBeat: Beat) => {
    const isSameNameActive = activeBeats.some(beat => beat.name === clickedBeat.name)
    const isClickedBeatActive = activeBeats.some(beat => beat.id === clickedBeat.id)

    setActiveBeats(currentActiveBeats => {
      if (isSameNameActive) {
        if (isClickedBeatActive) {
          return currentActiveBeats.filter(beat => beat.id !== clickedBeat.id)
        } else {
          const filteredBeats = currentActiveBeats.filter(beat => beat.name !== clickedBeat.name)
          return [...filteredBeats, clickedBeat]
        }
      } else {
        return [...currentActiveBeats, clickedBeat]
      }
    })
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
        beats,
        activeBeats,
        onCountdownFinished,
        dialogState,
        onRecordingStart,
        onRecordingFinished,
        onDialogClosed,
        onHandleBeatClicked,
      }}
    >
      {children}
    </AudioDialogContext.Provider>
  )
}
