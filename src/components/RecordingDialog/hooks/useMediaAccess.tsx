import { useEffect, useRef, useState } from 'react'
import * as Tone from 'tone'

const useMediaAccess = () => {
  const [mediaStream, setMediaStream] = useState<any>()
  const [chunks, setChunks] = useState<Blob[]>([])
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | Tone.Recorder | null>(null)
  const [audioData, setAudioData] = useState<{ blob: Blob | null; url: string }>({
    blob: null,
    url: '',
  })
  const audioRef = useRef(new Audio())

  const initTone = () => {
    const audioContext = Tone.getContext()
    const mediaStreamDestination = audioContext.createMediaStreamDestination()
    const recorder = new MediaRecorder(mediaStreamDestination.stream)
    setChunks([])

    recorder.ondataavailable = event => {
      setChunks(prev => [...prev, event.data])
    }

    setMediaRecorder(recorder)
    setMediaStream(mediaStreamDestination)
  }

  const initVoiceAccess = async () => {
    try {
      const constraints = {
        audio: { autoGainControl: false, echoCancellation: false, noiseSuppression: false },
        video: false,
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)

      const recorder = new MediaRecorder(stream)
      setChunks([])

      recorder.ondataavailable = event => {
        setChunks(prev => [...prev, event.data])
      }

      setMediaRecorder(recorder)
      setMediaStream(stream)
    } catch (ex) {
      console.log(ex)
    }
  }

  const deinitVoiceAccess = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track: { stop: () => any }) => track.stop())
      setMediaStream(undefined)
    }
  }

  const clear = () => {
    setAudioData({
      blob: null,
      url: '',
    })
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.src = ''
    }
  }

  useEffect(() => {
    if (chunks.length > 0) {
      const blob = new Blob(chunks, { type: 'audio/wav' })
      const url = URL.createObjectURL(blob)
      setAudioData({
        blob,
        url,
      })

      audioRef.current.src = url
    }
  }, [chunks])

  return { audioRef, mediaStream, mediaRecorder, audioData, initTone, initVoiceAccess, deinitVoiceAccess, clear }
}

export default useMediaAccess
