import { useCallback, useEffect, useState } from 'react'
import RPC from 'utils/ethers'
import collabeatAbi from 'data/collabeat_abi.json'

const useMint = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [mintPrice, setMintPrice] = useState('')
  const [error, setError] = useState('')

  const getMintPrice = useCallback(async () => {
    setIsLoading(true)

    try {
      const rpc = new RPC((window as any).ethereum)
      const price = await rpc.readContractData({
        contractABI: collabeatAbi,
        contractAddress: import.meta.env.VITE_COLLABEAT as string,
        method: 'mintPrice',
        data: [],
      })

      setMintPrice(price.toString())
    } catch (error: any) {
      setError(error.reason as string)
      throw new Error(error.reason as string)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!mintPrice) {
      getMintPrice().catch(console.log)
    }
  }, [getMintPrice, mintPrice])
  return { mintPrice, isLoading, error }
}

export default useMint
