import { SafeEventEmitterProvider } from '@web3auth/base'
import { Web3Auth } from '@web3auth/modal'
import { OpenloginAdapter } from '@web3auth/openlogin-adapter'
import { TorusWalletAdapter } from '@web3auth/torus-evm-adapter'
import { TorusWalletConnectorPlugin } from '@web3auth/torus-wallet-connector-plugin'
import { createContext, useContext, useEffect, useState } from 'react'
import RPC from 'utils/web3'
import Web3 from 'web3'

interface Web3AuthContextInterface {
  isInitiated: boolean
  torusAddress: string
  web3Auth: Web3Auth | null
  web3: Web3 | undefined
  initWeb3AuthModal: () => Promise<void>
  connectWeb3Auth: () => Promise<void>
  isConnected: () => boolean
  signMessage: (message: string) => Promise<{ signature: string; torusAddress: string } | undefined>
}

interface Web3AuthProviderProps {
  children: React.ReactNode
}

export function useWeb3Auth() {
  const context = useContext(Web3AuthContext)

  if (!context) {
    throw new Error('useApi must be used within a Web3AuthProvider')
  }
  return context
}

export const Web3AuthContext = createContext<Web3AuthContextInterface | undefined>(undefined)

export const Web3AuthProvider = ({ children }: Web3AuthProviderProps) => {
  const [web3Auth, setWeb3Auth] = useState<Web3Auth | null>(null)
  const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(null)
  const [torusPlugin, setTorusPlugin] = useState<TorusWalletConnectorPlugin>()
  const [torusAddress, setTorusAddress] = useState<string>('')
  const [web3, setWeb3] = useState<Web3>(new Web3())
  const [isInitiated, setIsInitiated] = useState<boolean>(false)

  async function initWeb3AuthModal(): Promise<void> {
    const MUMBAI_HEXADECIMAL_CHAIN_ID = parseInt(import.meta.env.VITE_DEFAULT_CHAIN_ID).toString(16)

    const web3auth = new Web3Auth({
      clientId: import.meta.env.VITE_WEB3AUTH_CLIENT_ID,
      chainConfig: {
        chainNamespace: 'eip155',
        chainId: `0x${MUMBAI_HEXADECIMAL_CHAIN_ID}`,
        rpcTarget: 'https://rpc.ankr.com/polygon_mumbai',
        // Avoid using public rpcTarget in production.
        // Use services like Infura, Quicknode etc
        displayName: 'Polygon Mumbai Testnet',
        blockExplorer: 'https://mumbai.polygonscan.com/',
        ticker: 'MATIC',
        tickerName: 'Matic',
      },
    })

    const openloginAdapter = new OpenloginAdapter({
      loginSettings: {
        mfaLevel: 'optional',
      },
      adapterSettings: {
        uxMode: 'popup',
        whiteLabel: {
          name: 'Web3Auth',
          logoLight: 'https://web3auth.io/images/w3a-L-Favicon-1.svg',
          logoDark: 'https://web3auth.io/images/w3a-D-Favicon-1.svg',
          defaultLanguage: 'en',
          dark: true, // whether to enable dark mode. defaultValue: false
        },
        network: 'testnet',
      },
    })

    web3auth.configureAdapter(openloginAdapter)

    const torusplugin = new TorusWalletConnectorPlugin({
      torusWalletOpts: { buttonSize: 0 },
      walletInitOptions: {
        whiteLabel: {
          theme: { isDark: true, colors: { primary: '#00a8ff' } },
          logoDark: 'https://web3auth.io/images/w3a-L-Favicon-1.svg',
          logoLight: 'https://web3auth.io/images/w3a-D-Favicon-1.svg',
        },
        useWalletConnect: false,
        enableLogging: false,
      },
    })

    setTorusPlugin(torusplugin as any)
    await web3auth.addPlugin(torusplugin)

    const torusWalletAdapter = new TorusWalletAdapter({
      clientId: import.meta.env.VITE_WEB3AUTH_CLIENT_ID,
    })

    // it will add/update  the torus-evm adapter in to web3auth class
    web3auth.configureAdapter(torusWalletAdapter)

    await web3auth.initModal()
    setWeb3Auth(web3auth)
    setProvider(web3auth.provider)
    if (web3auth) setIsInitiated(true)
  }

  async function connectWeb3Auth() {
    if (web3Auth) {
      const provider = await web3Auth.connect()
      setProvider(provider)
    }
  }
  async function signMessage(message: string) {
    if (!provider) {
      console.log('Provider not initialized yet')
      return
    }

    const web3 = new Web3(web3Auth?.provider as any)
    web3.setProvider(torusPlugin?.proxyProvider as any)
    const address = await web3.eth.getAccounts()

    const rpc = new RPC(torusPlugin?.proxyProvider as any, web3 as any)
    const signedMessage = await rpc.signMessage(message)

    setTorusAddress(address[0])
    setWeb3(web3)

    return { signature: signedMessage, torusAddress: address[0] }
  }

  function isConnected() {
    return web3Auth?.status === 'connected'
  }

  useEffect(() => {
    async function init() {
      await initWeb3AuthModal()
    }

    init()
  }, [])

  return (
    <Web3AuthContext.Provider
      value={{
        initWeb3AuthModal,
        connectWeb3Auth,
        signMessage,
        isConnected,
        web3Auth,
        torusAddress,
        web3,
        isInitiated,
      }}
    >
      {children}
    </Web3AuthContext.Provider>
  )
}
