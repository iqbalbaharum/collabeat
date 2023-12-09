import GenericButton from 'components/Button/GenericButton'
import { PlayIcon } from 'components/Icons/icons'
import { Nft } from 'lib'
import { Beat } from 'lib/Beat'

interface Prop {
  beat: { name: string; owner: string }
}

const MusicItem = (prop: Prop) => {
  return (
    <>
      <div className="group/item flex justify-between px-4 py-2.5 bg-white/10 hover:bg-slate-300/10 cursor-pointer backdrop-blur rounded-md">
        <div className="flex gap-2 items-center">
          <div className="p-2 rounded-full invisible group-hover/item:visible">
            <PlayIcon />
          </div>
          <div className="h-12 w-12 bg-white/10 rounded-md"></div>
          <div>
            <div className="font-semibold text-yellow-400">{prop.beat.name}</div>
            <div className="text-xs uppercase text-gray-500">{prop.beat.owner}</div>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <div className="flex items-center">0.022 ETH</div>
          <div className="flex gap-2">
            <GenericButton name="Buy" onClick={() => {}} />
            <GenericButton name="Sell" onClick={() => {}} />
          </div>
        </div>
      </div>
    </>
  )
}

export default MusicItem
