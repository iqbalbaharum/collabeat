import GenericButton from 'components/Button/GenericButton'
import { PlayIcon } from 'components/Icons/icons'
import { MoreIcon } from 'components/Icons/system'
import { Nft } from 'lib'
import { Beat } from 'lib/Beat'
import { LineageTokenMetadata } from 'lib/TokenMetadata'
import { useBoundStore } from 'store'

interface Prop {
  tokenId: string
  metadata: LineageTokenMetadata
}

const MusicItem = (prop: Prop) => {
  const { setModalState } = useBoundStore()

  return (
    <>
      <div className="px-3 py-1.5 cursor-pointer">
        <div className="group/item flex justify-between rounded-md">
          <div className="flex gap-4 items-center">
            <div className="h-12 w-12 rounded-md flex items-center justify-center">
              <>
                <img src={prop.metadata.image} className="h-12 w-12 rounded-md" />
                <div className="absolute invisible group-hover/item:visible">
                  <PlayIcon />
                </div>
              </>
            </div>
            <div>
              <div className="text-white text-sm">{prop.metadata.name}</div>
              <div className="text-xs uppercase text-gray-500">2 Collaborators | 8 VOTES</div>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <div className="flex items-center text-xs">
              <button
                className=""
                onClick={() =>
                  setModalState({ moreInfo: { isOpen: true, tokenId: prop.tokenId, metadata: prop.metadata } })
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
