import { CubeTransparentIcon } from '@heroicons/react/24/solid'
import { AlertMessageContext } from 'hooks/use-alert-message'
import { useConnectedWallet } from 'hooks/use-connected-wallet'
import { useAudioList } from 'hooks/useAudioList'
import { SelectedAudio } from 'lib'
import { useContext } from 'react'
import { useBoundStore } from 'store'

interface Prop {
  nftKey: string
}

const NFTifyButton = (prop: Prop) => {
  const { filteredData } = useAudioList()
  const { address } = useConnectedWallet()
  const { showError } = useContext(AlertMessageContext)
  const { setModalState } = useBoundStore()

  const toggleNftifyMode = () => {
    if (!address) {
      showError('Connect your wallet to nftify this beat')
      return
    }

    const selections: SelectedAudio[] = []

    filteredData.forEach(audio => {
      selections.push({
        owner: audio.key,
        data_key: prop.nftKey,
        cid: audio.data,
      } as SelectedAudio)
    })

    setModalState({ nftify: { isOpen: true, selections } })
  }

  return (
    <>
      <>
        <button
          className={`from-20% flex h-20 w-20 flex-col items-center justify-center rounded-sm bg-gradient-to-t from-[#F5517B] to-[#FEDC00] p-2 text-xs font-bold text-white md:hover:scale-105`}
          onClick={() => toggleNftifyMode()}
        >
          <CubeTransparentIcon />
          <span>NFTify</span>
        </button>
      </>
    </>
  )
}

export default NFTifyButton
