import { AbiCoder } from 'ethers'
import { formatDataKey } from 'utils'

export type MintedNft = {
  data: string
  id: string
  to: string
  tokenId: string
  transactionHash: string
}

export function decodeMinted(data: string) {
  const abiCoder = new AbiCoder()
  if (data.length < 32 * 2) {
    return ['', '']
  }

  const [_, bytes] = abiCoder.decode(['string', 'bytes'], data)
  return abiCoder.decode(['string', 'string'], bytes)
}

export const format = (minted: MintedNft) => {
  // generate data_key & update data structure
  try {
    const contract_address = `${import.meta.env.VITE_COLLABEAT_NFT}`.toLowerCase()
    const tokenId: string = minted.tokenId
    const chainId: string = import.meta.env.VITE_CHAIN_ID as string

    const data_key = formatDataKey(chainId, contract_address, tokenId)

    return { id: minted.id, data_key: data_key, token_id: minted.tokenId, owner: minted.to }
  } catch (e) {
    console.log(e)
  }

  return null
}

export const categorize = (data: MintedNft[]) => {
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
