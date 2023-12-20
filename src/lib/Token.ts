export interface Token {
  tokenId: string
  latestPrice: number
  owners: User[]
}

export interface User {
  user: { id: string }
}
