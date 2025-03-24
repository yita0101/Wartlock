import { useTranslation } from 'react-i18next'
import { WalletProvider } from '../wallets/WalletContext'
import { SettingsForm } from './components/SettingsForm'
import { SettingsNavbar } from './components/SettingsNavbar'

const Settings = () => {
  const { t } = useTranslation()

  return (
    <WalletProvider>
      <div className="flex h-full flex-col">
        <SettingsNavbar />
        <main className="px-4 pb-8">
          <section className="flex min-h-page items-start justify-center rounded-xl bg-surface p-8 shadow-xl border-2 border-border">
            <SettingsForm />
          </section>
        </main>
      </div>
    </WalletProvider>
  )
}

export default Settings
