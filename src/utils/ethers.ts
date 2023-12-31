/* eslint-disable @typescript-eslint/no-explicit-any */
import type { SafeEventEmitterProvider } from '@web3auth/base'
import { ethers } from 'ethers'

export type CallContractMethodArgs = {
  contractABI: any[]
  contractAddress: string
  data: string[]
  method: string
  options?: {
    value: string
  }
}

export default class EthereumRpc {
  private provider: SafeEventEmitterProvider

  constructor(provider: SafeEventEmitterProvider) {
    this.provider = provider
  }

  async getChainId(): Promise<any> {
    try {
      // For ethers v5
      // const ethersProvider = new ethers.providers.Web3Provider(this.provider);
      const ethersProvider = new ethers.BrowserProvider(this.provider)
      // Get the connected Chain's ID
      const networkDetails = await ethersProvider.getNetwork()
      return networkDetails.chainId
    } catch (error) {
      return error
    }
  }

  async getAccounts(): Promise<any> {
    const ethersProvider = new ethers.BrowserProvider(this.provider)
    const signer = await ethersProvider.getSigner()
    const address = signer.getAddress()

    return address
  }

  async getBalance(): Promise<string> {
    try {
      // For ethers v5
      // const ethersProvider = new ethers.providers.Web3Provider(this.provider);
      const ethersProvider = new ethers.BrowserProvider(this.provider)

      // For ethers v5
      // const signer = ethersProvider.getSigner();
      const signer = await ethersProvider.getSigner()

      // Get user's Ethereum public address
      const address = signer.getAddress()

      // Get user's balance in ether
      // For ethers v5
      // const balance = ethers.utils.formatEther(
      // await ethersProvider.getBalance(address) // Balance is in wei
      // );
      const balance = ethers.formatEther(
        await ethersProvider.getBalance(address) // Balance is in wei
      )

      return balance
    } catch (error) {
      return error as string
    }
  }

  async callContractMethod({
    contractABI,
    contractAddress,
    data,
    method,
    options,
  }: CallContractMethodArgs): Promise<any> {
    const ethersProvider = new ethers.BrowserProvider(this.provider)
    const signer = await ethersProvider.getSigner()
    const contract = new ethers.Contract(contractAddress, contractABI, signer)

    // Submit transaction to the blockchain
    const tx = await contract[method](...data, options)

    // Wait for transaction to be mined
    const receipt = await tx.wait()

    return receipt
  }

  async readContractData({ contractABI, contractAddress, data, method }: CallContractMethodArgs): Promise<any> {
    try {
      const ethersProvider = new ethers.BrowserProvider(this.provider)
      const contract = new ethers.Contract(contractAddress, contractABI, ethersProvider)

      const result = await contract[method](...data)

      return result
    } catch (error) {
      if ((error as any).value === '0x') return 0
      return error as string
    }
  }

  async signMessage(message: string) {
    try {
      const ethersProvider = new ethers.BrowserProvider(this.provider)
      const signer = await ethersProvider.getSigner()
      // Sign the message
      const signedMessage = await signer.signMessage(message)

      return signedMessage
    } catch (error: any) {
      throw new Error(error.reason as string)
    }
  }

  async getPrivateKey(): Promise<any> {
    try {
      const privateKey = await this.provider.request({
        method: 'eth_private_key',
      })

      return privateKey
    } catch (error) {
      return error as string
    }
  }

  async getAddressLookup(address: string): Promise<string | null> {
    const ethersProvider = new ethers.BrowserProvider(this.provider)
    return ethersProvider.lookupAddress(address)
  }
}
