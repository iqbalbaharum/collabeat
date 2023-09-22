import { StateCreator } from 'zustand'
import { resetters } from '..'
import { Transaction } from 'services/rpc'

type NFTType = Partial<Transaction> & { metadata?: Record<any, string> }

export interface NFTSlice {
  nft: NFTType
  setNFTState: (nft: Partial<NFTType>) => void
  resetNFT: () => void
}

const initialNFT = {
  nft: {
    chain_id: '',
    token_address: '',
    token_id: '',
    metadata: {},
    data_key: undefined,
    version: undefined,
  },
}

export const createNFTSlice: StateCreator<NFTSlice, [], [], NFTSlice> = set => {
  resetters.push(() => set(initialNFT))

  return {
    ...initialNFT,
    setNFTState: nft => {
      set(state => ({
        nft: Object.assign(state.nft, nft),
      }))
    },
    resetNFT: () => {
      set({ ...initialNFT })
    },
  }
}
