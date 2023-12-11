import LoadingIndicator from 'components/LoadingIndicator'
import Waveform from 'components/Waveform'
import { useAudioList } from 'hooks/useAudioList'
import { AudioState, PlayerState } from 'lib'
import { useEffect, useState } from 'react'
import { useGetBeatsByVersion } from 'repositories/rpc.repository'

interface Prop {
  nftKey: string
  version: string
}
const PlaylistList = (prop: Prop) => {
  const [isLoad, setIsLoad] = useState(false)

  const { data: audios } = useGetBeatsByVersion(prop.nftKey, prop.version)
  const { filteredData, loadAudios, onToggleSound } = useAudioList()
  useEffect(() => {
    if (audios && !isLoad) {
      const filteredData: AudioState[] = []
      for (const meta of audios) {
        filteredData.push({
          key: meta.public_key,
          data: meta.data,
          isMuted: false,
          playerState: PlayerState.STOP,
        } as AudioState)
      }
      loadAudios(filteredData)
      setIsLoad(true)
    }
  }, [audios, isLoad, loadAudios])
  return (
    <>
      <div className="w-full">
        {filteredData.length > 0 || isLoad ? (
          filteredData.map((audioState, key) => {
            if (audioState.data) {
              return (
                <div key={key} className="border-1 m-1 h-[90px] rounded-lg bg-[#181818] px-8 py-2 text-left">
                  <div className="mb-2 whitespace-nowrap text-gray-400 text-sm">{audioState.key.toString()}</div>
                  <div className="h-1/2 w-full">
                    <Waveform
                      url={audioState.data as string}
                      playerState={audioState.playerState}
                      isMuted={audioState.isMuted}
                      onToggleSound={() => onToggleSound(audioState)}
                      isSelecting={false}
                      isSelected={audioState.selected}
                      // onFinish={() => setFinishedCounter(prev => prev - 1)}
                    />
                  </div>
                </div>
              )
            }
          })
        ) : (
          <LoadingIndicator text={'Fetching data...'} />
        )}
      </div>
    </>
  )
}

export default PlaylistList
