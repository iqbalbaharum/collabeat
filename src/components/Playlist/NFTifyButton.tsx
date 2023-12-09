import { CubeTransparentIcon } from '@heroicons/react/20/solid'
import GenericButton from 'components/Button/GenericButton'
import { NftifyIcon } from 'components/Icons/icons'
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

  return <GenericButton name="NFTify" icon={<NftifyIcon />} onClick={toggleNftifyMode} />
}

export default NFTifyButton
