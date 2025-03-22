import { WalletProvider } from '../wallets/WalletContext'
import { SettingsForm } from './components/SettingsForm'
import { SettingsNavbar } from './components/SettingsNavbar'

const Settings = () => {
  return (
    <WalletProvider>
      <main>
        <SettingsNavbar />
        <section className="flex h-page items-center justify-center rounded-[20px] bg-default-100 p-5">
          <SettingsForm />
        </section>
      </main>
    </WalletProvider>
  )
}

export default Settings
