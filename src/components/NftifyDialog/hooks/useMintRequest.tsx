import { useCallback, useState } from 'react'
import RPC from 'utils/ethers'
import contractABI from 'data/collabeat_abi.json'
import { ethers } from 'ethers'

const useMintRequest = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const nftify = useCallback(async (dataKey: string, name: string, cid: string) => {
    setIsLoading(true)

    try {
      const rpc = new RPC((window as any).ethereum)
      const price = await rpc.readContractData({
        contractABI,
        contractAddress: import.meta.env.VITE_COLLABEAT as string,
        method: 'mintPrice',
        data: [],
      })

      const ethersProvider = new ethers.BrowserProvider((window as any).ethereum)
      const signer = await ethersProvider.getSigner()
      const contract = new ethers.Contract(import.meta.env.VITE_COLLABEAT as string, contractABI, signer)
      const tx = await contract.mintRequest(
        dataKey,
        '',
        name,
        (import.meta.env.VITE_IPFS_FORK_MULTIADDRESS as string) ?? '',
        cid,
        {
          value: price,
        }
      )
      await tx.wait()
    } catch (error: any) {
      setError(error.reason as string)
      throw new Error(error.reason as string)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { nftify, isLoading, error }
}

export default useMintRequest
