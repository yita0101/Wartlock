import {
  Button,
  Chip,
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/react'
import { useRequest } from 'ahooks'
import React, { useCallback, useMemo } from 'react'
import { HiOutlineCurrencyDollar } from 'react-icons/hi'
import { LuClock } from 'react-icons/lu'
import { RiMoneyPoundCircleLine } from 'react-icons/ri'
import { TbHash } from 'react-icons/tb'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import type { Wallet } from '../../types'
import { Transaction } from '../data'

export const columns = [
  { name: 'HASH', uid: 'hash', icon: <TbHash size={20} /> },
  { name: 'TIMESTAMP', uid: 'timestamp', icon: <LuClock size={20} /> },
  { name: 'AMOUNT', uid: 'amount', icon: <RiMoneyPoundCircleLine size={20} /> },
  { name: 'FEE', uid: 'fee', icon: <HiOutlineCurrencyDollar size={20} /> },
  { name: 'SENDER', uid: 'sender', icon: <TbHash size={20} /> },
  { name: 'RECIPIENT', uid: 'recipient', icon: <TbHash size={20} /> },
]

const PAGE_SIZE = 10

type TransactionsTableProps = {
  filterValue: string
  page: number
  setPage: (value: number) => void
}

export const TransactionsTable = ({
  filterValue,
  page,
  setPage,
}: TransactionsTableProps) => {
  const { walletId } = useParams<{ walletId: string }>()
  const { t } = useTranslation()
  
  const columns = [
    { name: t('walletDetails.tableTitles.hash'), uid: 'hash', icon: <TbHash size={20} /> },
    { name: t('walletDetails.tableTitles.timestamp'), uid: 'timestamp', icon: <LuClock size={20} /> },
    { name: t('walletDetails.tableTitles.amount'), uid: 'amount', icon: <RiMoneyPoundCircleLine size={20} /> },
    { name: t('walletDetails.tableTitles.fee'), uid: 'fee', icon: <HiOutlineCurrencyDollar size={20} /> },
    { name: t('walletDetails.tableTitles.sender'), uid: 'sender', icon: <TbHash size={20} /> },
    { name: t('walletDetails.tableTitles.recipient'), uid: 'recipient', icon: <TbHash size={20} /> },
  ]
  
  const { data: walletAddress, loading: walletLoading } = useRequest<
    Wallet['address'],
    any
  >(async () => {
    if (!walletId) {
      throw new Error('Wallet ID is missing from the URL')
    }

    const walletData = await window.dbAPI.getWalletById(Number(walletId))

    if (walletData?.address) {
      return walletData.address
    } else {
      throw new Error('Wallet address not found')
    }
  })

  const { data: transactions = [], loading: transactionsLoading } = useRequest<
    Transaction[],
    any
  >(
    async () => {
      if (!walletAddress) return []

      const txs = await window.walletAPI.getWalletTransactions(walletAddress)
      return txs || []
    },
    {
      ready: Boolean(walletAddress),
      refreshDeps: [walletAddress],
      pollingInterval: 5000, // Poll every 5 seconds
    },
  )

  const isLoading = walletLoading || transactionsLoading

  const hasSearchFilter = Boolean(filterValue)

  const filteredItems = useMemo(() => {
    if (!hasSearchFilter) return transactions

    return transactions.filter((tx) =>
      tx.sender.toLowerCase().includes(filterValue.toLowerCase()),
    )
  }, [transactions, filterValue])

  const pages = Math.ceil(filteredItems.length / PAGE_SIZE)

  const items = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    const end = start + PAGE_SIZE
    return filteredItems.slice(start, end)
  }, [page, filteredItems])

  const onNextPage = useCallback(() => {
    if (page < pages) setPage(page + 1)
  }, [page, pages])

  const onPreviousPage = useCallback(() => {
    if (page > 1) setPage(page - 1)
  }, [page])

  const bottomContent = useMemo(() => {
    return (
      <div className="flex items-center justify-between px-2 py-2">
        <span className="w-[30%]" />
        <Pagination
          isCompact
          showControls
          showShadow
          color="default"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden w-[30%] justify-end gap-2 sm:flex">
          <Button
            isDisabled={page <= 1}
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
          >
            {t('walletDetails.previous')}
          </Button>
          <Button
            isDisabled={page >= pages}
            size="sm"
            variant="flat"
            onPress={onNextPage}
          >
            {t('walletDetails.next')}
          </Button>
        </div>
      </div>
    )
  }, [items.length, page, pages, hasSearchFilter, t])

  const renderCell = useCallback(
    (transaction: Transaction, columnKey: React.Key) => {
      switch (columnKey) {
        case 'hash':
          return (
            <h3 className="text-balance text-sm text-default-500">
              {transaction.hash}
            </h3>
          )
        case 'timestamp':
          return (
            <p className="text-balance text-center text-sm capitalize text-default-600">
              {new Date(transaction.timestamp).toLocaleString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })}
            </p>
          )
        case 'amount': {
          const amountColor =
            transaction.sender === walletAddress ? 'danger' : 'success'
          return (
            <Chip color={amountColor} size="sm" variant="flat" className="px-4">
              {transaction.amount} WART
            </Chip>
          )
        }
        case 'fee':
          return (
            <Chip color="warning" size="sm" variant="flat" className="px-4">
              {transaction.fee} WART
            </Chip>
          )
        case 'sender':
          return (
            <p className="text-sm text-default-500">{transaction.sender}</p>
          )
        case 'recipient':
          return (
            <p className="text-sm text-default-500">{transaction.recipient}</p>
          )
        default:
          return null
      }
    },
    [walletAddress],
  )

  return (
    <Table
      aria-label="Transactions table"
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      classNames={{ wrapper: 'max-h-[calc(100vh-270px)] scroll-sm' }}
      radius="lg"
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === 'timestamp' ? 'center' : 'start'}
            className="px-8 py-4"
          >
            <div className="flex items-center gap-2.5">
              {column?.icon} {column.name}
            </div>
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        items={items}
        emptyContent={t('walletDetails.noTransactions')}
        isLoading={isLoading}
        className="rounded-[20px] bg-default-100 p-5"
        loadingContent={<Spinner label={t('walletDetails.loading')} />}
      >
        {(item) => (
          <TableRow key={item.hash}>
            {(columnKey) => (
              <TableCell className="py-5">
                {renderCell(item, columnKey)}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
