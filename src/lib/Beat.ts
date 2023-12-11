export interface Beat {
  id: number
  quadrant: '1st' | '2nd' | '3rd' | '4th' | '5th' | '6th' | '7th' | '8th'
  name: string
  type?: string
  url: string
}
