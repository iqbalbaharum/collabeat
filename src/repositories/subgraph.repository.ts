import { useQuery } from '@tanstack/react-query'
import { RQ_KEY } from './'
import { ApolloClientFilter, apolloQuery } from 'services/apollo'
import { Sheet } from 'lib'
import { MintedNft, categorize, decodeMinted, format } from 'utils/subgraph.util'
import { formatDataKey } from 'utils'

const useGetSheets = (variables: ApolloClientFilter) => {
  const query = `
  query Forkeds($first: Int, $skip: Int, $where: Forked_filter) {
    forkeds(first: $first, skip: $skip, where: $where) {
      id
      owner: from
      token_id: tokenId
      data_key: dataKey
    }
  }
  `
  return useQuery({
    queryKey: [RQ_KEY.GET_SHEETS],
    queryFn: async () => {
      const response = await apolloQuery<any>({ query, variables })
      return response.data
    },
  })
}

const useGetBookmarkedSheets = (variables: ApolloClientFilter) => {
  const query = `
  query Minteds($where: CollaBeatNftMinted_filter) {
    collaBeatNftMinteds(where: $where) {
      id
      data
      to
      tokenId
    }
  }
  `
  return useQuery({
    queryKey: [RQ_KEY.GET_BOOKMARKED_SHEETS],
    queryFn: async () => {
      const { data } = await apolloQuery<any>({ query, variables })

      const formatted = data.collaBeatNftMinteds
        .map((nft: MintedNft) => {
          const formatted = format(nft)
          if (formatted !== null) return formatted
        })
        .filter((item: Sheet) => item !== undefined)

      return { beats: formatted } as { beats: Sheet[] }
    },
  })
}

const useCheckBookmarkedSheets = (address: string, token_id: string) => {
  const query = `
  query Minteds($first: Int, $skip: Int, $where: CollaBeatNftMinted_filter) {
    collaBeatNftMinteds(first: $first, skip: $skip, where: $where) {
      id
      data
      to
      tokenId
    }
  }
  `
  const variables = { where: { to: address, tokenId: token_id } }

  return useQuery({
    queryKey: [RQ_KEY.CHECK_BOOKMARKED_SHEETS],
    queryFn: async () => {
      const { data } = await apolloQuery<any>({ query, variables })
      const categorized = categorize(data.collaBeatNftMinteds as MintedNft[])

      const isOwned = categorized.length > 0
      if (!isOwned) return false

      const isBookmarked = categorized[0].data.length === 2
      return isBookmarked ? true : false
    },
  })
}

type MintedEvent = {
  tokenId: string
  id: string
  data: any
  transactionHash: string
  blockTimestamp: string
}

const useGetEvents = (variables: ApolloClientFilter) => {
  const query = `
  query Minteds($first: Int, $skip: Int, $where: Minted_filter) {
    minteds(first: $first, skip: $skip, where: $where) {
      tokenId
      id
      data
      transactionHash
      blockTimestamp
    }
  }
  `
  return useQuery({
    queryKey: [RQ_KEY.GET_SHEETS],
    queryFn: async () => {
      const { data } = await apolloQuery<{ minteds: MintedEvent[] }>({ query, variables })

      return data?.minteds?.map(el => {
        const [name, title] = decodeMinted(el.data)
        return {
          ...el,
          data: { name, title },
          data_key: formatDataKey(
            `${import.meta.env.VITE_DEFAULT_CHAIN_ID}`,
            `${import.meta.env.VITE_WEB3WALL_NFT}`,
            `${el.tokenId}`
          ),
        }
      })
    },
  })
}

export { useGetSheets, useGetBookmarkedSheets, useCheckBookmarkedSheets, useGetEvents }
