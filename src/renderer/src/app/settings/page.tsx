import type { FC } from 'react'
import { WalletProvider } from '../wallets/WalletContext'
import { SettingsForm } from './components/SettingsForm'
import { SettingsNavbar } from './components/SettingsNavbar'

const Settings: FC = () => {
  return (
    <WalletProvider>
      <main className="min-h-screen bg-gradient-to-b from-default-50 to-default-100">
        <SettingsNavbar />
        <div className="container mx-auto px-4">
          <section className="flex h-page items-center justify-center">
            <SettingsForm />
          </section>
        </div>
      </main>
    </WalletProvider>
  )
}

export default Settings
