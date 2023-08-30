import { SafeEventEmitterProvider } from '@web3auth/base';
import Web3 from 'web3';

export default class EthereumRPC {
  private provider: SafeEventEmitterProvider;
  private web3: Web3;

  constructor(provider: SafeEventEmitterProvider, web3: Web3) {
    this.provider = provider;
    this.web3 = web3;
  }

  async getChainId(): Promise<string> {
    try {
      // Get the connected Chain's ID
      const chainId = await this.web3.eth.getChainId();

      return chainId.toString();
    } catch (error) {
      return error as string;
    }
  }

  async getAccounts(): Promise<any> {
    try {
      // Get user's Ethereum public address
      const address = await this.web3.eth.getAccounts();

      return address[0];
    } catch (error) {
      return error;
    }
  }

  async getBalance(): Promise<string> {
    try {
      // Get user's Ethereum public address
      const address = (await this.web3.eth.getAccounts())[0];

      // Get user's balance in ether
      const balance = this.web3.utils.fromWei(
        await this.web3.eth.getBalance(address), // Balance is in wei
        'wei'
      );

      return balance;
    } catch (error) {
      return error as string;
    }
  }

  async sendTransaction(): Promise<any> {
    try {
      // Get user's Ethereum public address
      const fromAddress = (await this.web3.eth.getAccounts())[0];

      const destination = fromAddress;

      const amount = this.web3.utils.toWei('0.001', 'ether'); // Convert 1 ether to wei

      // Submit transaction to the blockchain and wait for it to be mined
      const receipt = await this.web3.eth.sendTransaction({
        from: fromAddress,
        to: destination,
        value: amount,
        maxPriorityFeePerGas: '5000000000', // Max priority fee per gas
        maxFeePerGas: '6000000000000', // Max fee per gas
      });

      return receipt;
    } catch (error) {
      return error as string;
    }
  }

  async signMessage(message: string) {
    try {
      // Get user's Ethereum public address
      const fromAddress = (await this.web3.eth.getAccounts())[0];

      console.log(fromAddress);

      // Sign the message
      const signedMessage = await this.web3.eth.personal.sign(
        message,
        fromAddress,
        '' // configure your own password here.
      );

      return signedMessage;
    } catch (error) {
      return error as string;
    }
  }

  async getPrivateKey(): Promise<any> {
    try {
      const privateKey = await this.provider.request({
        method: 'eth_private_key',
      });

      return privateKey;
    } catch (error) {
      return error as string;
    }
  }
}
