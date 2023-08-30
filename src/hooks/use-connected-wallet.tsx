import { setupWalletSelector } from '@near-wallet-selector/core';
import { setupMyNearWallet } from '@near-wallet-selector/my-near-wallet';
import { Connection, LAMPORTS_PER_SOL, clusterApiUrl } from '@solana/web3.js';
import { PhantomProvider } from 'lib/Phantom';
import { InMemorySigner, connect, keyStores, utils } from 'near-api-js';
import { useEffect, useState } from 'react';
import { useBoundStore } from 'store';
import { CURRENT_CHAIN } from 'store/slices/wallet.slice';
import MyNearIconUrl from '@near-wallet-selector/my-near-wallet/assets/my-near-wallet-icon.png';

import { useChainId, useBalance, useAccount, useSignMessage, useDisconnect } from 'wagmi';
import { abbreviateETHBalance, shortenAddress } from 'utils';
import { encode } from 'bs58';

export function useConnectedWallet() {
  const { current, wallet, setCurrentWalletState, setWalletState } = useBoundStore();
  const { near, phantom } = wallet;

  const [address, setAddress] = useState({ display: '', full: '' });
  const [balance, setBalance] = useState({ formatted: '', symbol: '' });

  // Wagmi hooks
  const { address: evmAddress } = useAccount();
  const evmChainId = useChainId();
  const { disconnectAsync: wagmiDisconnect, isSuccess } = useDisconnect();
  const { data: evmBalance } = useBalance({ address: evmAddress });

  const { signMessageAsync } = useSignMessage({});
  // End Wagmi hooks
  function setConnectedAddress() {
    switch (current.chain) {
      case CURRENT_CHAIN.ETHEREUM:
      case CURRENT_CHAIN.POLYGON:
      case CURRENT_CHAIN.BINANCE:
      case CURRENT_CHAIN.ARBITRUM:
      case CURRENT_CHAIN.CELO:
        setAddress({ display: shortenAddress(`${evmAddress}`), full: `${evmAddress}` });
        return;
      case CURRENT_CHAIN.SOLANA:
        setAddress({ display: shortenAddress(`${phantom.address}`), full: `${phantom.publicKey}` });
        return;
      case CURRENT_CHAIN.NEAR:
        setAddress({ display: shortenAddress(`${near.address}`), full: `${near.publicKey}` });
        return;
    }
  }

  async function getBalance() {
    if (!current.chain) return;

    switch (current.chain) {
      case CURRENT_CHAIN.ETHEREUM:
      case CURRENT_CHAIN.POLYGON:
      case CURRENT_CHAIN.BINANCE:
      case CURRENT_CHAIN.ARBITRUM:
      case CURRENT_CHAIN.CELO: {
        const ethBalance = evmBalance == null ? void 0 : evmBalance.formatted;
        const displayBalance = ethBalance ? abbreviateETHBalance(parseFloat(ethBalance)) : void 0;

        setBalance({ formatted: displayBalance ?? '0', symbol: evmBalance?.symbol ?? '' });
      }
      break;
      case CURRENT_CHAIN.SOLANA: {
        if (!phantom.provider || !phantom.provider.publicKey) return;
        const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
        const balance = await connection.getBalance(phantom?.provider?.publicKey);

        setBalance({ formatted: `${balance / LAMPORTS_PER_SOL}`, symbol: 'SOL' });
      }
      break;
      case CURRENT_CHAIN.NEAR: {
        if (near.provider) {
          const nearBalance = await near.provider?.account.getAccountBalance();
          const amountInNEAR = utils.format.formatNearAmount(nearBalance.available);
          const displayNearBalance = amountInNEAR ? abbreviateETHBalance(parseFloat(amountInNEAR)) : 0;

          setBalance({ formatted: `${displayNearBalance}`, symbol: 'NEAR' });
          return;
        }

        setBalance({ formatted: `${0}`, symbol: 'NEAR' });
      }  
      break;
      default:
        break;
    }
  }

  async function signMessage(message: string) {
    switch (current.chain) {
      case CURRENT_CHAIN.ETHEREUM:
      case CURRENT_CHAIN.POLYGON:
      case CURRENT_CHAIN.BINANCE:
      case CURRENT_CHAIN.ARBITRUM:
      case CURRENT_CHAIN.CELO:
        try {
          return await signMessageAsync({ message });
        } catch (e) {
          return e;
        }

      case CURRENT_CHAIN.SOLANA:
        try {
          const encodedMessage = new TextEncoder().encode(message);
          const result = await phantom.provider?.signMessage(encodedMessage, 'utf8');
          return encode(result.signature as Uint8Array);
        } catch (e) {
          return e;
        }
      case CURRENT_CHAIN.NEAR:
        if (near.provider) {
          try {
            const encodedMessage = new TextEncoder().encode(message);
            const result = await near.provider?.signer.signMessage(
              encodedMessage,
              near.provider.account.accountId,
              'testnet'
            );
            return encode(result.signature as Uint8Array);
          } catch (e) {
            return e;
          }
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
        await wagmiDisconnect();
        setWalletState({ evm: { address: '' } });
        break;
      case CURRENT_CHAIN.SOLANA: {
        // @ts-ignore
        const { solana } = window;

        if (phantom.address && solana) {
          await (solana as PhantomProvider).disconnect();
          setWalletState({ phantom: { address: '' } });
        }
      }
      break;
      case CURRENT_CHAIN.NEAR: {
        if (near.provider) {
          const wallet = await near.provider?.selector.wallet();
          await wallet.signOut();
          setWalletState({ near: { address: '' } });
        }
      }
      break;
      default: 
      break;
    }

    setCurrentWalletState({ chain: undefined, address: '', publicKey: '', balance: { formatted: '', symbol: '' } });
    setAddress({ display: '', full: '' });
    setBalance({ formatted: '', symbol: '' });
  }

  useEffect(() => {
    async function setConnectedBalance() {
      await getBalance();
    }

    async function initNearWallet() {
      const selector = await setupWalletSelector({
        network: 'testnet',
        modules: [
          setupMyNearWallet({
            walletUrl: 'https://testnet.mynearwallet.com',
            //@ts-ignore
            iconUrl: MyNearIconUrl,
          }),
        ],
      });

      const myKeyStore = new keyStores.BrowserLocalStorageKeyStore();

      const connectionConfig = {
        networkId: 'testnet',
        keyStore: myKeyStore, // first create a key store
        nodeUrl: 'https://rpc.testnet.near.org',
        walletUrl: 'https://wallet.testnet.near.org',
        helperUrl: 'https://helper.testnet.near.org',
        explorerUrl: 'https://explorer.testnet.near.org',
      };

      const isSignedIn = selector.isSignedIn();

      if (isSignedIn) {
        setCurrentWalletState({ chain: CURRENT_CHAIN.NEAR });

        const nearConnection = await connect(connectionConfig);
        const accounts = selector.store.getState().accounts[0];
        const account = await nearConnection.account(accounts.accountId);
        const signer = new InMemorySigner(myKeyStore);

        signer.createKey(accounts.accountId, 'testnet');

        let pk;

        if (accounts && accounts.publicKey) {
          pk = accounts.publicKey.split(':')[1];
        }

        console.log('pbk', pk);

        setWalletState({
          near: {
            address: accounts.accountId,
            publicKey: pk ?? accounts.publicKey,
            provider: { account, selector, signer },
          },
        });
        setConnectedAddress();
        await getBalance();
      }
    }

    initNearWallet();
    if (current.chain === CURRENT_CHAIN.NEAR) return;

    setConnectedAddress();
    setConnectedBalance();
  }, [current.chain, evmChainId]);

  return { address, balance, disconnect, signMessage };
}
