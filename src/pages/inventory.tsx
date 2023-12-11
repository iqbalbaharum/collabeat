import { Nft } from 'lib'
import { useNavigate } from 'react-router-dom'
import { useBoundStore } from 'store'
import nfts from 'data/nft.json'
import { formatDataKey } from 'utils'

const PageInventory = () => {
  const navigate = useNavigate()
  const { setNFTState } = useBoundStore()

  const goToNftPage = (nft: Nft) => {
    setNFTState({ ...nft, token_id: `${nft.token_id}` })
    const dataKey = formatDataKey(nft.chain_id, nft.token_address, nft.token_id as string)
    navigate(`/editor/${dataKey}`)
  }

  return (
    <div className="flex justify-center">
      <div className="block w-full mx-2">
        <div className="bg-[#181818] rounded">
          <div className="bg-[#181818] rounded p-2">
            <div className="grid gap-2 grid-cols-2">
              {nfts &&
                nfts.map((nft, index) => (
                  <div
                    key={index}
                    className="text-sm border border-transparent p-2 rounded-lg cursor-pointer"
                    onClick={() => goToNftPage(nft)}
                  >
                    <img
                      className="rounded-lg w-full bg-white object-cover h-48 hover:scale-105 transition duration-500"
                      src={nft.metadata.image}
                      alt={nft.metadata.name}
                    />
                    <div className="font-semibold mt-2 truncate">{nft.metadata.name}</div>
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
