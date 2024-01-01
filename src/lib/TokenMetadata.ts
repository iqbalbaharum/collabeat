import { Metadata } from './Metadata'
import { Token } from './Token'

export interface OpenseaMetadata {
  name: string
  image: string
  description: string
  attributes: Array<{ trait_type: string; value: string }>
  version: string
}
export interface LineageTokenMetadata {
  owner: string
  token_address: string
  token_id: string
  chain_id: string
  dataKey: string
  latestPrice: number
  metadata: OpenseaMetadata
  lineage: Metadata
  token: LineageNftToken
  beats: {}
  boost: number
  nft: Token
  name: string
}

export interface LineageNftToken {
  address: string
  chain: string
  id: string
}
