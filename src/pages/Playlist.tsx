import GenericButton from 'components/Button/GenericButton'
import { PlayIcon } from 'components/Icons/icons'
import SearchInput from 'components/Input/Search'
import MarketplaceMore from 'components/Marketplace/More'
import MusicItem from 'components/MusicItem'
import MusicItemBuyDialog from 'components/MusicItem/BuyDialog'
import MusicItemSellDialog from 'components/MusicItem/SellDialog'
import { LineageTokenMetadata } from 'lib/TokenMetadata'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const json = [
  {
    tokenId: '0',
    name: 'CB #1',
    image: 'https://ipfs.io/ipfs/bafybeifr3goy55mfswo2tzhtkpvgiubgv5ib2ko6slfe6haegpctyawnai/2882.jpg',
  },
  {
    tokenId: '1',
    name: 'CB #2',
    image: 'https://ipfs.io/ipfs/bafybeifr3goy55mfswo2tzhtkpvgiubgv5ib2ko6slfe6haegpctyawnai/2882.jpg',
  },
  {
    tokenId: '2',
    name: 'CB #3',
    image: 'https://ipfs.io/ipfs/bafybeifr3goy55mfswo2tzhtkpvgiubgv5ib2ko6slfe6haegpctyawnai/2882.jpg',
  },
  {
    name: 'CB #4',
    image: 'https://ipfs.io/ipfs/bafybeifr3goy55mfswo2tzhtkpvgiubgv5ib2ko6slfe6haegpctyawnai/2882.jpg',
  },
]
const PagePlayList = () => {
  const [data, setData] = useState(json)

  return (
    <>
      <div className="w-full mx-auto">
        <div className="mt-5 w-full">
          <div className="mt-5 mb-2 border border-gray-700 rounded-md px-4 py-2.5 bg-white/10 backdrop-blur">
            <div className="flex gap-2 items-center">
              <GenericButton name="Top Beat" onClick={() => {}} />
              <GenericButton name="New Beat" onClick={() => {}} />
            </div>
          </div>
          <div className="w-full flex flex-col gap-3">
            {data.map((d, index) => (
              <MusicItem key={index} metadata={d as LineageTokenMetadata} tokenId={d.tokenId as string} />
            ))}
          </div>
        </div>
      </div>
      <MusicItemBuyDialog />
      <MusicItemSellDialog />
      <MarketplaceMore />
    </>
  )
}

export default PagePlayList
