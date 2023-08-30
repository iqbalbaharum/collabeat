import React from 'react'
import { Disclosure } from '@headlessui/react'

import logo from 'assets/img/logo.png'
import {Link} from 'react-router-dom'
import { ConnectedWalletInfo } from './ConnectedWalletInfo';
import { useBoundStore } from 'store'
import { useConnectedWallet } from 'hooks/use-connected-wallet'

export default function Header() {

  const { setModalState, current } = useBoundStore();
  useConnectedWallet();

  return (
    <Disclosure as="nav" className="bg-transparent">
      <div className="mx-auto max-w-[3840px] py-5">
        <div className="relative flex h-16 items-center justify-between">
          <div className="flex flex-1 items-center sm:items-stretch sm:justify-start">
            <div className="flex flex-shrink-0 items-center">
              <Link to="/">
                {/* <img className="block h-10 w-auto lg:hidden" src={logo} alt="Collabeat" />
                <img className="hidden h-10 w-auto lg:block" src={logo} alt="Collabeat" /> */}
              </Link>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center gap-4 pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {current.chain ? (
              <ConnectedWalletInfo />
            ) : (
              <button
                onClick={() => setModalState({ signUpMain: { isOpen: true } })}
                className="rounded-sm bg-gradient-to-t from-[#7224A7] to-[#FF3065] px-4 py-2"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>
    </Disclosure>
  )
}
