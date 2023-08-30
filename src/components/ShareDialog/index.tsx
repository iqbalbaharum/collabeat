import { useState } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import copy from 'assets/icons/copy.png'

import {
  EmailShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  RedditShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from 'react-share'

import { EmailIcon, FacebookIcon, LinkedinIcon, RedditIcon, TwitterIcon, WhatsappIcon } from 'react-share'

interface ShareDialogProp {
  chainId: String
  tokenAddress: String
  tokenId: String
  version: String
  onHandleCloseClicked: () => void
}

const ShareDialog = (prop: ShareDialogProp) => {
  const [shareUrl] = useState(
    `${window.location.origin}/shared/${prop.chainId}/${prop.tokenAddress}/${prop.tokenId}/${prop.version}`
  )
  const [title] = useState('Collabeat')

  return (
    <div className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center text-center">
        <div className="border-gradient transform overflow-hidden bg-transparent text-left align-bottom shadow-xl transition-all sm:my-8 sm:inline-block sm:w-full sm:align-middle md:max-w-xl">
          <div className="bg-gray-900 px-8 pt-4 pb-8">
            <div className="flex justify-between text-white">
              <h3 className="Roboto mb-4 text-xl font-bold leading-6 text-[#DCDCDC]">Share</h3>
              <XMarkIcon className="h-6 w-6 cursor-pointer" onClick={() => prop.onHandleCloseClicked()} />
            </div>
            <div className="">
              <div className="mt-3 text-left">
                <div className="mt-4 flex justify-between">
                  <WhatsappShareButton url={shareUrl} title={title} separator=":: ">
                    <WhatsappIcon size={48} round />
                  </WhatsappShareButton>
                  <FacebookShareButton url={shareUrl} quote={title}>
                    <FacebookIcon size={48} round />
                  </FacebookShareButton>
                  <TwitterShareButton url={shareUrl} title={title}>
                    <TwitterIcon size={48} round />
                  </TwitterShareButton>
                  <EmailShareButton url={shareUrl} subject={title} body="body">
                    <EmailIcon size={48} round />
                  </EmailShareButton>
                  <LinkedinShareButton url={shareUrl}>
                    <LinkedinIcon size={48} round />
                  </LinkedinShareButton>
                  <RedditShareButton url={shareUrl} title={title} windowWidth={660} windowHeight={460}>
                    <RedditIcon size={48} round />
                  </RedditShareButton>
                </div>
                <div className="mt-6">
                  <div className="flex w-full items-center justify-between">
                    <input
                      type="text"
                      value={shareUrl}
                      className="mr-2 block w-full border border-white bg-black p-3 text-sm text-white"
                    />
                    <button
                      type="button"
                      className="Inter flex h-11 flex-row items-center justify-center gap-x-4 bg-[#F5517B] px-6 py-2 text-base font-medium text-white hover:bg-opacity-50 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      <img src={copy} alt="Email" />
                      Copy
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShareDialog
