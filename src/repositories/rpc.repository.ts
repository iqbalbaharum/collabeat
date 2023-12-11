import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import rpc, { JSONRPCFilter, NftMetadata, Transaction } from '../services/rpc'
import { useIpfs } from 'hooks/use-ipfs'
import { RQ_KEY } from 'repositories'
import { formatDataKey } from 'utils'
import { LineageNftToken, LineageTokenMetadata } from 'lib/TokenMetadata'

const useGetCompleteTransactions = () => {
  return useQuery({
    queryKey: [RQ_KEY.GET_COMPLETED_TXS],
    queryFn: async () => {
      return await rpc.getCompleteTransactions()
    },
    retry: false,
  })
}

export type DataTypeMetadata = {
  type: 'metadata'
  data: NftMetadata
}

export type DataTypeMedia = {
  type: 'image' | 'audio'
  data: string
}

export type DataTypeNone = {
  type: 'none'
  data: string
}

export async function parseString(input: string): Promise<DataTypeMetadata | DataTypeNone | DataTypeMedia> {
  try {
    const parsed = JSON.parse(input)
    if (typeof parsed === 'object') return { type: 'metadata', data: parsed }
  } catch (e) {
    /* empty */
  }

  try {
    const response = await fetch(input)
    const contentType = response.headers.get('content-type')
    if (contentType?.startsWith('image/')) return { type: 'image', data: input }
    if (contentType?.startsWith('audio/')) return { type: 'audio', data: input }
  } catch (e) {
    /* empty */
  }

  return { type: 'none', data: input }
}

const useGetTransactions = (data: JSONRPCFilter<Transaction> & { address?: `0x${string}` | undefined }) => {
  const { address, ...filter } = data

  return useQuery({
    queryKey: [RQ_KEY.GET_TXS],
    queryFn: async () => {
      return await rpc.getTransactions(filter)
    },
  })
}

const usePublishTransaction = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Transaction) => {
      return await rpc.publish(data)
    },
    onSuccess: () => {
      let timeout: NodeJS.Timeout
      // eslint-disable-next-line prefer-const
      timeout = setTimeout(async () => {
        // await queryClient.invalidateQueries([RQ_KEY.GET_POSTS])
        // if (timeout) clearTimeout(timeout)
      }, 5000)
    },
  })
}

const useStoreBlob = () => {
  const { ipfs } = useIpfs()

  return useMutation({
    mutationFn: async (blob: Blob) => {
      const resp = await ipfs?.storeBlob(blob)
      const url = `${import.meta.env.VITE_IPFS_NFT_STORAGE_URL}/${resp}`
      return url
    },
  })
}

const useGetMetadataBlock = (nftKey: string) => {
  return useQuery({
    queryKey: [RQ_KEY.GET_METADATA_BY_BLOCK, nftKey],
    queryFn: async () => {
      const result = await rpc.searchMetadatas({
        query: [
          {
            column: 'data_key',
            op: '=',
            query: nftKey,
          },
          {
            column: 'meta_contract_id',
            op: '=',
            query: import.meta.env.VITE_META_CONTRACT_ID as string,
          },
        ],
      })

      const promises = result?.map(async (curr: any) => {
        const res = await rpc.getContentFromIpfs(curr.cid as string)
        const content = JSON.parse(res.data.result.content as string)
        const data = content.content as { text: string; image: string }

        return {
          data,
          version: curr.version,
          public_key: curr.public_key,
          timestamp: content.timestamp as number,
        }
      })

      const results = await Promise.all(promises)

      return results
    },
    enabled: nftKey.length > 0,
  })
}

const useGetBeatsByVersion = (nftKey: string, version: string) => {
  return useQuery({
    queryKey: [RQ_KEY.GET_BEATS_BY_VERSION, nftKey, version],
    queryFn: async () => {
      const result = await rpc.searchMetadatas({
        query: [
          {
            column: 'data_key',
            op: '=',
            query: nftKey,
          },
          {
            column: 'meta_contract_id',
            op: '=',
            query: import.meta.env.VITE_META_CONTRACT_ID as string,
          },
          {
            column: 'version',
            op: '=',
            query: version,
          },
        ],
      })

      const promises = result?.map(async (curr: any) => {
        const res = await rpc.getContentFromIpfs(curr.cid as string)
        const content = JSON.parse(res.data.result.content as string)
        const data = content.content as { text: string; image: string }

        return {
          data,
          version: curr.version,
          public_key: curr.public_key,
          timestamp: content.timestamp as number,
        }
      })

      const results = await Promise.all(promises)

      return results
    },
    enabled: nftKey.length > 0,
  })
}

const useGetNftMetadata = (data_key: string) => {
  return useQuery<LineageTokenMetadata>({
    queryKey: [RQ_KEY.GET_NFT_METADATA, data_key],
    queryFn: async () => {
      const nft_metadata = await rpc.getMetadata(
        data_key,
        '0x01',
        import.meta.env.VITE_CB_METADATA_PK.toLowerCase() as String,
        '',
        data_key
      )

      const content = await rpc.getContentFromIpfs(nft_metadata.cid)
      return JSON.parse(content.data.result.content as string).content as LineageTokenMetadata
    },
    enabled: Boolean(data_key),
  })
}

const useGetNftToken = (dataKey: string) => {
  return useQuery<LineageNftToken>({
    queryKey: [RQ_KEY.GET_NFT_METADATA_TOKEN, dataKey],
    queryFn: async () => {
      const nft_metadata = await rpc.getMetadata(dataKey, '0x01', '0x01', 'token', dataKey)

      const content = await rpc.getContentFromIpfs(nft_metadata.cid)
      return JSON.parse(content.data.result.content as string).content as LineageNftToken
    },
    enabled: Boolean(dataKey),
  })
}

export {
  useGetCompleteTransactions,
  useGetTransactions,
  usePublishTransaction,
  useStoreBlob,
  useGetMetadataBlock,
  useGetBeatsByVersion,
  useGetNftMetadata,
  useGetNftToken,
}
