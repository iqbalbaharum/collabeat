import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import rpc, { JSONRPCFilter, NftMetadata, Transaction } from '../services/rpc'
import { useIpfs } from 'hooks/use-ipfs'
import { RQ_KEY } from 'repositories'
import { formatDataKey } from 'utils'

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
        await queryClient.invalidateQueries([RQ_KEY.GET_POSTS])
        if (timeout) clearTimeout(timeout)
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

const useGetPosts = (nft_key: string) => {
  return useQuery({
    queryKey: [RQ_KEY.GET_POSTS],
    queryFn: async () => {
      const result = await rpc.searchMetadatas(nft_key, `${import.meta.env.VITE_META_CONTRACT_ID}`)

      const promises = result?.map(async (curr: any) => {
        const res = await rpc.getContentFromIpfs(curr.cid as string)
        const content = JSON.parse(res.data.result.content as string)
        const data = content.content as { text: string; image: string }

        return {
          ...data,
          public_key: curr.public_key,
          timestamp: content.timestamp as number,
        }
      })

      const results = await Promise.all(promises)

      return results
    },
  })
}

const useGetMetadataBlock = (nftKey: string) => {
  return useQuery({
    queryKey: [RQ_KEY.GET_METADATA_BY_BLOCK, nftKey],
    queryFn: async () => {
      const result = await rpc.searchMetadatas(nftKey, `${import.meta.env.VITE_META_CONTRACT_ID}`)

      const promises = result?.map(async (curr: any) => {
        const res = await rpc.getContentFromIpfs(curr.cid as string)
        const content = JSON.parse(res.data.result.content as string)
        const data = content.content as { text: string; image: string }

        return {
          ...data,
          public_key: curr.public_key,
          timestamp: content.timestamp as number,
        }
      })

      const results = await Promise.all(promises)

      return results
    },
  })
}

export {
  useGetCompleteTransactions,
  useGetTransactions,
  usePublishTransaction,
  useStoreBlob,
  useGetPosts,
  useGetMetadataBlock,
}
