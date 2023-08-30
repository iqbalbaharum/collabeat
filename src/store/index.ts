import { create } from 'zustand';
import { ModalSlice, createModalSlice } from './slices/modal.slice';
import { WalletSlice, createWalletSlice } from './slices/wallet.slice';

type ResetAllSlices = { resetAllSlices: () => void };
type BoundStoreType = ModalSlice & ResetAllSlices & WalletSlice;

export const resetters: (() => void)[] = [];

export const useBoundStore = create<BoundStoreType>()((...a) => ({
  ...createModalSlice(...a),
  ...createWalletSlice(...a),
  resetAllSlices: () => resetters.forEach(resetter => resetter()),
}));
