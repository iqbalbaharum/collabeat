import apiMoralisInstance from "adapter/moralis"

export const getNftsByWalletAddress = (address:string, chain: string) => {
  return apiMoralisInstance({
    method: 'GET',
    url: `/${address}/nft?chain=${chain}&format=decimal&media_items=false`
  })
}