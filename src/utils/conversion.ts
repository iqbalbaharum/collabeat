export function replaceIpfsUrl(url: string) {
  if (url.startsWith('ipfs://')) {
    return url.replace('ipfs://', `${import.meta.env.VITE_IPFS_BEAT_STORAGE_URL}/`)
  }
  return url
}
