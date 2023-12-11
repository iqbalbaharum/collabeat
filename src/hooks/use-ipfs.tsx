import { createContext, useContext, useEffect, useState } from 'react'
import { NFTStorage } from 'nft.storage'
import { create, IPFSHTTPClient } from 'ipfs-http-client'

interface IpfsContextInterface {
  ipfs: any
  ipfsFork: any
}

export const IpfsContext = createContext<IpfsContextInterface | undefined>(undefined)

export const useIpfs = () => {
  const context = useContext(IpfsContext)
  if (!context) {
    throw new Error('useIpfs must be used within a IpfsProvider')
  }
  return context
}

interface IpfsProviderProps {
  children: React.ReactNode
}

export const IpfsProvider: React.FC<IpfsProviderProps> = ({ children }) => {
  const [isIPFSConnected, setIsIPFSConnected] = useState(false)
  const [ipfs, setIpfs] = useState<NFTStorage>()
  const [ipfsFork, setIpfsFork] = useState<IPFSHTTPClient>()

  useEffect(() => {
    function startIpfs() {
      if (!isIPFSConnected) {
        try {
          const NFT_STORAGE_TOKEN = import.meta.env.VITE_NFTSTORAGE_TOKEN ?? ''
          const client = new NFTStorage({ token: NFT_STORAGE_TOKEN })

          const forkClient = create({
            url: import.meta.env.VITE_IPFS_FORK_MULTIADDRESS,
          })

          setIpfs(client)
          setIpfsFork(forkClient)
          setIsIPFSConnected(Boolean(client))
        } catch (error) {
          console.error('IPFS init error:', error)
        }
      }
    }

    startIpfs()
  }, [isIPFSConnected])

  if (!isIPFSConnected) {
    return <></>
  }

  return (
    <IpfsContext.Provider value={{ ipfs, ipfsFork }}>
      <div>{children}</div>
    </IpfsContext.Provider>
  )
}
