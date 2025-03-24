import { WalletProvider } from '../wallets/WalletContext'
import { SettingsForm } from './components/SettingsForm'
import { SettingsNavbar } from './components/SettingsNavbar'

const Settings = () => {
  return (
    <WalletProvider>
      <div>
        <SettingsNavbar />
        <main>
          <section className="flex h-page items-center justify-center rounded-[20px] bg-surface p-5">
            <SettingsForm />
          </section>
        </main>
      </div>
    </WalletProvider>
  )
}

export default Settings
