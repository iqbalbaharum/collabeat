import { PlayerState } from './PlayerState'

export interface AudioState {
  key: String
  data: any
  isMuted: boolean
  playerState: PlayerState
  selected?: boolean
}
