import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: unknown
    dbAPI: {
      getWallets: () => Promise
      getWalletByAddress: (address: string) => Promise
      getWalletById: (id: number) => Promise
      insertWallet: (
        name: string,
        address: string,
        encrypted: string,
        salt: string,
      ) => Promise<void>
      updateBalance: (address: string, balance: string) => Promise<void>
      deleteWallet: (address: string) => Promise<void>
      updatePeer: (peer: string) => Promise<void>
      getPeer: () => Promise<string>
    }
    cryptoAPI: {
      encryptPrivateKey: (
        pk: string,
        password: string,
      ) => Promise<{ encrypted: string; salt: string }>
      decryptPrivateKey: (
        encrypted: string,
        password: string,
        salt: string,
      ) => Promise<string | null>
    }
    storageAPI: {
      storePrivateKey: (address: string, privateKey: string) => Promise<void>
      getPrivateKey: (address: string) => Promise<string | null>
      deletePrivateKey: (address: string) => Promise<void>
    }
    mnemoAPI: {
      generateMnemonic: (
        strength: 256 | 128 | 160 | 192 | 224 = 256,
      ) => Promise<string>
      mnemonicToSeed: (mnemonic: string, passphrase: string = '') => Promise
    }
    walletAPI: {
      walletFromSeed: (
        seed: string,
      ) => Promise<{ address: string; privateKey: string }>
      walletFromPkHex: (
        pkHex: string,
      ) => Promise<{ address: string; privateKey: string }>
      getWalletTransactions: (address: string) => Promise
      getBalance: (peerUrl: string, address: string) => Promise<string | null>
      fetchWarthogPrice: () => Promise<number>
      sendTransaction: (
        recipient: string,
        amount: number,
        fee: number,
        privateKey: string,
        peerUrl: string,
      ) => Promise
      // walletFromPrivateKey: (pkHex: string) => Promise<any>
      // addressFromPublicKey: (pubKey: string) => Promise<any>
    }
  }
}
