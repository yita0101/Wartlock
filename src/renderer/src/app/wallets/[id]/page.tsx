import { useState } from 'react'
import { TransactionsTable } from './components/TransactionsTable'
import { WalletNavbar } from './components/WalletNavbar'
import { useTranslation } from 'react-i18next'

const Wallet = () => {
  const [filterValue, setFilterValue] = useState('')
  const [page, setPage] = useState(1)
  const { t } = useTranslation()

  return (
    <main className="space-y-8">
      <WalletNavbar
        filterValue={filterValue}
        setFilterValue={setFilterValue}
        setPage={setPage}
      />
      <section className="min-h-page rounded-xl bg-surface dark:bg-surface border border-border dark:border-border shadow-md p-4 sm:p-5">
        <h2 className="text-lg font-medium text-text-primary dark:text-text-primary mb-4">
          {t('walletDetails.transactions')}
        </h2>
        <TransactionsTable
          filterValue={filterValue}
          page={page}
          setPage={setPage}
        />
      </section>
    </main>
  )
}

export default Wallet
