import { useRequest } from 'ahooks'
import { createContext, useContext } from 'react'
import type { Wallet } from './types'

export const WalletContext = createContext<{
  wallets: Wallet[]
  loading: boolean
  refreshAsync: () => Promise<Wallet[]>
}>(null as any)

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    data: wallets = [],
    loading,
    refreshAsync,
  } = useRequest<Wallet[], any>(window.dbAPI.getWallets, {
    cacheKey: 'wallets',
  })

  return (
    <WalletContext.Provider value={{ wallets, loading, refreshAsync }}>
      {children}
    </WalletContext.Provider>
  )
}

export const useWallet = () => {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider')
  }

  return context
}
