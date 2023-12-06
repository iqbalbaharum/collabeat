import { StateCreator } from 'zustand'
import { resetters } from '..'
import { SelectedAudio } from 'lib'

export type ModalState = {
  isOpen: boolean
  isSkipped?: boolean
}

export type Modal = {
  signUpMain: ModalState
  signUpRainbow: ModalState
  audioRecording: ModalState
  nftify: ModalState & { selections: SelectedAudio[] }
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
    audioRecording: { isOpen: false },
    nftify: { isOpen: false, selections: [] },
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
