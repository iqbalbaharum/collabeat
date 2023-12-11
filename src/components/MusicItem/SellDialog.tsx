import { Dialog, Transition } from '@headlessui/react'
import GenericButton from 'components/Button/GenericButton'
import { Fragment, useState } from 'react'
import { useBoundStore } from 'store'
import useSubscription from './hooks/useSubscription'
import QuantityInput from 'components/QuantityInput'
import useGetSellPrice from './hooks/useGetSellPrice'
import AccentButton from 'components/Button/AccentButton'

const MusicItemSellDialog = () => {
  const [amount, setAmount] = useState(0)

  const { unsubscribe, isLoading } = useSubscription()
  const { modal, setModalState } = useBoundStore()
  const { sellPrice, sellPriceAfterTax } = useGetSellPrice({
    tokenId: modal.sellVote.tokenId,
    amount,
  })

  const onCloseModal = () => {
    setAmount(0)
    setModalState({
      sellVote: { isOpen: false, tokenId: '' },
    })
  }

  const onClickUnSubscribe = () => {
    try {
      // await subscribe(modal.subscribe.tokenId, amount)
      // setModalState({
      //   alert: {
      //     isOpen: true,
      //     state: 'success',
      //     message: `Succesfully subscribed to Nous Psyche #${modal.subscribe.tokenId}`,
      //   },
      // })
    } catch (e) {
      // setModalState({
      //   alert: { isOpen: true, state: 'failed', message: `Subscription purchased failed` },
      // })
    }
  }

  return (
    <Transition appear show={modal.sellVote.isOpen} as={Fragment}>
      <Dialog as="div" onClose={onCloseModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className={`fixed inset-0 bg-blue-800/40 backdrop-blur`} aria-hidden="true" />
        </Transition.Child>

        <div className="max-w-md mx-auto fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center text-center">
            <Transition.Child
              as={Fragment}
              enter="transition ease-out duration-300 transform"
              enterFrom="opacity-0 translate-y-full"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-200 transform"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-full"
            >
              <Dialog.Panel className="w-full h-2/5 fixed max-w-md bottom-0 text-center transform overflow-hidden bg-blue-900 align-middle shadow-xl transition-all">
                <div className="flex flex-col p-4 text-white h-full">
                  <h3 className="text-lg font-bold">Unstake to unpromote this beat</h3>
                  <h5 className="text-md">By unstake this beat, it would possibly drop rank</h5>
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center flex flex-col gap-1">
                      <QuantityInput input={amount} setInput={setAmount} />
                    </div>
                  </div>
                  <div className="my-3 pr-3 w-full text-right">
                    <h3>Total Refund: {sellPrice ?? 0} ETH</h3>
                    <h3>Total Refund After Fee: {sellPriceAfterTax ?? 0} ETH</h3>
                    <div className="text-center flex justify-end gap-2 mt-2">
                      <AccentButton
                        name={!isLoading ? `Unstake` : `Processing`}
                        disabled={isLoading}
                        onClick={onClickUnSubscribe}
                      />
                      <GenericButton name="Cancel" onClick={onCloseModal} />
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default MusicItemSellDialog
