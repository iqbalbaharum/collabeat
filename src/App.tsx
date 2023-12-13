import { useEffect, useState } from 'react'
// import { metaMaskWallet } from '@rainbow-me/rainbowkit/wallets';
// import { connectorsForWallets, RainbowKitProvider, lightTheme } from '@rainbow-me/rainbowkit';
import { MetaMaskConnector } from '@wagmi/core/connectors/metaMask'
import { PhantomConnector } from 'phantom-wagmi-connector'
import { bsc, bscTestnet, goerli, mainnet, polygon, polygonMumbai } from 'wagmi/chains'
import { createConfig, configureChains, WagmiConfig } from 'wagmi'
import { infuraProvider } from 'wagmi/providers/infura'
import { publicProvider } from 'wagmi/providers/public'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import MainLayout from 'layouts/MainLayout'
import './App.css'
// Hook
import { IpfsProvider } from 'hooks/use-ipfs'
import { AlertMessageProvider } from 'hooks/use-alert-message'
// import { rainbowWeb3AuthConnector } from 'hooks/rainbow-web3auth-connector';
// Router
import { Route, Routes } from 'react-router-dom'

import PageEditor from 'pages/editor'
import PageNft from 'pages/nft'
import PageInventory from 'pages/inventory'
import { ApiProvider } from 'hooks/use-api'
import SignInModal from 'components/Modal/SignInModal'
import PublicLayout from 'layouts/PublicLayout'
import PageShareEditor from 'pages/share'
import { Web3AuthProvider } from 'hooks/use-web3auth'
import PagePlayList from 'pages/PlayList'

const App = () => {
  return (
    <Web3AuthProvider>
      <Web3Wrapper>
        <ApiProvider>
          <Routes>
            <Route element={<MainLayout children={undefined} />}>
              <Route path="/" element={<PagePlayList />} />
              <Route path="/nft" element={<PageNft />} />
              <Route path="/editor/:nftKey" element={<PageEditor />} />
              <Route path="/create-beat" element={<PageInventory />} />
            </Route>
            <Route element={<PublicLayout children={undefined} />}>
              <Route path="/shared/:chainId/:tokenAddress/:tokenId/:version" element={<PageShareEditor />} />
            </Route>
          </Routes>
        </ApiProvider>
      </Web3Wrapper>
    </Web3AuthProvider>
  )
}

const currentChain = [
  // mainnet
  mainnet,
  polygon,
  bsc,
  // tesnet
  goerli,
  polygonMumbai,
  bscTestnet,
]

// Web3 Configs
const { chains, publicClient } = configureChains(currentChain, [
  infuraProvider({ apiKey: String(import.meta.env.VITE_INFURA_ID) }),
  jsonRpcProvider({
    rpc: chain => {
      return {
        http: `${chain.rpcUrls.default}`,
      }
    },
  }),
  publicProvider(),
])

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [new MetaMaskConnector({ chains }), new PhantomConnector({ chains })],
  publicClient,
})

export function Web3Wrapper({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <WagmiConfig config={wagmiConfig}>
      <IpfsProvider>
        <AlertMessageProvider>{children}</AlertMessageProvider>
      </IpfsProvider>
      <SignInModal />
    </WagmiConfig>
  )
}

export default App
