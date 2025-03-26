import { FC } from 'react'
import { WalletsNavbar } from './components/WalletsNavbar'
import { WalletsTable } from './components/WalletsTable'
import { WalletProvider } from './WalletContext'

const Wallets: FC = () => {
  return (
    <WalletProvider>
      <main>
        <WalletsNavbar />
        <section className="h-page rounded-[20px] bg-default-100 p-5">
          <WalletsTable />
        </section>
      </main>
    </WalletProvider>
  )
}

export default Wallets
