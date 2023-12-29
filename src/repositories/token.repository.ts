import { useQuery } from '@tanstack/react-query'
import { RQ_KEY } from '.'
import { getBeatNFTsByPage } from 'services/music'
import { createDefaultMetadata, fetchBeats } from './rpc.repository'

const useGetNfts = (size: number, page = 0) => {
  return useQuery({
    queryKey: [RQ_KEY.GET_NFTS],
    queryFn: async () => {
      const { data } = await getBeatNFTsByPage({ skip: page, first: size })
      const tokenIds = data.tokens.map((nft: any) => nft.tokenId)

      const promises = []

      for (let i = 0; i < tokenIds.length; i++) {
        const tokenId = tokenIds[i]
        promises.push(fetchBeats(tokenId))
      }

      let resolved = await Promise.all(promises)

      const mapped = resolved.map(el => {
        const { beats, lineage, boost, tokenId } = el
        let json = createDefaultMetadata(`${tokenId}`)
        let nft = data.tokens.find(d => d.tokenId === el.tokenId)

        if (nft) json.nft = nft
        if (beats) json.beats = beats
        if (lineage) json.lineage = lineage
        if (boost) json.boost = boost

        return json
      })

      return { data: mapped, next: page * size }
    },
  })
}

export { useGetNfts }
