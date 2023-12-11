import { Dialog, Transition } from '@headlessui/react'
import GenericButton from 'components/Button/GenericButton'
import { Fragment, useState } from 'react'
import { useBoundStore } from 'store'
import useSubscription from './hooks/useSubscription'
import QuantityInput from 'components/QuantityInput'
import useGetBuyPrice from './hooks/useGetBuyPrice'
import AccentButton from 'components/Button/AccentButton'

const MusicItemBuyDialog = () => {
  const [amount, setAmount] = useState(0)

  const { subscribe, isLoading } = useSubscription()
  const { modal, setModalState } = useBoundStore()
  const { buyPrice, buyPriceAfterTax } = useGetBuyPrice({
    tokenId: modal.buyVote.tokenId,
    amount,
  })

  const onCloseModal = () => {
    setAmount(0)
    setModalState({
      buyVote: { isOpen: false, tokenId: '' },
    })
  }

  const onClickSubscribe = () => {
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
    <Transition appear show={modal.buyVote.isOpen} as={Fragment}>
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

        <Transition.Child
          as={Fragment}
          enter="transition ease-out duration-300 transform"
          enterFrom="opacity-0 translate-y-full"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-200 transform"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-full"
        >
          <div className="fixed sm:w-full sm:bottom-0 lg:w-2/4 lg:-translate-x-1/2 lg:left-1/2 lg:top-1/2 -translate-y-1/2 transform rounded-lg bg-slate-900 text-white lg:h-2/5 sm:h-1/2 sm:max-w-md">
            <Dialog.Panel className="h-full">
              <div
                className={`flex flex-col p-4 ring-1 ring-white backdrop-blur border shadow-2xl h-full border-slate-600`}
              >
                <h3 className="text-lg font-bold">Vote Up</h3>
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center flex flex-col gap-1">
                    Vote Amount
                    <QuantityInput input={amount} setInput={setAmount} />
                  </div>
                </div>
                <div className="my-3 pr-3 w-full text-right">
                  <h3>Total Price: {buyPrice ?? 0} ETH</h3>
                  <h3>Total Price After Fee: {buyPriceAfterTax ?? 0} ETH</h3>
                  <div className="text-center flex justify-end gap-2 mt-2">
                    <AccentButton
                      name={!isLoading ? `Subscribe` : `Processing`}
                      disabled={isLoading}
                      onClick={onClickSubscribe}
                    />
                    <GenericButton name="Cancel" onClick={onCloseModal} />
                  </div>
                </div>
              </div>
            </Dialog.Panel>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  )
}

export default MusicItemBuyDialog
