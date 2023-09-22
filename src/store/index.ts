import { create } from 'zustand'
import { ModalSlice, createModalSlice } from './slices/modal.slice'
import { WalletSlice, createWalletSlice } from './slices/wallet.slice'
import { NFTSlice, createNFTSlice } from './slices/nft.slice'

type ResetAllSlices = { resetAllSlices: () => void }
type BoundStoreType = ModalSlice & ResetAllSlices & WalletSlice & NFTSlice

export const resetters: (() => void)[] = []

export const useBoundStore = create<BoundStoreType>()((...a) => ({
  ...createModalSlice(...a),
  ...createWalletSlice(...a),
  ...createNFTSlice(...a),
  resetAllSlices: () => resetters.forEach(resetter => resetter()),
}))
