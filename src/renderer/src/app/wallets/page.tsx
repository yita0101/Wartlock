import { WalletsNavbar } from './components/WalletsNavbar'
import { WalletsTable } from './components/WalletsTable'
import { WalletProvider } from './WalletContext'

const Wallets = () => {
  return (
    <WalletProvider>
      <main>
        <WalletsNavbar />
        <section className="h-page rounded-[20px] bg-surface p-5">
          <WalletsTable />
        </section>
      </main>
    </WalletProvider>
  )
}

export default Wallets
