export const defineBeatColorByQuadrant = (quadrant: string) => {
  switch (quadrant) {
    case '1st':
      return 'bg-blue-600'
    case '2nd':
      return 'bg-red-400'
    case '3rd':
      return 'bg-yellow-500'
    case '4th':
      return 'bg-orange-400'
    case '5th':
      return 'bg-green-500'
    case '6th':
      return 'bg-green-800'
    case '7th':
      return 'bg-purple-500'
    case '8th':
      return 'bg-slate-500'
    default:
      return 'bg-white'
  }
}

export const defineTextColorByQuadrant = (quadrant: string) => {
  switch (quadrant) {
    case '1st':
      return 'text-blue-600'
    case '2nd':
      return 'text-red-400'
    case '3rd':
      return 'text-yellow-500'
    case '4th':
      return 'text-orange-400'
    case '5th':
      return 'text-green-500'
    case '6th':
      return 'text-green-800'
    case '7th':
      return 'text-purple-500'
    case '8th':
      return 'text-slate-500'
    default:
      return 'text-black'
  }
}
