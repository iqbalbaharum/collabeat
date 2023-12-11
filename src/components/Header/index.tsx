import React from 'react'
import { Disclosure } from '@headlessui/react'

import { Link } from 'react-router-dom'
import { ConnectedWalletInfo } from './ConnectedWalletInfo'
import { useWeb3Auth } from 'hooks/use-web3auth'
import logo from '/img/logo.png'

export default function Header() {
  const { connect, isConnected } = useWeb3Auth()

  const onClickLogin = async () => {
    await connect()
  }

  return (
    <Disclosure as="nav" className="bg-transparent">
      <div className="mx-auto max-w-[3840px] py-5">
        <div className="relative flex h-16 items-center justify-between">
          <div className="flex flex-1 items-center sm:items-stretch justify-between">
            <div className="flex flex-shrink-0 items-center gap-4">
              <Link to="/">
                <img className="block h-10 w-auto lg:hidden" src={logo} alt="Collabeat" />
                <img className="hidden h-10 w-auto lg:block" src={logo} alt="Collabeat" />
              </Link>
            </div>
            <div className="flex gap-5 items-center">
              <Link to="/create-beat" className="bg-yellow-600 px-4 py-2 font-bold font-lg rounded-lg">
                Beat Play
              </Link>
              {isConnected() ? (
                <ConnectedWalletInfo />
              ) : (
                <button
                  onClick={() => onClickLogin()}
                  className="rounded-sm bg-gradient-to-t from-[#7224A7] to-[#FF3065] px-4 py-2"
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center sm:static sm:inset-auto sm:ml-6 sm:pr-0"></div>
        </div>
      </div>
    </Disclosure>
  )
}
