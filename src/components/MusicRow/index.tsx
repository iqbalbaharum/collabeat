//unused file
//@ts-nocheck 
import React, { useState, useRef, useEffect } from 'react'
import { PlayIcon, PauseIcon } from '@heroicons/react/24/solid'

import voice from '../../assets/img/voice.png'
import voice2 from '../../assets/img/voice2.png'
import voicelong from '../../assets/img/voicelong.png'
import voice1 from '../../assets/img/Vector.png'
import mute from '../../assets/icon/mute.png'

interface Music {
  name: String
  description: String
  beatAmount: String
  audioUrls: Array<string>
  handleClick: () => void
}

const MusicRow = ({ name, description, beatAmount, audioUrls, handleClick }: Music) => {
  const [playing2, setPlaying2] = useState(false)
  const [globalSources, setGlobalSources] = useState([])
  // let playing = false

  const handleReplay = async () => {
    // const audios = []
    // const audioJSON = []
    // for (var item of audioUrls) {
    //   const audio = new Audio(item)
    //   audios.push(audio)
    //   console.log(audio)
    //   audioJSON.push({
    //     duration: audio.duration,
    //   })
    // }
    // for (var item2 of audios) {
    //   item2.play()
    // }
    // console.log(audioJSON)

    // console.log(playing)
    // setPlaying(true)

    if (playing2) {
      // playing = false
      setPlaying2(false)
      stopAudios()
    } else {
      // playing = true
      setPlaying2(true)
      const context = new AudioContext()

      const buffers: AudioBuffer[] = []

      Promise.all(audioUrls.map(url => fetch(url)))
        .then(responses => Promise.all(responses.map(response => response.arrayBuffer())))
        .then(arrayBuffers => Promise.all(arrayBuffers.map(buffer => context.decodeAudioData(buffer))))
        .then(decodedBuffers => {
          playAudios(buffers, context, decodedBuffers)
        })
        .catch(error => console.error(error))
    }
  }

  const stopAudios = () => {
    globalSources.forEach(source => source.stop())
    setGlobalSources([])
  }

  const playAudios = (buffers, context, decodedBuffers) => {
    buffers.push(...decodedBuffers)

    // Create an array of audio sources and connect them to the destination
    const sources = buffers.map(buffer => {
      const source = context.createBufferSource()
      source.buffer = buffer
      source.connect(context.destination)
      return source
    })

    // Start playing all sources at the same time
    sources.forEach(source => source.start(0))
    setGlobalSources(sources)

    // // Create two audio sources and connect them to the destination
    // const source1 = context.createBufferSource()
    // const source2 = context.createBufferSource()

    // source1.buffer = buffers[0]
    // source2.buffer = buffers[1]

    // source1.connect(context.destination)
    // source2.connect(context.destination)

    // // Start playing the sources at the same time
    // source1.start(0)
    // source2.start(0)

    // // Find the length of the longest audio file
    const longestDuration = Math.max(...buffers.map(buffer => buffer.duration))

    // Wait for the longest audio file to finish playing before restarting
    setTimeout(() => {
      buffers = []
      // if (playing2) {
      //   playAudios(buffers, context, decodedBuffers)
      // }
      setPlaying2(false)
    }, longestDuration * 1000)
  }

  return (
    // <article className="rounded-xl bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 p-0.5 shadow-xl transition hover:shadow-sm">
    //   <div className="rounded-[10px] bg-white p-4 !pt-20 sm:p-6">
    //     {/* <time className="block text-xs text-gray-500">{name}</time> */}

    //     <a href="#">
    //       <h3 className="mt-0.5 text-lg font-medium text-gray-900">{name}</h3>
    //     </a>

    //     <div className="mt-4 flex flex-wrap gap-1">
    //       <a
    //         className="inline-block rounded bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-[2px] hover:text-white focus:outline-none focus:ring active:text-opacity-75"
    //         href="#"
    //       >
    //         <span className="block rounded-sm bg-transparent px-8 py-3 text-sm font-medium" onClick={handleClick}>
    //           Collaborate
    //         </span>
    //       </a>

    //       <a
    //         className="inline-block rounded bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-[2px] hover:text-white focus:outline-none focus:ring active:text-opacity-75"
    //         href="#"
    //       >
    //         <span className="block rounded-sm bg-transparent px-8 py-3 text-sm font-medium">Mint</span>
    //       </a>
    //     </div>
    //   </div>
    // </article>
    <div>
      <div className="flex w-full flex-row items-center justify-between">
        <div className="flex flex-row items-center">
          <div className="h-[50px] w-[50px] bg-[#EF326C]" />
          <div className="Inter ml-2 text-base font-semibold leading-5 text-[#F5517B]">{name}</div>
        </div>
        <div className="Inter text-base font-medium leading-5 text-white">{beatAmount} Beats</div>
        <div className="flex flex-row items-center">
          <div className="px-3" onClick={() => handleReplay()}>
            {/* <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-6 w-6 rounded-full bg-gradient-to-b from-[#F5517B] to-[#7423A7] p-1"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                          clipRule="evenodd"
                        />
                      </svg> */}
            <div className="h-6 w-6 rounded-full bg-gradient-to-b from-[#F5517B] to-[#7423A7] p-1">
              {playing2 ? <PauseIcon /> : <PlayIcon />}
            </div>
          </div>
          {/* <audio controls src="">
                      <a href=">Download audio</a>
                    </audio> */}
          <div className="flex flex-row gap-x-1">
            <img src={voice.src} alt="" />
            <img src={voice2.src} alt="" />
            <img src={voice2.src} alt="" />
            <img src={voice.src} alt="" />
            <img src={voice2.src} alt="" />
          </div>
          <div className="Inter px-3 text-sm font-normal text-white">3:00</div>
        </div>
        <div className="flex flex-row ">
          <button
            type="button"
            className="Inter mr-2 rounded-lg bg-[#D45BFF] px-4 py-2 text-base font-medium leading-5 text-white"
          >
            Mint
          </button>
          <button
            type="button"
            className="Inter rounded-lg border border-[#B1B1B1] bg-white px-4 py-2 text-base font-medium leading-5 text-[#303030] "
            onClick={handleClick}
          >
            Collaborate
          </button>
        </div>
      </div>

      <hr className="my-6 border-b border-[#E9E9E9]" />
    </div>
  )
}

export default MusicRow
