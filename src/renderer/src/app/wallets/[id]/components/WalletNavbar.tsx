import { Button, Chip, Input, Navbar as NavbarComponent } from '@heroui/react'
import { useRequest } from 'ahooks'
import { useCallback, type FC } from 'react'
import { useTranslation } from 'react-i18next'
import { LuSearch } from 'react-icons/lu'
import { RiLogoutCircleRLine } from 'react-icons/ri'
import { useNavigate, useParams } from 'react-router'
import { CreateTransactionModal } from './CreateTransactionModal'
import { ReceiveWartModal } from './ReceiveWartModal'

type Wallet = {
  name: string
  address: string
  balanceWART: number
  balanceUSD: number
}

type WalletNavbarProps = {
  filterValue: string
  setFilterValue: (value: string) => void
  setPage: (value: number) => void
}

export const WalletNavbar: FC<WalletNavbarProps> = ({
  filterValue,
  setFilterValue,
  setPage,
}) => {
  const { walletId } = useParams<{ walletId: string }>()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { data: walletData, loading: walletLoading } = useRequest<
    Wallet,
    Error[]
  >(
    async () => {
      if (!walletId) {
        throw new Error('Wallet ID is missing from the URL')
      }

      return (await window.dbAPI.getWalletById(Number(walletId))) as Wallet
    },
    {
      cacheKey: walletId,
      refreshDeps: [walletId],
      ready: !!walletId,
    },
  )

  const { data: balanceData } = useRequest<
    { balanceWART: string | null; balanceUSD: number },
    Error[]
  >(
    async () => {
      if (!walletData) {
        throw new Error('Wallet Data is missing')
      }

      // Check if data is expired
      const cachedData = window.sessionStorage.getItem(`${walletId}-balance`)
      if (cachedData) {
        const parsedData = JSON.parse(cachedData)
        const expirationTime = new Date(parsedData.expirationTime)
        if (expirationTime < new Date()) {
          window.sessionStorage.removeItem(`${walletId}-balance`)
        } else {
          return parsedData
        }
      }

      // Fetch peer and WART balance
      const peer = await window.dbAPI.getPeer()
      const balanceWART = await window.walletAPI.getBalance(
        peer,
        walletData.address,
      )

      // Fetch WART price
      const wartPrice = await window.walletAPI.fetchWarthogPrice()
      const numericBalanceWART = balanceWART ? parseFloat(balanceWART) : 0

      // Calculate USD balance
      const balanceUSD = numericBalanceWART * wartPrice

      // Save data in session storage with 5 minutes expiration time
      const now = new Date()
      const expirationTime = new Date(now.getTime() + 5 * 60 * 1000)
      window.sessionStorage.setItem(
        `${walletId}-balance`,
        JSON.stringify({
          balanceWART,
          balanceUSD,
          expirationTime: expirationTime.toISOString(),
        }),
      )

      return {
        balanceWART,
        balanceUSD,
      }
    },
    {
      cacheKey: `${walletId}-balance`,
      refreshDeps: [walletId],
      cacheTime: 5 * 60 * 1000, // 5 minutes
      staleTime: 5 * 60 * 1000, // 5 minutes
      pollingInterval: 5000, // Poll every 5 seconds,
      ready: !!walletData,
    },
  )

  const onClear = useCallback(() => {
    setFilterValue('')
    setPage(1)
  }, [setFilterValue, setPage])

  const onSearchChange = useCallback(
    (value?: string) => {
      if (value) {
        setFilterValue(value)
        setPage(1)
      } else {
        setFilterValue('')
      }
    },
    [setFilterValue, setPage],
  )

  const handleLogout = async (): Promise<void> => {
    if (walletData?.address) {
      await window.storageAPI.deletePrivateKey(String(walletData.address))
    }
    navigate('/')
  }

  return (
    <NavbarComponent
      maxWidth="full"
      className="bg-transparent py-4"
      classNames={{ wrapper: 'block space-y-6' }}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl">
          {walletLoading
            ? t('walletDetails.loading')
            : walletData
              ? `${walletData.name}'s ${t('walletDetails.wallet')}`
              : t('walletDetails.walletNotFound')}
        </h2>

        <div className="flex items-center justify-center gap-4">
          <Chip variant="dot" color="warning">
            <span className="font-light">{t('walletDetails.balanceWART')}</span>
            :{' '}
            <span className="font-medium text-warning">
              {balanceData?.balanceWART ?? t('walletDetails.loading')}
            </span>
          </Chip>
          <Chip variant="dot" color="success">
            <span className="font-light">{t('walletDetails.balanceUSD')}</span>:{' '}
            <span className="font-medium text-success">
              {balanceData?.balanceUSD !== undefined
                ? `${balanceData.balanceUSD.toFixed(2)}`
                : t('walletDetails.loading')}
            </span>
          </Chip>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <Input
          isClearable
          className="w-full sm:max-w-[33%]"
          placeholder={t('walletDetails.searchBySender')}
          startContent={<LuSearch className="text-default-400" />}
          value={filterValue}
          onClear={onClear}
          onValueChange={onSearchChange}
        />

        <div className="flex items-center gap-6">
          <ReceiveWartModal address={walletData?.address} />
          <CreateTransactionModal />
          <Button
            color="danger"
            variant="bordered"
            isIconOnly
            onPress={handleLogout}
            isLoading={walletLoading}
          >
            <RiLogoutCircleRLine size={20} />
          </Button>
        </div>
      </div>
    </NavbarComponent>
  )
}
