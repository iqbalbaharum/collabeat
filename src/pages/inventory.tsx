import { Nft } from 'lib'
import { useNavigate } from 'react-router-dom'
import { useGetNftByWalletAddress } from 'repositories/moralis.repository'
import { useBoundStore } from 'store'
import { networkToChainId } from 'utils'
import { useNetwork } from 'wagmi'

const PageInventory = () => {
  const navigate = useNavigate()
  let { chain } = useNetwork()
  const { setNFTState } = useBoundStore()

  const { data: nfts } = useGetNftByWalletAddress({
    address: '0x5Ce6B303b0d2BCA7Ce9B724Ba10210D1684c6b02',
    chain:
      chain?.network === 'maticmum'
        ? networkToChainId('mumbai')
        : Boolean(chain?.network)
        ? networkToChainId(chain?.network as string)
        : '',
  })

  const goToNftPage = (nft: Nft) => {
    setNFTState({ ...nft, token_id: `${nft.token_id}` })
    navigate(`/nft`, { state: { nft } })
  }

  return (
    <div className="flex justify-center">
      <div className="block w-3/4">
        <div className="bg-[#181818] rounded p-4">
          <div className="bg-[#181818] rounded p-4">
            <div className="text-2xl font-semibold mb-4">Explore NFTs</div>
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-4">
              {nfts &&
                nfts.map((nft, index) => (
                  <div
                    key={index}
                    className="text-sm border border-transparent hover:bg-gray-100 hover:text-black p-2 rounded-lg cursor-pointer"
                    onClick={() => goToNftPage(nft)}
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
