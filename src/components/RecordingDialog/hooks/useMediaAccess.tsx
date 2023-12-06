import { useEffect, useRef, useState } from 'react'

const useMediaAccess = () => {
  const [mediaStream, setMediaStream] = useState<MediaStream>()
  const [chunks, setChunks] = useState<Blob[]>([])
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [audioData, setAudioData] = useState<{ blob: Blob | null; url: string }>({
    blob: null,
    url: '',
  })
  const audioRef = useRef(new Audio())

  const getMicrophoneAccess = async () => {
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

  const removeMicrophoneAccess = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop())
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
      const blob = new Blob(chunks, { type: 'audio/mpeg' })
      const url = URL.createObjectURL(blob)
      setAudioData({
        blob,
        url,
      })

      audioRef.current.src = url
    }
  }, [chunks])

  return { audioRef, mediaStream, mediaRecorder, audioData, getMicrophoneAccess, removeMicrophoneAccess, clear }
}

export default useMediaAccess
