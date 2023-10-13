import ConnectWallet from 'components/Connect/ConnectWallet'
import { useWeb3Auth } from 'hooks/use-web3auth'
import { useEffect, useState } from 'react'
import { useBoundStore } from 'store'
import { CURRENT_CHAIN } from 'store/slices/wallet.slice'
import { abbreviateETHBalance, shortenAddress } from 'utils'

export function ConnectedWalletInfo() {
  const { current } = useBoundStore()
  const { disconnect, getUserBalance, isConnected, address } = useWeb3Auth()

  const [balance, setBalance] = useState('')

  useEffect(() => {
    async function init() {
      let balance = await getUserBalance()
      setBalance(abbreviateETHBalance(parseFloat(balance as string)))
    }

    if (isConnected()) init()
  }, [isConnected])

  return (
    <>
      {current.chain === CURRENT_CHAIN.EVM && <ConnectWallet chain={CURRENT_CHAIN.BINANCE} chainId={157} />}
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
        <p className="px-4 py-2">{`${balance ?? '0'} ${'MATIC'}`}</p>
        <p className="rounded-lg bg-[#38393C] px-4 py-2 font-bold"> {`${shortenAddress(address) ?? '-'}`}</p>
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
  )
}
