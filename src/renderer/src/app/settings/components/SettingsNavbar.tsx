import {
  NavbarBrand,
  Navbar as NavbarComponent,
  NavbarContent,
  NavbarItem,
} from '@heroui/react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { IoMdArrowBack } from 'react-icons/io'
import { Link } from 'react-router'
import { CreateWalletModal } from '../../components/CreateWalletModal'
import { RecoverWalletModal } from '../../components/RecoverWalletModal'

export const SettingsNavbar: FC = () => {
  const { t } = useTranslation()

  return (
    <>
      <NavbarComponent
        maxWidth="full"
        className="border-b-2 border-default-700 bg-default-900/90 py-4 backdrop-blur-sm dark:border-default-200 dark:bg-default-50/90"
      >
        <div className="container mx-auto flex items-center px-4">
          <NavbarBrand>
            <Link
              to="/"
              className="flex items-center gap-2 text-default-300 transition-colors hover:text-primary-500 dark:text-default-700 dark:hover:text-primary-400"
            >
              <IoMdArrowBack size={20} />
              <span className="font-medium">
                {t('navigation.walletManagement')}
              </span>
            </Link>
          </NavbarBrand>

          <NavbarContent justify="end" className="gap-4">
            <NavbarItem>
              <RecoverWalletModal />
            </NavbarItem>
            <NavbarItem>
              <CreateWalletModal />
            </NavbarItem>
          </NavbarContent>
        </div>
      </NavbarComponent>
    </>
  )
}
