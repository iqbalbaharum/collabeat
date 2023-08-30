import { ApolloClient, InMemoryCache, gql } from '@apollo/client'
import { Sheet } from 'lib'
import { keccak256 } from '@ethersproject/keccak256'

export const client = new ApolloClient({
  uri: import.meta.env.VITE_COLLABEAT_SUBGRAPH_API_URL,
  cache: new InMemoryCache(),
})

type MintedNft = {
  data: string
  id: string
  to: string
  tokenId: string
  transactionHash: string
}

const get_sheets_query = `
query Forkeds($first: Int, $skip: Int, $where: Forked_filter) {
  forkeds(first: $first, skip: $skip, where: $where) {
    id
    owner: from
    token_id: tokenId
    data_key: dataKey
  }
}
`

const check_if_bookmarked_query = `
query Minteds($where: CollaBeatNftMinted_filter) {
  collaBeatNftMinteds(where: $where) {
    id
    data
    to
    tokenId
  }
}
`

const get_bookmarked_sheets_query = `
query Minteds($first: Int, $skip: Int, $where: CollaBeatNftMinted_filter) {
  collaBeatNftMinteds(first: $first, skip: $skip, where: $where) {
    id
    data
    to
    tokenId
  }
}
`
const format = (minted: MintedNft) => {
  // generate data_key & update data structure
  try {
    const contract_address = `${import.meta.env.VITE_COLLABEAT_NFT}`.toLowerCase()
    const tokenId: string = minted.tokenId 
    const chainId : string = import.meta.env.VITE_CHAIN_ID as string

    const input = `${contract_address}${tokenId}${chainId}`
    const data_key = keccak256(input).substring(2) // substring to remove "0x"

    return { id: minted.id, data_key: data_key, token_id: minted.tokenId, owner: minted.to }
  } catch (e) {
    console.log(e)
  }

  return null
}

export const get_sheets = async (variables: {
  first: number
  skip?: number
  where?: { to?: string; from: string }
}) => {
  const { data } = await client.query({ query: gql(get_sheets_query), variables })
  return { beats: data.forkeds } as { beats: Sheet[] }
}

const categorize = (data: MintedNft[]) => {
  /* 
  1. Get all unique tokenId values from the array;
  2. Initialize the final result array;
  3. Loop through unique tokenIds;
  4. Filter objects with the current tokenId and sort based on data field length (asc order);
     value for data field saved as "0x" when bookmarking beats; if minted nft are both remixed & bookmarked,
     sorted array will be [{tokenId: 5, data: "0x"}, {tokenId: 5, data: "0x7FD87T..."}]
  5. Remove duplicate by pushing first element into final result array.
 */

  const uniqueTokenIds = [...new Set(data.map(obj => obj.tokenId))]
  const uniqueValues = []

  for (const tokenId of uniqueTokenIds) {
    const filteredArray = data.filter(obj => obj.tokenId === tokenId).sort((a, b) => a.data.length - b.data.length)

    const seenTokenId = new Set()
    for (const obj of filteredArray) {
      if (!seenTokenId.has(obj.tokenId)) {
        seenTokenId.add(obj.tokenId)
        uniqueValues.push(obj)
      }
    }
  }

  return uniqueValues
}

export const get_bookmarked_sheets = async (variables: { first: number; skip?: number; where?: { to: string } }) => {
  const { data } = await client.query({ query: gql(get_bookmarked_sheets_query), variables })

  const formatted = data.collaBeatNftMinteds
    .map((nft: MintedNft) => {
      const formatted = format(nft)
      if (formatted !== null) return formatted
    })
    .filter((item:Sheet) => item !== undefined)

  return { beats: formatted } as { beats: Sheet[] }
}

export const check_if_bookmarked = async (address: string, token_id: string) => {
  const variables = { where: { to: address, tokenId: token_id } }
  const { data } = await client.query({ query: gql(check_if_bookmarked_query), variables })
  const categorized = categorize(data.collaBeatNftMinteds as MintedNft[])

  const isOwned = categorized.length > 0
  if (!isOwned) return false

  const isBookmarked = categorized[0].data.length === 2
  return isBookmarked ? true : false
}
