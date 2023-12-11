import { AudioState, PlayerState } from 'lib'
import React, { createContext, useContext, useEffect, useState } from 'react'

interface AudioListContextProps {
  filteredData: AudioState[]
  finishedCounter: number
  canRecord: boolean
  loadAudios: (audios: AudioState[]) => void
  // setFilteredData: (data: AudioState[]) => void
  setAllMuted: (muted: boolean) => void
  setAllState: (state: PlayerState) => void
  onToggleSound: (state: AudioState) => void
}

export const AudioListContext = createContext<AudioListContextProps | undefined>(undefined)

interface AudioListProviderProps {
  children: React.ReactNode
}

export const AudioListProvider = ({ children }: AudioListProviderProps) => {
  const [filteredData, setFilteredData] = useState<AudioState[]>([])
  const [finishedCounter, setFinishedCounter] = useState(-1)
  const [canRecord, setCanRecord] = useState(false)

  const loadAudios = (audios: AudioState[]) => {
    setFilteredData(audios)
    setCanRecord(filteredData.length <= 10)
  }

  const setAllState = (state: PlayerState) => {
    setFilteredData(prev =>
      prev.map(audio => {
        return { ...audio, playerState: state }
      })
    )

    if (state === PlayerState.PLAY) setFinishedCounter(filteredData.length)
    if (state === PlayerState.STOP) setFinishedCounter(-1)
  }

  const setAllMuted = (muted: boolean) => {
    setFilteredData(prev =>
      prev.map(audio => {
        return { ...audio, isMuted: muted }
      })
    )
  }

  const onToggleSound = (state: AudioState) => {
    const index = filteredData.findIndex(item => item.key === state.key)
    const updatedData = [...filteredData]

    updatedData[index] = {
      ...updatedData[index],
      isMuted: !state.isMuted,
    }

    setFilteredData(updatedData)
  }

  const onFinishCounter = () => {
    setFinishedCounter(prev => prev - 1)
  }

  useEffect(() => {
    if (finishedCounter === 0) setAllState(PlayerState.STOP)
  }, [finishedCounter, setAllState])

  return (
    <AudioListContext.Provider
      value={{
        loadAudios,
        canRecord,
        filteredData,
        // setFilteredData,
        setAllState,
        setAllMuted,
        finishedCounter,
        onToggleSound,
      }}
    >
      {children}
    </AudioListContext.Provider>
  )
}

export const useAudioList = () => {
  const context = useContext(AudioListContext)
  if (context === undefined) {
    throw new Error('useAudioList must be used within a AudioListProvider')
  }
  return context
}
