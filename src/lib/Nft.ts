export interface Nft {
  owner: string
  token_address: string
  token_id: string | number
  chain_id: string
  metadata: Record<string, any>
}
