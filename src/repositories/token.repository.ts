import { useQuery } from '@tanstack/react-query'
import { RQ_KEY } from '.'
import { getBeatNFTsByPage } from 'services/music'
import { formatDataKey } from 'utils'
import { fetchBeats } from './rpc.repository'

const useGetNfts = (size: number, page = 0) => {
  return useQuery({
    queryKey: [RQ_KEY.GET_NFTS],
    queryFn: async () => {
      const { data } = await getBeatNFTsByPage({ skip: page, first: size })
      console.log(data)
      const tokenIds = data.tokens.map((nft: any) => nft.tokenId)

      for (let i = 0; i < tokenIds.length; i++) {
        const tokenId = tokenIds[i]
        fetchBeats(tokenId)
      }

      return { data, next: page * size }
    },
  })
}

export { useGetNfts }
