import { useQuery } from '@tanstack/react-query'
import { RQ_KEY } from '.'
import { getBeatNFTsByPage } from 'services/music'
import { getCbNftMetadata } from './rpc.repository'
import { MusicItemData } from 'lib/MusicItem'

const useGetNfts = (size: number, page = 0) => {
  return useQuery({
    queryKey: [RQ_KEY.GET_NFTS],
    queryFn: async () => {
      const { data } = await getBeatNFTsByPage({ skip: page, first: size })
      const nftDataMap: { [tokenId: string]: Partial<MusicItemData> } = {}
      data.tokens.forEach(nft => {
        nftDataMap[nft.tokenId] = {
          latestPrice: nft.latestPrice,
          owners: nft.owners.map(owner => {
            return (owner as any).user?.id
          }),
        }
      })

      const promises = data.tokens.map(nft =>
        getCbNftMetadata(nft.tokenId).then(metadata => ({
          tokenId: nft.tokenId,
          ...metadata,
          ...nftDataMap[nft.tokenId],
        }))
      )

      const tokens = await Promise.all(promises)
      return { data: tokens, next: page * size }
    },
  })
}

export { useGetNfts }
