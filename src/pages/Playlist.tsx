import GenericButton from 'components/Button/GenericButton'
import MarketplaceMore from 'components/Marketplace/More'
import MusicItem from 'components/MusicItem'
import MusicItemBuyDialog from 'components/MusicItem/BuyDialog'
import MusicItemSellDialog from 'components/MusicItem/SellDialog'
import Player from 'components/Player'
import { LineageTokenMetadata } from 'lib/TokenMetadata'
import { useState } from 'react'
import { useGetNfts } from 'repositories/token.repository'

const PagePlayList = () => {
  const { data } = useGetNfts(10, 0)

  return (
    <>
      <div className="w-full mx-auto h-full px-4">
        <div className="mt-5 w-full">
          {/* <div className="mt-5 mb-2 border border-gray-700 rounded-md px-4 py-2.5 bg-white/10 backdrop-blur">
            <div className="flex gap-2 items-center">
              <GenericButton name="Top Beat" onClick={() => {}} />
              <GenericButton name="New Beat" onClick={() => {}} />
            </div>
          </div> */}
          <div className="w-full flex flex-col gap-3 lg:gap-4">
            {/* {data && data.map((d, index) => (
              <MusicItem key={index} metadata={d as LineageTokenMetadata} tokenId={d.tokenId as string} />
            ))} */}
          </div>
        </div>
      </div>
      <MusicItemBuyDialog />
      <MusicItemSellDialog />
      <MarketplaceMore />
      <Player />
    </>
  )
}

export default PagePlayList
