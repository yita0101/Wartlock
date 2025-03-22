import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    // Electron related
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)

    // Database related
    contextBridge.exposeInMainWorld("dbAPI", {
      getWallets: () => ipcRenderer.invoke("getWallets"),
      getWalletByAddress: (address: string) => ipcRenderer.invoke("getWalletByAddress", address),
      getWalletById: (id: number) => ipcRenderer.invoke("getWalletById", id),
      insertWallet: (name: string, address: string, pk: string, salt: string) => ipcRenderer.invoke("insertWallet", name, address, pk, salt),
      updateBalance: (address: string, balance: string) => ipcRenderer.invoke("updateBalance", address, balance),
      deleteWallet: (address: string) => ipcRenderer.invoke("deleteWallet", address),
      updatePeer: (peer: string) => ipcRenderer.invoke("updatePeer", peer),
      getPeer: () => ipcRenderer.invoke("getPeer"),
    });

    // Crypto related
    contextBridge.exposeInMainWorld("cryptoAPI", {
      encryptPrivateKey: (pk: string, password: string) => ipcRenderer.invoke("encryptPrivateKey", pk, password),
      decryptPrivateKey: (encrypted: string, password: string, salt: string) => ipcRenderer.invoke("decryptPrivateKey", encrypted, password, salt),
    });

    // Storage related
    contextBridge.exposeInMainWorld("storageAPI", {
      storePrivateKey: (address: string, privateKey: string) => ipcRenderer.invoke("storePrivateKey", address, privateKey),
      getPrivateKey: (address: string) => ipcRenderer.invoke("getPrivateKey", address),
      deletePrivateKey: (address: string) => ipcRenderer.invoke("deletePrivateKey", address),
    });

    // Mnemo related
    contextBridge.exposeInMainWorld("mnemoAPI", {
      generateMnemonic: (strength: 256 | 128 | 160 | 192 | 224 = 256) => ipcRenderer.invoke("generateMnemonic", strength),
      mnemonicToSeed: (mnemonic: string, passphrase: string = "") => ipcRenderer.invoke("mnemonicToSeed", mnemonic, passphrase),
    });

    // Wallet related
    contextBridge.exposeInMainWorld("walletAPI", {
      walletFromSeed: (seed: string) => ipcRenderer.invoke("walletFromSeed", seed),
      walletFromPkHex: (pkHex: string) => ipcRenderer.invoke("walletFromPkHex", pkHex),
      getWalletTransactions: (address: string) => ipcRenderer.invoke("getWalletTransactions", address),
      getBalance: (peerUrl: string, address: string) => ipcRenderer.invoke("getBalance", peerUrl, address),
      fetchWarthogPrice: () => ipcRenderer.invoke("fetchWarthogPrice"),
      sendTransaction: (
        recipient: string,
        amount: number,
        fee: number,
        privateKey: string,
        peerUrl: string,
      ) => ipcRenderer.invoke("sendTransaction", recipient, amount, fee, privateKey, peerUrl),
      // walletFromPrivateKey: (pkHex: string) => ipcRenderer.invoke("walletFromPrivateKey", pkHex),
      // addressFromPublicKey: (pubKey: string) => ipcRenderer.invoke("addressFromPublicKey", pubKey),
    });
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}