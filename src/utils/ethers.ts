/* eslint-disable @typescript-eslint/no-explicit-any */
import { ethers } from 'ethers'

type CallMethodArgs = {
  contractABI: string
  contractAddress: string
  data: string[]
  method: string
}

export default class EthereumRpc {
  private provider: any

  constructor(provider: any) {
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
    try {
      // For ethers v5
      // const ethersProvider = new ethers.providers.Web3Provider(this.provider);
      const ethersProvider = new ethers.BrowserProvider(this.provider)

      // For ethers v5
      // const signer = ethersProvider.getSigner();
      const signer = await ethersProvider.getSigner()

      // Get user's Ethereum public address
      const address = signer.getAddress()

      return await address
    } catch (error) {
      return error
    }
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

  async contractMethod({ contractABI, contractAddress, data, method }: CallMethodArgs): Promise<any> {
    try {
      const ethersProvider = new ethers.BrowserProvider(this.provider)
      const signer = await ethersProvider.getSigner()
      const contract = new ethers.Contract(contractAddress, contractABI, signer)

      // Submit transaction to the blockchain
      const tx = await contract[method](...data)

      // Wait for transaction to be mined
      const receipt = await tx.wait()

      return receipt
    } catch (error) {
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
    } catch (error) {
      return error as string
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
}
