import { useRequest } from 'ahooks'
import { createContext, useContext, type FC } from 'react'
import type { Wallet } from './types'

type WalletContextType = {
  wallets: Wallet[]
  loading: boolean
  refreshAsync: () => Promise<Wallet[]>
}

export const WalletContext = createContext<{
  wallets: Wallet[]
  loading: boolean
  refreshAsync: () => Promise<Wallet[]>
} | null>(null)

export const WalletProvider: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const {
    data: wallets = [],
    loading,
    refreshAsync,
  } = useRequest<Wallet[], Error[]>(window.dbAPI.getWallets, {
    cacheKey: 'wallets',
  })

  return (
    <WalletContext.Provider value={{ wallets, loading, refreshAsync }}>
      {children}
    </WalletContext.Provider>
  )
}

export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider')
  }

  return context
}
