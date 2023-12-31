import { setupWalletSelector } from '@near-wallet-selector/core'
import { setupMyNearWallet } from '@near-wallet-selector/my-near-wallet'
import { Connection, LAMPORTS_PER_SOL, clusterApiUrl } from '@solana/web3.js'
import { PhantomProvider } from 'lib/Phantom'
import { InMemorySigner, connect, keyStores, utils } from 'near-api-js'
import { useEffect, useState } from 'react'
import { useBoundStore } from 'store'
import { CURRENT_CHAIN } from 'store/slices/wallet.slice'
import MyNearIconUrl from '@near-wallet-selector/my-near-wallet/assets/my-near-wallet-icon.png'

import { useChainId, useBalance, useAccount, useSignMessage, useDisconnect } from 'wagmi'
import { abbreviateETHBalance, shortenAddress } from 'utils'
import { encode } from 'bs58'

export function useConnectedWallet() {
  const { current, wallet, setCurrentWalletState, setWalletState } = useBoundStore()
  const { near, phantom } = wallet

  const [address, setAddress] = useState({ display: '', full: '' })
  const [balance, setBalance] = useState({ formatted: '', symbol: '' })

  // Wagmi hooks
  const { address: evmAddress } = useAccount()
  const evmChainId = useChainId()
  const { disconnectAsync: wagmiDisconnect, isSuccess } = useDisconnect()
  const { data: evmBalance } = useBalance({ address: evmAddress })

  const { signMessageAsync } = useSignMessage({})
  // End Wagmi hooks
  function setConnectedAddress() {
    switch (current.chain) {
      case CURRENT_CHAIN.ETHEREUM:
      case CURRENT_CHAIN.POLYGON:
      case CURRENT_CHAIN.BINANCE:
      case CURRENT_CHAIN.ARBITRUM:
      case CURRENT_CHAIN.CELO:
      case CURRENT_CHAIN.MUMBAI:
        setAddress({ display: shortenAddress(`${evmAddress}`), full: `${evmAddress}` })
        return
      case CURRENT_CHAIN.SOLANA:
        setAddress({ display: shortenAddress(`${phantom.address}`), full: `${phantom.publicKey}` })
        return
      case CURRENT_CHAIN.NEAR:
        setAddress({ display: shortenAddress(`${near.address}`), full: `${near.publicKey}` })
        return
    }
  }

  function getBalance() {
    if (!current.chain) return

    switch (current.chain) {
      case CURRENT_CHAIN.ETHEREUM:
      case CURRENT_CHAIN.POLYGON:
      case CURRENT_CHAIN.BINANCE:
      case CURRENT_CHAIN.ARBITRUM:
      case CURRENT_CHAIN.CELO:
      case CURRENT_CHAIN.MUMBAI:
        {
          const ethBalance = evmBalance == null ? void 0 : evmBalance.formatted
          const displayBalance = ethBalance ? abbreviateETHBalance(parseFloat(ethBalance)) : void 0

          setBalance({ formatted: displayBalance ?? '0', symbol: evmBalance?.symbol ?? '' })
        }
        break
      default:
        break
    }
  }

  async function signMessage(message: string) {
    switch (current.chain) {
      case CURRENT_CHAIN.ETHEREUM:
      case CURRENT_CHAIN.POLYGON:
      case CURRENT_CHAIN.BINANCE:
      case CURRENT_CHAIN.ARBITRUM:
      case CURRENT_CHAIN.CELO:
      case CURRENT_CHAIN.MUMBAI:
        try {
          return await signMessageAsync({ message })
        } catch (e) {
          return e
        }
    }
  }

  /**
   * @description disconnect wallet based on current connected chain
   */
  async function disconnect() {
    switch (current.chain) {
      case CURRENT_CHAIN.ETHEREUM:
      case CURRENT_CHAIN.POLYGON:
      case CURRENT_CHAIN.BINANCE:
      case CURRENT_CHAIN.ARBITRUM:
      case CURRENT_CHAIN.CELO:
      case CURRENT_CHAIN.MUMBAI:
        await wagmiDisconnect()
        setWalletState({ evm: { address: '' } })
        break
      default:
        break
    }

    setCurrentWalletState({ chain: undefined, address: '', publicKey: '', balance: { formatted: '', symbol: '' } })
    setAddress({ display: '', full: '' })
    setBalance({ formatted: '', symbol: '' })
  }

  useEffect(() => {
    function setConnectedBalance() {
      getBalance()
    }

    setConnectedAddress()
    setConnectedBalance()
  }, [getBalance, setConnectedAddress])

  return { address, balance, disconnect, signMessage }
}
