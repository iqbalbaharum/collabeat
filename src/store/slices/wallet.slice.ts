import { StateCreator } from 'zustand';
import { resetters } from '..';

export enum CURRENT_CHAIN {
  // mainnet
  ETHEREUM = "ethereum",
  POLYGON = "polygon",
  BINANCE = "binance",
  SOLANA = 'solana',
  ARBITRUM = 'arbitrum',
  CELO = 'celo',
  EVM = 'evm',
  NEAR = 'near',
  // testnet
  GOERLI = "goerli",
  MUMBAI = "mumbai"
}

export type Wallet = {
  address: string;
  publicKey: string;
  balance: {
    decimals?: number;
    formatted: string;
    symbol?: string;
  };
  provider?: any;
};

type CurrentWallet = Omit<Wallet, 'provider'> & { chain?: CURRENT_CHAIN };

type WalletType = 'evm' | 'phantom' | 'near';

export interface WalletSlice {
  current: CurrentWallet;
  wallet: { [key: string]: Partial<Wallet> };
  setCurrentWalletState: (currentWallet: Partial<CurrentWallet>) => void;
  setWalletState: (wallet: { [key in Partial<WalletType>]?: Partial<Wallet> }) => void;
  resetWallet: () => void;
}

const initialWallet = {
  current: {
    chain: undefined,
    address: '',
    publicKey: '',
    balance: {
      formatted: '',
      symbol: '',
    },
  },
  wallet: {
    evm: {
      address: '',
      publicKey: '',
      provider: undefined,
      balance: {
        decimals: 0,
        formatted: '',
        symbol: '',
      },
    },
    phantom: {
      address: '',
      publicKey: '',
      provider: undefined,
      balance: {
        decimals: 0,
        formatted: '',
        symbol: 'SOL',
      },
    },
    near: {
      address: '',
      publicKey: '',
      provider: undefined,
      balance: {
        decimals: 0,
        formatted: '',
        symbol: 'NEAR',
      },
    },
  },
};

export const createWalletSlice: StateCreator<WalletSlice, [], [], WalletSlice> = set => {
  resetters.push(() => set(initialWallet));

  return {
    ...initialWallet,
    setCurrentWalletState: current => {
      set(state => ({ current: Object.assign(state.current, current) }));
    },
    setWalletState: wallet => {
      const key = Object.keys(wallet)[0] as WalletType;

      set(state => ({
        wallet: { ...state.wallet, [key]: Object.assign(state.wallet[key], wallet[key]) },
      }));
    },
    resetWallet: () => {
      set({ ...initialWallet });
    },
  };
};
