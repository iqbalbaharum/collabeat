import React from 'react'
import { Disclosure } from '@headlessui/react'

import { Link } from 'react-router-dom'
import { ConnectedWalletInfo } from './ConnectedWalletInfo'
import { useWeb3Auth } from 'hooks/use-web3auth'
import logoSmall from '/img/logo-small.png'

export default function Header() {
  const { connect, isConnected } = useWeb3Auth()

  const onClickLogin = async () => {
    await connect()
  }

  return (
    <Disclosure as="nav" className="bg-transparent">
      <div className="mx-auto">
        <div className="relative flex h-16 items-center px-2.5">
          <div className="w-full flex flex-1 items-center sm:items-stretch justify-between">
            <div className="flex flex-shrink-0 items-center gap-4">
              <Link to="/">
                <img className="block h-10 w-auto lg:hidden" src={logoSmall} alt="Collabeat" />
                <img
                  className="hidden h-10 w-auto lg:block ring-1 ring-slate-800/90 rounded-lg"
                  src={logoSmall}
                  alt="Collabeat"
                />
              </Link>
            </div>
            <div className="flex gap-2 items-center">
              <Link to="/create-beat" className="bg-yellow-600 px-4 py-2 font-bold font-lg rounded-lg">
                Beat Play
              </Link>
              {isConnected() ? (
                <ConnectedWalletInfo />
              ) : (
                <button
                  onClick={() => onClickLogin()}
                  className="rounded-lg bg-gradient-to-t from-[#7224A7] to-[#FF3065] px-4 py-2"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Disclosure>
  )
}
