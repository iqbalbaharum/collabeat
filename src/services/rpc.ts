import rpc from 'adapter/jsonrpc'
import { Metadata } from 'lib'
import { formatDataKey } from 'utils'

export type RPCResponse<T> = {
  id: string
  jsonrpc: '2.0'
  result: {
    err_msg: string
    success: boolean
  } & T
}

export type NftMetadata = {
  attributes: Array<{ trait_type: string; value: string }>
  external_url: string
  description: string
  image: string
  name: string
}

export type JSONRPCFilter<C> = {
  query?: Array<{ column: keyof C; op: '='; query: string }>
  ordering?: Array<{ column: keyof C; sort: 'desc' | 'asc' }>
  from: number
  to: number
}

export type MetaContract = {
  public_key: string
  hash?: string
  cid?: string
  token_key: string
  meta_contract_id: string
}

export type Transaction = {
  alias: string
  chain_id: string
  data: string
  data_key?: string
  hash?: string
  mcdata: string
  meta_contract_id: string
  method: string
  public_key: string
  signature: string
  timestamp?: number
  status?: number
  token_address: string
  token_id: string
  token_key?: string
  version: string
}

const getMetadataAllVersion = (chain: String, address: String, token_id: String) => {
  const encoded_key = formatDataKey(chain, address, token_id)
  return rpc({
    method: 'POST',
    data: JSON.stringify({
      jsonrpc: '2.0',
      method: 'get_metadatas_all_version',
      params: [encoded_key],
      id: '1',
    }),
  })
}

const getMetadataUseKeyByBlock = async (nftKey: String, meta_contract_id: String, version: String) => {
  const response = await rpc({
    method: 'POST',
    data: JSON.stringify({
      jsonrpc: '2.0',
      method: 'get_metadatas_by_block',
      params: [nftKey, meta_contract_id, version],
      id: '1',
    }),
  })

  return response.data?.result as Metadata[]
}

const getMetadata = async (
  nftKey: String,
  metaContractId: String,
  publicKey: String,
  alias: String,
  version: String
) => {
  const response = await rpc({
    method: 'POST',
    data: JSON.stringify({
      jsonrpc: '2.0',
      method: 'get_metadata',
      params: [nftKey, metaContractId, publicKey, alias, version],
      id: '1',
    }),
  })

  return response.data?.result?.metadata as Metadata
}

const searchMetadatas = async (nftKey: String, meta_contract_id: String) => {
  const response = await rpc({
    method: 'POST',
    data: JSON.stringify({
      jsonrpc: '2.0',
      method: 'search_metadatas',
      params: {
        query: [
          {
            column: 'data_key',
            op: '=',
            query: nftKey,
          },
          {
            column: 'meta_contract_id',
            op: '=',
            query: meta_contract_id,
          },
          {
            column: 'loose',
            op: '=',
            query: '0',
          },
        ],
        ordering: [],
        from: 0,
        to: 0,
      },
      id: '1',
    }),
  })

  return response.data?.result?.metadatas
}

const getContentFromIpfs = (cid: String) => {
  return rpc({
    method: 'POST',
    data: JSON.stringify({
      jsonrpc: '2.0',
      method: 'ipfs_get',
      params: [cid],
      id: '1',
    }),
  })
}

const publish = async ({
  alias,
  chain_id,
  data,
  mcdata,
  meta_contract_id,
  method,
  public_key,
  signature,
  token_address,
  token_id,
  version,
}: Transaction) => {
  return await rpc({
    method: 'POST',
    data: JSON.stringify({
      jsonrpc: '2.0',
      method: 'publish',
      params: {
        alias,
        chain_id,
        data,
        mcdata,
        meta_contract_id,
        method,
        public_key,
        signature,
        token_address,
        token_id,
        version,
      },
      id: '1',
    }),
  })
}

const getMetaContractById = (meta_contract_id: string) => {
  return rpc({
    method: 'POST',
    data: JSON.stringify({
      jsonrpc: '2.0',
      method: 'get_meta_contract_by_id',
      params: [meta_contract_id],
      id: '1',
    }),
  })
}

const getCompleteTransactions = async (from = 0, to = 0) => {
  const response = await rpc({
    method: 'POST',
    data: JSON.stringify({
      jsonrpc: '2.0',
      method: 'get_complete_transactions',
      params: [from, to],
      id: '1',
    }),
  })

  return response.data?.result?.transactions
}

const getTransactions = async (filter: JSONRPCFilter<Transaction>) => {
  const response = await rpc({
    method: 'POST',
    data: JSON.stringify({
      jsonrpc: '2.0',
      method: 'get_transactions',
      params: filter,
      id: '1',
    }),
  })

  return response.data?.result?.transactions as Transaction[]
}

export default {
  getMetadataAllVersion,
  getMetadataUseKeyByBlock,
  getMetadata,
  getContentFromIpfs,
  publish,
  getMetaContractById,
  getCompleteTransactions,
  getTransactions,
  searchMetadatas,
}
