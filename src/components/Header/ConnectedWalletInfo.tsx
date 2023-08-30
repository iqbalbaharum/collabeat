import ConnectWallet from 'components/Connect/ConnectWallet';
import { useConnectedWallet } from 'hooks/use-connected-wallet';
import { useBoundStore } from 'store';
import { CURRENT_CHAIN } from 'store/slices/wallet.slice';

export function ConnectedWalletInfo() {
  const { current } = useBoundStore();
  const { disconnect, address, balance } = useConnectedWallet();

  return (
    <>
      {current.chain === CURRENT_CHAIN.EVM && <ConnectWallet />}
      {current.chain === CURRENT_CHAIN.SOLANA && (
        <>
          {/* #484c50 */}
          <button style={{ display: 'flex', alignItems: 'center' }} type="button">
            <div
              style={{
                background: '#484c50',
                width: 36,
                height: 36,
                borderRadius: 999,
                overflow: 'hidden',
                marginRight: 4,
              }}
            >
              <img
                alt={' Solana chain icon'}
                src={'assets/solana-icon.svg'}
                style={{ width: 36, height: 36, zIndex: 99 }}
              />
            </div>
            Solana
          </button>
        </>
      )}
      {current.chain === CURRENT_CHAIN.NEAR && <>Near</>}

      {/* <NearProtocolIcon />
      <PhantomIcon />
      <SolanaIcon /> */}

      <div className="flex rounded-lg bg-[#1A1B1F]">
        <p className="px-4 py-2">{`${balance.formatted} ${balance.symbol}`}</p>
        <p className="rounded-lg bg-[#38393C] px-4 py-2 font-bold"> {address.display}</p>
      </div>
      <button
        style={{
          fontSize: '16px',
          padding: '15px',
          fontWeight: 'bold',
          borderRadius: '5px',
          margin: '15px auto',
        }}
        onClick={() => disconnect()}
      >
        Disconnect
      </button>
    </>
  );
}
