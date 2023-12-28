import { PlayIcon } from 'components/Icons/icons'
import { MoreIcon } from 'components/Icons/system'
import { LineageTokenMetadata } from 'lib/TokenMetadata'
import { useBoundStore } from 'store'

interface Prop {
  tokenId: string
  item: LineageTokenMetadata
}

const MusicItem = (prop: Prop) => {
  const { setModalState } = useBoundStore()

  const onHandleNftClicked = () => {
    setModalState({ player: { isOpen: true, nft: prop.item } })
  }

  return (
    <>
      <div className="cursor-pointer">
        <div className="group/item flex justify-between rounded-md" onClick={onHandleNftClicked}>
          <div className="flex gap-4 items-center">
            <div className="rounded-md flex items-center justify-center">
              <>
                <img src={prop.item.metadata.image} className="h-16 w-16 rounded-sm" />
                <div className="absolute invisible group-hover/item:visible">
                  <PlayIcon />
                </div>
              </>
            </div>
            <div>
              <div className="text-white text-lg font-semibold">{prop.item.metadata.name}</div>
              <div className="text-xs uppercase text-slate-400">
                {prop.item.nft.owners.length ?? 0} Collaborators | {prop.item.boost} BOOST
              </div>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <div className="flex items-center text-xs">
              <button
                className=""
                onClick={() =>
                  setModalState({ moreInfo: { isOpen: true, tokenId: prop.tokenId, metadata: prop.item } })
                }
              >
                <MoreIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default MusicItem
