import '@near-wallet-selector/modal-ui/styles.css';
import { setupModal } from '@near-wallet-selector/modal-ui';
import { useBoundStore } from 'store';
import { setupWalletSelector } from '@near-wallet-selector/core';
import { setupMyNearWallet } from '@near-wallet-selector/my-near-wallet';
import MyNearIconUrl from '@near-wallet-selector/my-near-wallet/assets/my-near-wallet-icon.png';

export default function ConnectNear() {
  const { current } = useBoundStore();

  async function onClickConnect() {
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

    const modal = setupModal(selector, {
      contractId: `${process.env.CONTRACT_NAME}`,
    });

    modal.show();
  }

  return (
    <div className="flex justify-center">
      <div className="w-2/3 grid gap-4">
        <button onClick={() => onClickConnect()} className="rounded-xl block w-full border border-gray-300 hover:border-green-800 hover:bg-green-600 hover:bg-opacity-20 px-8 py-4 font-semibold">
          <div className="flex items-center">
            <svg className="mr-4" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 128 128" id="near-protocol"><path d="M91.81,23.38l-19.32,28a2,2,0,0,0,2.88,2.67L94,39v49L40.51,23.57a12.31,12.31,0,0,0-21.77,7.87v67c0,10.9,13,12.69,17.09,6.7l20-28.87a1.77,1.77,0,0,0-.08-2.12,1.79,1.79,0,0,0-2.51-.29L34,89.19V39.55L87.49,103.9c8.41,9.88,21.77,3.93,21.77-7.87V29C109.26,18.94,97,16,91.81,23.38Z"></path></svg>
            NEAR
          </div>
        </button>
      </div>
    </div>
  );
}
