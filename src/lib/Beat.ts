export interface Beat {
  quadrant: '1st' | '2nd' | '3rd' | '4th' | '5th' | '6th' | '7th' | '8th'
  name: string
  type?: 'vox' | 'beat' | 'fx'
  url: string
}
