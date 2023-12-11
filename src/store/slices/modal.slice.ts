import { StateCreator } from 'zustand'
import { resetters } from '..'
import { SelectedAudio } from 'lib'
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
  buyVote: ModalState & { tokenId: string }
  sellVote: ModalState & { tokenId: string }
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
    buyVote: { isOpen: false, tokenId: '' },
    sellVote: { isOpen: false, tokenId: '' },
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
