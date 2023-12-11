import { ethers } from 'ethers'
import { useCallback, useEffect, useState } from 'react'
import RPC from 'utils/ethers'
import collabeatAbi from 'data/collabeat_abi.json'

interface Prop {
  tokenId: string
  amount: number
}

const useGetBuyPrice = ({ tokenId, amount }: Prop) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [buyPrice, setBuyPrice] = useState('0')
  const [buyPriceAfterTax, setBuyPriceAfterTax] = useState('0')

  const getBuyPrice = useCallback(async () => {
    setIsLoading(true)
    setError('')

    if (amount == 0) {
      setBuyPrice(`0`)
      return
    }

    try {
      const rpc = new RPC((window as any).ethereum)

      const price: string = await rpc.readContractData({
        contractABI: collabeatAbi,
        contractAddress: import.meta.env.VITE_NOUS_AIFI as string,
        method: 'getBuyPrice',
        data: [tokenId, amount.toString()],
      })

      const subscribePrice = price === '0.0' ? `0` : ethers.formatEther(price.toString())
      setBuyPrice(subscribePrice.toString())
    } catch (error: any) {
      setError(error.reason as string)
      throw new Error(error.reason as string)
    } finally {
      setIsLoading(false)
    }
  }, [amount, tokenId])

  const getBuyPriceAfterTax = useCallback(async () => {
    setIsLoading(true)
    setError('')

    if (amount == 0) {
      setBuyPrice(`0`)
      return
    }

    try {
      const rpc = new RPC((window as any).ethereum)

      const price: string = await rpc.readContractData({
        contractABI: collabeatAbi,
        contractAddress: import.meta.env.VITE_NOUS_AIFI as string,
        method: 'getBuyPriceAfterFee',
        data: [tokenId, amount.toString()],
      })

      const subscribePrice = price === '0' ? `0` : ethers.formatEther(price.toString())
      setBuyPriceAfterTax(subscribePrice.toString())
    } catch (error: any) {
      setError(error.reason as string)
      throw new Error(error.reason as string)
    } finally {
      setIsLoading(false)
    }
  }, [amount, tokenId])

  useEffect(() => {
    const timer = setTimeout(async () => {
      await getBuyPrice().catch(console.log)
      await getBuyPriceAfterTax().catch(console.log)
    }, 1000)

    return () => clearTimeout(timer)
  }, [getBuyPrice, getBuyPriceAfterTax])

  return { buyPrice, buyPriceAfterTax, isLoading, error }
}

export default useGetBuyPrice
