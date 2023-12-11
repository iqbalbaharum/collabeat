import { StateCreator } from 'zustand'
import { resetters } from '..'
import { Nft, SelectedAudio } from 'lib'
import { LineageTokenMetadata } from 'lib/TokenMetadata'

export type ModalState = {
  isOpen: boolean
  isSkipped?: boolean
}

export type Modal = {
  signUpMain: ModalState
  signUpRainbow: ModalState
  audioRecording: ModalState & { chainId: string; address: string; tokenId: string; version: string }
  nftify: ModalState & { selections: SelectedAudio[]; dataKey: string; nft: LineageTokenMetadata | undefined }
}

export interface ModalSlice {
  modal: Modal
  setModalState: (modal: Partial<Modal>) => void
  resetModal: () => void
}

const initialModal = {
  modal: {
    signUpMain: { isOpen: false },
    signUpRainbow: { isOpen: false },
    audioRecording: { isOpen: false, chainId: '', address: '', tokenId: '', version: '' },
    nftify: { isOpen: false, selections: [], dataKey: '', nft: undefined },
  },
}

export const createModalSlice: StateCreator<ModalSlice, [], [], ModalSlice> = set => {
  resetters.push(() => set(initialModal))

  return {
    ...initialModal,
    setModalState: (modal: Partial<Modal>) => {
      set(state => ({
        modal: Object.assign(state.modal, modal),
      }))
    },
    resetModal: () => {
      set({ ...initialModal })
    },
  }
}
