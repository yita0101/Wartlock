import {
  Button,
  Tooltip,
  addToast,
} from '@heroui/react'
import { useCallback, useMemo, useState } from 'react'
import { IoCalendarOutline } from 'react-icons/io5'
import { LuWallet } from 'react-icons/lu'
import { MdOutlineRadar } from 'react-icons/md'
import { RiMoneyEuroCircleLine } from 'react-icons/ri'
import { TbChevronLeft, TbChevronRight } from 'react-icons/tb'
import { type Wallet } from '../types'
import { useWallet } from '../WalletContext'
import { PasswordModal } from './PasswordModal'
import { useTranslation } from 'react-i18next'
import { MdContentCopy } from 'react-icons/md'

export const WalletsTable = () => {
  const { t } = useTranslation()
  const { wallets, loading } = useWallet()
  const [page, setPage] = useState(1)

  const rowsPerPage = 8 // 调整为适合网格布局的数量

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

  // 格式化地址，只显示前4个和后3个字符
  const formatAddress = (address: string) => {
    if (!address) return ''
    return `${address.slice(0, 4)}...${address.slice(-3)}`
  }

  // 渲染钱包卡片
  const renderWalletCard = (wallet: Wallet) => {
    const copyAddress = async () => {
      try {
        await navigator.clipboard.writeText(wallet.address);
        addToast({
          title: t('common.copied'),
          description: t('wallets.addressCopied'),
          color: 'success',
        });
      } catch (err) {
        console.error('复制地址失败:', err);
      }
    };

    return (
      <div 
        key={wallet.id} 
        className="group border border-surface-hover rounded-lg p-5 bg-surface hover:bg-surface-hover transition-all duration-300 cursor-pointer flex flex-col space-y-5 h-full relative shadow-sm hover:shadow-md"
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <LuWallet size={22} className="text-primary" />
            <h3 className="font-bold text-lg text-text-primary">{wallet.name}</h3>
          </div>
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <Tooltip 
              content={wallet.address} 
              placement="top" 
              classNames={{
                content: "bg-surface-hover dark:bg-surface border border-border text-text-primary dark:text-text-primary px-3 py-2 shadow-md text-sm font-medium break-all max-w-[280px]",
              }}
            >
              <Button
                isIconOnly
                size="sm"
                variant="flat"
                className="opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-primary/10 hover:bg-primary/20"
                onPress={copyAddress}
                onClick={(e) => e.stopPropagation()}
              >
                <MdContentCopy size={16} className="text-primary" />
              </Button>
            </Tooltip>
            <span id={`wallet-password-btn-${wallet.id}`} className="hidden">
              <PasswordModal walletId={wallet.id} />
            </span>
          </div>
        </div>
        
        <div className="space-y-3 flex-grow">
          <div className="flex items-center gap-2.5">
            <MdOutlineRadar size={18} className="text-primary-light" />
            <span className="text-base text-text-primary font-medium">{formatAddress(wallet.address)}</span>
          </div>
          
          <div className="flex items-center gap-2.5">
            <RiMoneyEuroCircleLine size={18} className="text-primary-light" />
            <span className="text-base text-text-primary font-semibold">
              {wallet.last_balance}
            </span>
          </div>
          
          <div className="flex items-center gap-2.5">
            <IoCalendarOutline size={18} className="text-primary-light" />
            <span className="text-base text-text-secondary">
              {new Date(wallet.last_modified).toLocaleDateString()}
            </span>
          </div>
        </div>
        
        {/* 整个卡片可点击区域，点击时触发密码模态框 */}
        <div 
          className="absolute inset-0 w-full h-full cursor-pointer" 
          onClick={() => document.getElementById(`wallet-password-btn-${wallet.id}`)?.querySelector('button')?.click()}
          aria-hidden="true"
        />
      </div>
    )
  }

  // 自定义分页控制器
  const renderPagination = () => {
    if (pages <= 1) return null;
    
    const pageNumbers: number[] = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(pages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return (
      <div className="flex items-center justify-center gap-1">
        <Button
          isIconOnly
          variant="flat"
          size="sm"
          isDisabled={page === 1}
          onPress={onPreviousPage}
          className="min-w-8 h-8 rounded-md"
        >
          <TbChevronLeft size={18} />
        </Button>
        
        {startPage > 1 && (
          <>
            <Button
              variant={page === 1 ? "solid" : "flat"}
              size="sm"
              onPress={() => setPage(1)}
              className={`min-w-8 h-8 rounded-md ${page === 1 ? 'bg-primary text-white' : ''}`}
            >
              1
            </Button>
            {startPage > 2 && (
              <span className="px-1 text-text-tertiary">...</span>
            )}
          </>
        )}
        
        {pageNumbers.map((num) => (
          <Button
            key={num}
            variant={page === num ? "solid" : "flat"}
            size="sm"
            onPress={() => setPage(num)}
            className={`min-w-8 h-8 rounded-md ${page === num ? 'bg-primary text-white' : ''}`}
          >
            {num}
          </Button>
        ))}
        
        {endPage < pages && (
          <>
            {endPage < pages - 1 && (
              <span className="px-1 text-text-tertiary">...</span>
            )}
            <Button
              variant={page === pages ? "solid" : "flat"}
              size="sm"
              onPress={() => setPage(pages)}
              className={`min-w-8 h-8 rounded-md ${page === pages ? 'bg-primary text-white' : ''}`}
            >
              {pages}
            </Button>
          </>
        )}
        
        <Button
          isIconOnly
          variant="flat"
          size="sm"
          isDisabled={page === pages}
          onPress={onNextPage}
          className="min-w-8 h-8 rounded-md"
        >
          <TbChevronRight size={18} />
        </Button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="flex justify-center items-center h-[400px]">
          <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : wallets.length === 0 ? (
        <div className="text-center py-12 text-text-tertiary">
          {t('wallets.noWallets')}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((wallet) => renderWalletCard(wallet))}
        </div>
      )}
      
      {wallets.length > 0 && pages > 1 && (
        <div className="flex justify-center mt-8 pb-4">
          {renderPagination()}
        </div>
      )}
    </div>
  )
}
