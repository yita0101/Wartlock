import {
  addToast,
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
import { LuClock, LuCopy } from 'react-icons/lu'
import { RiMoneyPoundCircleLine } from 'react-icons/ri'
import { TbHash } from 'react-icons/tb'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import type { Wallet } from '../../types'
import { Transaction } from '../data'

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
  const { t } = useTranslation()
  const { walletId } = useParams<{ walletId: string }>()
  
  const columns = [
    { name: t('walletDetails.tableTitles.hash'), uid: 'hash', icon: <TbHash size={18} /> },
    { name: t('walletDetails.tableTitles.timestamp'), uid: 'timestamp', icon: <LuClock size={18} /> },
    { name: t('walletDetails.tableTitles.amount'), uid: 'amount', icon: <RiMoneyPoundCircleLine size={18} /> },
    { name: t('walletDetails.tableTitles.fee'), uid: 'fee', icon: <HiOutlineCurrencyDollar size={18} /> },
    { name: t('walletDetails.tableTitles.sender'), uid: 'sender', icon: <TbHash size={18} /> },
    { name: t('walletDetails.tableTitles.recipient'), uid: 'recipient', icon: <TbHash size={18} /> },
  ]
  
  const PAGE_SIZE = 10

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
  
  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text)
    addToast({
      title: t('walletDetails.copied'),
      color: 'success',
      timeout: 1500,
    })
  }, [t])

  const bottomContent = useMemo(() => {
    return (
      <div className="flex items-center justify-between px-2 py-2">
        <span className="w-[30%]" />
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
          classNames={{
            cursor: "bg-primary",
            item: "text-text-primary",
          }}
        />
        <div className="hidden w-[30%] justify-end gap-2 sm:flex">
          <Button
            isDisabled={page <= 1}
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
            className="text-text-primary"
          >
            {t('walletDetails.previous')}
          </Button>
          <Button
            isDisabled={page >= pages}
            size="sm"
            variant="flat"
            onPress={onNextPage}
            className="text-text-primary"
          >
            {t('walletDetails.next')}
          </Button>
        </div>
      </div>
    )
  }, [page, pages, onPreviousPage, onNextPage, t])

  const renderCell = useCallback(
    (transaction: Transaction, columnKey: React.Key) => {
      switch (columnKey) {
        case 'hash':
          return (
            <div 
              className="flex items-center gap-2 group cursor-pointer" 
              onClick={() => copyToClipboard(transaction.hash)}
            >
              <h3 className="text-balance text-sm text-text-secondary">
                {transaction.hash}
              </h3>
              <LuCopy size={14} className="text-text-tertiary opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          )
        case 'timestamp':
          return (
            <p className="text-balance text-sm text-text-secondary">
              {new Date(transaction.timestamp).toLocaleString(undefined, {
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
            <Chip 
              color={amountColor} 
              size="sm" 
              variant="flat" 
              className="px-3 font-medium"
            >
              {transaction.amount} WART
            </Chip>
          )
        }
        case 'fee':
          return (
            <Chip 
              color="warning" 
              size="sm" 
              variant="flat" 
              className="px-3 font-medium"
            >
              {transaction.fee} WART
            </Chip>
          )
        case 'sender':
          return (
            <div 
              className="flex items-center gap-2 group cursor-pointer" 
              onClick={() => copyToClipboard(transaction.sender)}
            >
              <p className="text-sm text-text-secondary truncate max-w-[120px] sm:max-w-[180px]">
                {transaction.sender}
              </p>
              <LuCopy size={14} className="text-text-tertiary opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          )
        case 'recipient':
          return (
            <div 
              className="flex items-center gap-2 group cursor-pointer" 
              onClick={() => copyToClipboard(transaction.recipient)}
            >
              <p className="text-sm text-text-secondary truncate max-w-[120px] sm:max-w-[180px]">
                {transaction.recipient}
              </p>
              <LuCopy size={14} className="text-text-tertiary opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          )
        default:
          return null
      }
    },
    [walletAddress, copyToClipboard],
  )

  return (
    <Table
      aria-label="Transactions table"
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      classNames={{ 
        wrapper: 'max-h-[calc(100vh-320px)] scroll-sm bg-background dark:bg-background',
        thead: 'bg-surface-hover dark:bg-surface-hover',
        th: 'text-text-primary dark:text-text-primary font-medium text-sm py-3',
        td: 'border-t border-border dark:border-border',
      }}
      className="rounded-lg overflow-hidden"
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn key={column.uid} align="start">
            <div className="flex items-center gap-2 text-text-primary">
              {column.icon} {column.name}
            </div>
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        emptyContent={t('walletDetails.noTransactions')}
        items={items}
        isLoading={isLoading}
        loadingContent={<Spinner color="primary" />}
      >
        {(item) => (
          <TableRow key={item.hash} className="hover:bg-surface-hover dark:hover:bg-surface-hover transition-colors">
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
