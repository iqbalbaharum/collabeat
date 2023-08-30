import { useBoundStore } from 'store';
import { useEffect } from 'react';
import { PhantomProvider } from 'lib/Phantom';
import { CURRENT_CHAIN } from 'store/slices/wallet.slice';

export default function ConnectSolana() {
  const { current, setCurrentWalletState, setWalletState, setModalState } = useBoundStore();

  useEffect(() => {
    const getProvider = (): PhantomProvider | undefined => {
      if ('solana' in window) {
        // @ts-ignore
        const provider = window.solana as any;
        if (provider.isPhantom) return provider as PhantomProvider;
      }
    };

    setWalletState({ phantom: { provider: getProvider() } });
  }, []);

  /**
   * @description prompts user to connect wallet if it exists
   */
  const connectWallet = async () => {
    // @ts-ignore
    const { solana } = window;

    if (solana) {
      try {
        const response = await solana.connect();
        setWalletState({
          phantom: { address: response.publicKey.toString(), publicKey: response.publicKey.toString() },
        });
        setCurrentWalletState({ chain: CURRENT_CHAIN.SOLANA });
        setModalState({ signUpMain: { isOpen: false } });
      } catch (err) {
        // { code: 4001, message: 'User rejected the request.' }
      }
    }
  };

  return (
    <div className="flex justify-center">
      <div className="w-2/3 grid gap-4">
      {current.chain === undefined && (
        
        <button onClick={() => connectWallet()} className="rounded-xl block w-full border border-gray-300 hover:border-green-800 hover:bg-green-600 hover:bg-opacity-20 px-8 py-4 font-semibold">
          <div className="flex items-center">
            <svg className="mr-4" width="48" height="40" viewBox="0 0 593 493" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M70.0546 493C145.604 493 202.38 427.297 236.263 375.378C232.142 386.865 229.852 398.351 229.852 409.378C229.852 439.703 247.252 461.297 281.592 461.297C328.753 461.297 379.119 419.946 405.218 375.378C403.386 381.811 402.471 387.784 402.471 393.297C402.471 414.432 414.375 427.757 438.643 427.757C515.108 427.757 592.03 292.216 592.03 173.676C592.03 81.3243 545.327 0 428.112 0C222.069 0 0 251.784 0 414.432C0 478.297 34.3405 493 70.0546 493ZM357.141 163.568C357.141 140.595 369.962 124.514 388.734 124.514C407.049 124.514 419.87 140.595 419.87 163.568C419.87 186.541 407.049 203.081 388.734 203.081C369.962 203.081 357.141 186.541 357.141 163.568ZM455.126 163.568C455.126 140.595 467.947 124.514 486.719 124.514C505.034 124.514 517.855 140.595 517.855 163.568C517.855 186.541 505.034 203.081 486.719 203.081C467.947 203.081 455.126 186.541 455.126 163.568Z" fill="#AB9FF2"/>
</svg> Phantom
          </div>
        </button>
      )}
      </div>
      
    </div>
  );
}
