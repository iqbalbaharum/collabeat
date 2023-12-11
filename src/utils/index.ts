import { SHA256 } from 'crypto-js'
import { encode } from 'bs58'

export * from './abbreviate-balance'

export function getSongLength(arrayOfAudioBuffers: AudioBuffer[]) {
  let totalLength = 0

  for (const track of arrayOfAudioBuffers) {
    if (track.length > totalLength) {
      totalLength = track.length
    }
  }

  return totalLength
}

export function mixAudioBuffer(
  bufferList: AudioBuffer[],
  totalLength: number,
  numberOfChannels = 2,
  context: AudioContext
) {
  //create a buffer using the totalLength and sampleRate of the first buffer node
  const finalMix = context.createBuffer(numberOfChannels, totalLength, bufferList[0].sampleRate)

  //first loop for buffer list
  for (let i = 0; i < bufferList.length; i++) {
    // second loop for each channel ie. left and right
    for (let channel = 0; channel < numberOfChannels; channel++) {
      //here we get a reference to the final mix buffer data
      const buffer = finalMix.getChannelData(channel)

      //last is loop for updating/summing the track buffer with the final mix buffer
      for (let j = 0; j < bufferList[i].length; j++) {
        buffer[j] += bufferList[i].getChannelData(channel)[j]
      }
    }
  }

  return finalMix
}

export const createMixedAudio = async (audioContext: AudioContext, dataKey: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_LINEAGE_NODE_URL}metadata/${dataKey}`)
  const metadata = await res.json()

  const urls = []
  for (const [key, value] of Object.entries(metadata)) {
    if (key.startsWith('0x')) urls.push(value)
  }

  const promises = urls.map(url =>
    fetch(url as URL)
      .then(response => response.arrayBuffer())
      .then(buffer => audioContext.decodeAudioData(buffer))
  )

  const buffers = await Promise.all(promises)

  const songLength = getSongLength(buffers)
  const mixed = mixAudioBuffer(buffers, songLength, 1, audioContext)

  return mixed
}
export function classNames(...classes: (false | null | undefined | string)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function getRandomInt(min: number, max: number) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function shortenAddress(address: string, n = 4) {
  if (!address) return ''
  if (n < 1 || n >= address?.length) {
    return address
  }

  const firstNChars = address.slice(0, n + 2)
  const lastNChars = address.slice(-n)

  return `${firstNChars}...${lastNChars}`
}

const units = ['k', 'm', 'b', 't']
function toPrecision(number: number, precision = 1) {
  return number
    .toString()
    .replace(new RegExp(`(.+\\.\\d{${precision}})\\d+`), '$1')
    .replace(/(\.[1-9]*)0+$/, '$1')
    .replace(/\.$/, '')
}

export function abbreviateETHBalance(number: number) {
  if (number < 1) return toPrecision(number, 3)
  if (number < 10 ** 2) return toPrecision(number, 2)
  if (number < 10 ** 4) return new Intl.NumberFormat().format(parseFloat(toPrecision(number, 1)))
  const decimalsDivisor = 10 ** 1
  let result = String(number)
  for (let i = units.length - 1; i >= 0; i--) {
    const size = 10 ** ((i + 1) * 3)
    if (size <= number) {
      number = (number * decimalsDivisor) / size / decimalsDivisor
      result = toPrecision(number, 1) + units[i]
      break
    }
  }
  return result
}

export const catchAsync = async <T, A>(asyncFunction: (args: A) => Promise<T>, args: A): Promise<T> => {
  const result = await asyncFunction(args)
  return result
}

export function networkToChainId(chain: string) {
  let chainId = ''
  switch (chain.toLowerCase()) {
    case 'homestead':
      chainId = '1'
      break
    case 'matic':
      chainId = '137'
      break
    case 'bsc':
      chainId = '56'
      break
    case 'arbitrum':
      chainId = '42161'
      break
    case '42220':
      chainId = '42220'
      break
    case 'solana':
      chainId = 'solana'
      break
    case 'near':
      chainId = 'near'
      break
    case 'mumbai':
      chainId = '80001'
      break
    default:
      break
  }

  return chainId
}

export function chainIdToNetwork(chain: string) {
  switch (chain) {
    case 'eth':
    case '1':
      return 'homestead'
    case '137':
      return 'matic'
    case '56':
      return 'bsc'
    case '42161':
      return 'arbitrum'
    case 'celo':
    case '42220':
      return 'celo'
    case 'sol':
    case 'solana':
      return 'solana'
    case 'near':
      return 'near'
    case '80001':
      return 'mumbai'
    default:
      return ''
  }
}
export function formatDataKey(chain_id: String, address: String, token_id: String) {
  const input = `${chain_id}${address?.toLowerCase()}${token_id}`
  const sha256Hash = SHA256(input).toString()
  const uint8Array = hexToUint8Array(sha256Hash)
  return encode(uint8Array)
}

function hexToUint8Array(hexString: String): Uint8Array {
  if (hexString.length % 2 !== 0) {
    throw new Error('Invalid hex string')
  }
  const arrayBuffer = new Uint8Array(hexString.length / 2)

  for (let i = 0; i < hexString.length; i += 2) {
    const byteValue = parseInt(hexString.substr(i, 2), 16)
    arrayBuffer[i / 2] = byteValue
  }

  return arrayBuffer
}

export function formatTokenKey(chain_id: String, address: String) {
  const input = `${chain_id}${address}`
  const sha256Hash = SHA256(input).toString()
  const uint8Array = hexToUint8Array(sha256Hash)
  return encode(uint8Array)
}

export function timeAgo(timestamp: number): string {
  const secondsPast = (Date.now() - timestamp) / 1000

  if (secondsPast < 60) {
    return `${Math.floor(secondsPast)} seconds ago`
  }
  if (secondsPast < 3600) {
    return `${Math.floor(secondsPast / 60)} minutes ago`
  }
  if (secondsPast <= 86400) {
    return `${Math.floor(secondsPast / 3600)} hours ago`
  }
  if (secondsPast > 86400) {
    const days = Math.floor(secondsPast / 86400)
    return `${days} day${days !== 1 ? 's' : ''} ago`
  }

  return ''
}

const camelToSnakeCase = (str: string) => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)

export function convertCamelToSnakeCase(obj: Record<string, any>) {
  if (typeof obj === 'object' && obj !== null) {
    if (Array.isArray(obj)) {
      for (let i = 0; i < obj.length; i++) {
        obj[i] = convertCamelToSnakeCase(obj[i])
      }
    } else {
      const newObj: Record<string, any> = {}
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          const newKey = camelToSnakeCase(key)
          newObj[newKey] = convertCamelToSnakeCase(obj[key])
        }
      }
      return newObj
    }
  }
  return obj
}

const snakeToCamelCase = (str: string) => str.replace(/(\_\w)/g, k => k[1].toUpperCase())

export function convertSnakeToCamelCase(obj: Record<string, any>) {
  if (typeof obj === 'object' && obj !== null) {
    const newObj: Record<string, any> = {}
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const newKey = snakeToCamelCase(key)
        newObj[newKey] = convertSnakeToCamelCase(obj[key])
      }
    }
    return newObj
  }

  return obj
}
