import { useRef, useCallback, useState } from 'react'
import { replaceIpfsUrl } from 'utils/conversion'

export const usePlayer = () => {
  const audioSources = useRef<AudioBufferSourceNode[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const playingCount = useRef(0)

  const fetchAudioData = useCallback(async (url: string) => {
    const response = await fetch(url)
    return response.arrayBuffer()
  }, [])

  const playBeats = useCallback(
    async (beats: { owner: string; url: string }[]) => {
      if (isPlaying) {
        stopBeats()
      }

      const audioContext = new AudioContext()
      audioSources.current = []
      playingCount.current = beats.length

      for (const beat of beats) {
        const url = replaceIpfsUrl(beat.url)
        const audioData = await fetchAudioData(url)
        const audioBuffer = await audioContext.decodeAudioData(audioData)

        const source = audioContext.createBufferSource()
        source.buffer = audioBuffer
        source.connect(audioContext.destination)
        source.onended = () => {
          playingCount.current -= 1
          if (playingCount.current === 0) {
            setIsPlaying(false)
          }
        }
        source.start()
        audioSources.current.push(source)
      }

      setIsPlaying(true)
    },
    [fetchAudioData, replaceIpfsUrl]
  )

  const stopBeats = useCallback(() => {
    audioSources.current.forEach(source => {
      try {
        source.stop()
      } catch (error) {
        console.error('Error stopping beat:', error)
      }
    })
    audioSources.current = []
    playingCount.current = 0
    setIsPlaying(false)
  }, [])

  return { playBeats, stopBeats, isPlaying }
}
