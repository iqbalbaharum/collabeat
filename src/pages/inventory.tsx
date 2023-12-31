import { Nft } from 'lib'
import { useNavigate } from 'react-router-dom'
import { useBoundStore } from 'store'
import nfts from 'data/nft.json'
import { formatDataKey } from 'utils'
import ChainToIcon from 'components/ChainToIcon'

const PageInventory = () => {
  const navigate = useNavigate()
  const { setNFTState } = useBoundStore()

  const goToNftPage = (nft: Nft) => {
    setNFTState({ ...nft, token_id: `${nft.token_id}` })
    const dataKey = formatDataKey(nft.chain_id, nft.token_address, nft.token_id as string)
    navigate(`/editor/${dataKey}`)
  }

  return (
    <div className="">
      <h3 className="font-semibold text-lg mt-2 px-4 py-4 text-gray-400">Weekly NFT Beats</h3>
      <div className="block w-full overflow-auto">
        <div className="flex overflow-x-auto gap-4 scrollbar-hide">
          {nfts &&
            nfts.map((nft, index) => (
              <div key={index} className="first:ml-4 flex-none w-36">
                <div className="relative w-full h-36">
                  <img
                    src={nft.metadata.image}
                    alt={nft.metadata.name}
                    key={index}
                    onClick={() => goToNftPage(nft)}
                    className="bg-white cursor-pointer object-fill rounded-lg"
                  />
                  <div className="absolute top-0 left-0 p-2 h-5 w-5">
                    <ChainToIcon chain={nft.chain_id} />
                  </div>
                </div>
                <div className="text-sm py-2 line-clamp-1">{nft.metadata.name}</div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default PageInventory
