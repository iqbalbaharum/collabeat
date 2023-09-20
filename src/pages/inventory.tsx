import { useApi } from 'hooks/use-api'
import { Nft } from 'lib'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { networkToChainId } from 'utils'
import { useNetwork } from 'wagmi'

const PageInventory = () => {
  const navigate = useNavigate()
  const { getNftsByWalletAddress } = useApi()

  const [nfts, setNfts] = useState<Nft[]>([])
  const [hasRead, setHasRead] = useState(false)

  const { chain } = useNetwork()

  useEffect(() => {
    const fetchNfts = async () => {
      if (!chain) {
        return
      }
      try {
        const response = await getNftsByWalletAddress('0x5Ce6B303b0d2BCA7Ce9B724Ba10210D1684c6b02', 'binance')

        const nfts = response.data.result.map((d: { token_address: any; token_id: any; metadata: string }) => {
          const meta = JSON.parse(d.metadata)
          if (meta.image.startsWith('ipfs://')) {
            meta.image = meta.image.replace('ipfs://', 'https://ipfs.io/ipfs/')
          }

          return {
            address: d.token_address,
            token_id: d.token_id,
            chain_id: networkToChainId(chain?.network),
            metadata: meta,
          }
        }) as Nft[]

        setNfts(nfts)
        setHasRead(true)
      } catch (e) {
        console.log(e)
      }
    }

    if (!hasRead) {
      if (!chain) {
        return
      }
      fetchNfts()
    }
  }, [hasRead, nfts, getNftsByWalletAddress, chain])

  return (
    <div className="flex justify-center">
      <div className="block w-5/6 md:w-full lg:w-3/4 mx-4">
        <div className="bg-[#181818] rounded p-4">
          <div className="bg-[#181818] rounded p-4">
            <div className="text-2xl font-semibold mb-4">Explore NFTs</div>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 lg:grid-cols-4">
              {nfts.map((nft, index) => (
                <div
                  key={index}
                  className="text-sm border border-transparent hover:bg-gray-100 hover:text-black p-2 rounded-lg cursor-pointer"
                  onClick={() => navigate(`/nft`, { state: { nft } })}
                >
                  <img
                    className="rounded-lg w-full bg-white object-cover h-48 hover:scale-105 transition duration-500"
                    src={(nft.metadata as any).image}
                    alt={(nft.metadata as any).name}
                  />
                  <div className="font-semibold mt-2 truncate">{(nft.metadata as any).name}</div>
                  <div className="">Ethereum</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PageInventory
