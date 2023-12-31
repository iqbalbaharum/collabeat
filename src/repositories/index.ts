import { QueryKey, useQueryClient } from '@tanstack/react-query'

export function useGetQueryData<T>(key: QueryKey): T {
  return useQueryClient().getQueryData(key) as T
}

export enum RQ_KEY {
  GET_COMPLETED_TXS = 'get_complete_transactions',
  GET_TXS = 'get_transactions',
  PUBLISH_TX = 'publish_transaction',
  POSTS = 'posts',
  GET_BOOKMARKED_SHEETS = 'get_bookmarked_sheets',
  CHECK_BOOKMARKED_SHEETS = 'check_bookmarked_sheets',
  GET_NFTS = 'get_nfts',
  GET_METADATA_BY_BLOCK = 'get_metadata_by_block',
  GET_BEATS_BY_VERSION = 'get_beats_by_version',
  GET_NFT_METADATA = 'get_nft_metadata',
  GET_NFT_METADATA_TOKEN = 'get_nft_metadata_token',
}
