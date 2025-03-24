import { addToast, cn } from '@heroui/react'
import {
  Sidebar,
  SidebarBody,
  SidebarLink,
} from '@renderer/components/ui/sidebar'
import { useRequest } from 'ahooks'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FiSettings } from 'react-icons/fi'
import { GoHomeFill } from 'react-icons/go'
import { useParams } from 'react-router'
import { Wallet } from '../wallets/types'
import { Logo } from './Logo'
import { SwitchTheme } from './SwitchTheme'

export const SidebarLayout = ({ children }: { children: React.ReactNode }) => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const { walletId } = useParams<{ walletId: string }>()

  const links = [
    {
      label: t('navigation.walletManagement'),
      href: '/',
      icon: <GoHomeFill className="text-text-secondary" size={24} />,
    },
    {
      label: t('navigation.settings'),
      href: '/settings',
      icon: <FiSettings className="text-text-secondary" size={24} />,
    },
  ]

  const { data: wallet } = useRequest<Wallet, any>(
    async () => window.dbAPI.getWalletById(Number(walletId)),
    {
      ready: !!walletId,
      cacheKey: walletId,
    },
  )
  const { data: privateKey } = useRequest<string | null, any>(
    async () => window.storageAPI.getPrivateKey(wallet?.address || ''),
    {
      ready: !!wallet,
    },
  )

  return (
    <div className="flex h-screen w-full flex-1 flex-col overflow-hidden bg-background text-text-primary transition-colors duration-300 md:flex-row">
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10 border-r-2 border-surface *:z-20">
          <Logo />
          <div
            className={cn(
              'flex flex-1 flex-col items-center justify-center overflow-y-auto overflow-x-hidden',
              open && 'w-full',
            )}
          >
            <div className="mt-8 flex w-full flex-col gap-8">
              {links.map((link, idx) => (
                <SidebarLink
                  key={idx}
                  link={link}
                  className="flex items-center gap-9 rounded-xl px-4 py-[14.5px] font-light hover:bg-surface"
                  onClick={(e) => {
                    if (!privateKey || !wallet || !walletId) return
                    e.preventDefault()
                    addToast({
                      title: t('navigation.loggedIn'),
                      description: t('navigation.logoutFirst'),
                      color: 'danger',
                    })
                  }}
                />
              ))}
            </div>
          </div>
          <SwitchTheme />
        </SidebarBody>
      </Sidebar>
      <div className="flex-1 space-y-9 overflow-auto px-2 md:px-7">
        {children}
      </div>
    </div>
  )
}
