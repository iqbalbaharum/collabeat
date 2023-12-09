export interface LineageTokenMetadata {
  attributes: Array<{ trait_type: string; value: string }>
  external_url?: string
  description?: string
  image: string
  name: string
  token: LineageNftToken
}

export interface LineageNftToken {
  address: string
  chain: string
  id: string
}
