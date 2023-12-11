import { ethers } from 'ethers'
import { useCallback, useState } from 'react'
import RPC from 'utils/ethers'
import contractABI from 'data/collabeat_abi.json'

const useSubscription = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const subscribe = useCallback(async (tokenId: string, amount: number) => {
    setIsLoading(true)
    setError('')

    try {
      const rpc = new RPC((window as any).ethereum)

      const supply: string = await rpc.readContractData({
        contractABI,
        contractAddress: import.meta.env.VITE_NOUS_AIFI as string,
        method: 'keySupply',
        data: [tokenId],
      })

      let subscribePrice = '0'

      if (Number(supply) > 0) {
        const price: string = await rpc.readContractData({
          contractABI,
          contractAddress: import.meta.env.VITE_NOUS_AIFI as string,
          method: 'getBuyPriceAfterFee',
          data: [tokenId, amount.toString()],
        })

        subscribePrice = price === '0' ? `0` : price.toString()
      }

      await rpc.callContractMethod({
        contractABI,
        contractAddress: import.meta.env.VITE_NOUS_AIFI as string,
        method: 'buyKey',
        data: [tokenId, amount.toString()],
        options: {
          value: subscribePrice,
        },
      })
    } catch (error: any) {
      console.log(error)
      setError(error.reason as string)
      throw new Error(error.reason as string)
    } finally {
      setIsLoading(false)
    }
  }, [])

  //Unsubscribe
  const unsubscribe = useCallback(async (tokenId: string, amount: number) => {
    setIsLoading(true)
    setError('')

    try {
      const ethersProvider = new ethers.BrowserProvider((window as any).ethereum)
      const signer = await ethersProvider.getSigner()
      const contract = new ethers.Contract(import.meta.env.VITE_NOUS_AIFI as string, contractABI, signer)
      const tx = await contract.sellKey(tokenId, amount.toString())
      await tx.wait()
    } catch (error: any) {
      console.log(error)
      setError(error.reason as string)
      throw new Error(error.reason as string)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { subscribe, unsubscribe, isLoading, error }
}

export default useSubscription
