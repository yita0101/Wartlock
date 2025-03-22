import {
  Button,
  Chip,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/react'
import { useCallback, useMemo, useState } from 'react'
import { IoCalendarOutline } from 'react-icons/io5'
import { LuWallet } from 'react-icons/lu'
import { MdOutlineRadar } from 'react-icons/md'
import { RiMoneyEuroCircleLine } from 'react-icons/ri'
import { type Wallet } from '../types'
import { useWallet } from '../WalletContext'
import { PasswordModal } from './PasswordModal'

export const columns = [
  { name: 'NAME', uid: 'name', icon: <LuWallet size={20} /> },
  { name: 'ADDRESS', uid: 'address', icon: <MdOutlineRadar size={20} /> },
  {
    name: 'LAST BALANCE',
    uid: 'lastIdentifiedBalance',
    icon: <RiMoneyEuroCircleLine size={20} />,
  },
  {
    name: 'LAST DATE',
    uid: 'lastIdentifiedDate',
    icon: <IoCalendarOutline size={20} />,
  },
  { name: 'ACTIONS', uid: 'actions' },
]

export const WalletsTable = () => {
  const { wallets, loading } = useWallet()
  const [page, setPage] = useState(1)

  const rowsPerPage = 10

  const pages = Math.ceil(wallets.length / rowsPerPage)

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage
    const end = start + rowsPerPage

    return wallets.slice(start, end)
  }, [page, wallets, rowsPerPage])

  const onNextPage = useCallback(() => {
    if (page < pages) {
      setPage(page + 1)
    }
  }, [page, pages])

  const onPreviousPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1)
    }
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
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
          >
            Previous
          </Button>
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    )
  }, [items.length, page, pages])

  const renderCell = useCallback((wallet: Wallet, columnKey: React.Key) => {
    const cellValue = wallets[columnKey as keyof Wallet]

    switch (columnKey) {
      case 'name':
        return (
          <h3 className="text-bold text-sm capitalize text-default-700">
            {wallet.name}
          </h3>
        )
      case 'address':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">{cellValue}</p>
            <p className="text-bold text-sm text-default-400">
              {wallet.address}
            </p>
          </div>
        )
      case 'lastIdentifiedBalance':
        return (
          <Chip
            className="capitalize"
            color="secondary"
            size="sm"
            variant="flat"
          >
            {wallet.last_balance}
          </Chip>
        )
      case 'lastIdentifiedDate':
        return (
          <Chip className="capitalize" color="danger" size="sm" variant="flat">
            {new Date(wallet.last_modified).toDateString()}
          </Chip>
        )
      case 'actions':
        return <PasswordModal walletId={wallet.id} />
      default:
        return cellValue
    }
  }, [])

  return (
    <Table
      aria-label="Wallets Table"
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      classNames={{ wrapper: 'max-h-[calc(100vh-240px)] scroll-sm' }}
      radius="lg"
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={
              [
                'actions',
                'lastIdentifiedBalance',
                'lastIdentifiedDate',
              ].includes(column.uid)
                ? 'center'
                : 'start'
            }
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
        emptyContent="No wallets"
        isLoading={loading}
        className="rounded-[20px] bg-default-100 p-5"
      >
        {(item) => (
          <TableRow key={item.id}>
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
