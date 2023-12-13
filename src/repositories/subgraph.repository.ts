import { useQuery } from '@tanstack/react-query'
import { RQ_KEY } from './'
import { ApolloClientFilter, apolloQuery } from 'services/apollo'
import { Sheet } from 'lib'
import { formatDataKey } from 'utils'
import { NftToken } from 'lib/NftToken'

const useGetNfts = (variables: ApolloClientFilter) => {
  const query = `
  query Tokens($first: Int, $skip: Int, $where: Minted_filter) {
    tokens(first: $first, skip: $skip, where: $where) {
      tokenId
      id
      data
      transactionHash
      blockTimestamp
    }
  }
  `
  return useQuery({
    queryKey: [RQ_KEY.GET_NFTS],
    queryFn: async () => {
      const { data } = await apolloQuery<{ tokens: NftToken[] }>({ query, variables })

      // return data?.minteds?.map(el => {
      //   const [name, title] = decodeMinted(el.data)
      //   return {
      //     ...el,
      //     data: { name, title },
      //     data_key: formatDataKey(
      //       `${import.meta.env.VITE_DEFAULT_CHAIN_ID}`,
      //       `${import.meta.env.VITE_WEB3WALL_NFT}`,
      //       `${el.tokenId}`
      //     ),
      //   }
      // })
    },
  })
}

export { useGetNfts }
