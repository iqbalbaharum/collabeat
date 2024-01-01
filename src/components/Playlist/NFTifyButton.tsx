import AccentButton from 'components/Button/AccentButton'
import { NftifyIcon } from 'components/Icons/icons'
import { AlertMessageContext } from 'hooks/use-alert-message'
import { useConnectedWallet } from 'hooks/use-connected-wallet'
import { useAudioList } from 'hooks/useAudioList'
import { SelectedAudio } from 'lib'
import { MusicItemMetadata } from 'lib/MusicItem'
import { LineageTokenMetadata } from 'lib/TokenMetadata'
import { useContext } from 'react'
import { useBoundStore } from 'store'

interface Prop {
  nftKey: string
  nft: LineageTokenMetadata
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

    setModalState({ nftify: { isOpen: true, selections, dataKey: prop.nftKey, nft: prop.nft } })
  }

  return <AccentButton className="text-yellow-800" name="NFTify" icon={<NftifyIcon />} onClick={toggleNftifyMode} />
}

export default NFTifyButton
