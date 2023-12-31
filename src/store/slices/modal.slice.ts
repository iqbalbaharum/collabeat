import { StateCreator } from 'zustand'
import { resetters } from '..'
import { SelectedAudio } from 'lib'
import { LineageTokenMetadata } from 'lib/TokenMetadata'
import { NftToken } from 'lib/NftToken'
import { MusicItemData } from 'lib/MusicItem'

export type ModalState = {
  isOpen: boolean
  isSkipped?: boolean
}

export type Modal = {
  signUpMain: ModalState
  signUpRainbow: ModalState
  audioRecording: ModalState & { chainId: string; address: string; tokenId: string; version: string }
  nftify: ModalState & { selections: SelectedAudio[]; dataKey: string; nft: LineageTokenMetadata | undefined }
  moreInfo: ModalState & { tokenId: string; metadata: MusicItemData | undefined }
  user: ModalState
  buyVote: ModalState & { tokenId: string }
  sellVote: ModalState & { tokenId: string }
  player: ModalState & { nft: LineageTokenMetadata | undefined }
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
    user: { isOpen: false },
    buyVote: { isOpen: false, tokenId: '' },
    sellVote: { isOpen: false, tokenId: '' },
    moreInfo: { isOpen: false, tokenId: '', metadata: undefined },
    player: { isOpen: false, nft: undefined },
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
