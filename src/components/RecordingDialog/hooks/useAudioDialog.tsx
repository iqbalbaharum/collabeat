import { RecordingDialogState } from 'lib/RecordingDialogState'
import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import useMediaAccess from './useMediaAccess'
import { useAudioList } from 'hooks/useAudioList'
import { PlayerState } from 'lib'
import { Beat } from 'lib/Beat'
import d from 'data/beats.json'
import * as Tone from 'tone'
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
  clearBeats: () => void
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
  const playersRef = useRef<Map<number, Tone.Player>>(new Map())
  // const scheduleIDsRef = useRef(new Map())

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
    clearBeats()
  }

  const onCountdownFinished = () => {
    setDialogState(RecordingDialogState.RECORD)
  }

  const onDialogClosed = () => {
    clearBeats()
  }

  const clearBeats = () => {
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
    beats.forEach(beat => {
      const player = new Tone.Player({ url: beat.url, loop: true }).toDestination()
      playersRef.current.set(beat.id, player)
    })

    return () => {
      playersRef.current.forEach(player => player.dispose())
    }
  }, [beats])

  useEffect(() => {
    if (Tone.Transport.state !== 'started') {
      // Tone.Transport.bpm.value = 120
      // Tone.Transport.timeSignature = [4, 4]
      Tone.Transport.debug = false
      Tone.Transport.start()
      Tone.start().catch(console.log)
    }

    if (Tone.Transport.state === 'started') {
      playersRef.current.forEach((player, id) => {
        const isBeatActive = activeBeats.some(beat => beat.id === id)
        if (isBeatActive && player.state !== 'started') {
          /// This time sycnronization messed up the beats
          /// For now it's left here for future integration
          // if (activeBeats.length == 1) {
          //   player.start()
          // } else {
          //   const scheduleID: number = scheduleIDsRef.current.get(id)
          //   if (!scheduleID) {
          //     const scheduleId = Tone.Transport.scheduleRepeat(time => {
          //       player.sync().start(time)
          //     }, '16n')
          //     scheduleIDsRef.current.set(id, scheduleId.toString())
          //   }
          // }
          player.start()
        } else if (!isBeatActive && player.state === 'started') {
          // if (activeBeats.length <= 0) {
          //   player.sync().stop()
          // } else {
          //   const scheduleID: number = scheduleIDsRef.current.get(id)
          //   if (scheduleID.toString()) {
          //     player.sync().stop()
          //     Tone.Transport.clear(scheduleID)
          //     scheduleIDsRef.current.delete(id)
          //   }
          // }
          player.stop()
        }
      })
    }

    if (mediaStream) {
      playersRef.current.forEach(player => player.connect(mediaStream))
    }
  }, [activeBeats, mediaStream])

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
        clearBeats,
      }}
    >
      {children}
    </AudioDialogContext.Provider>
  )
}
