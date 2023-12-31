export interface MusicItemData {
  metadata: MusicItemMetadata
  latestPrice: number
  owners: string[]
}

export interface MusicItemMetadata {
  beats: MusicItemBeat[]
  name: string
  description: string
  image: string
}

export interface MusicItemBeat {
  owner: string
  url: string
}
