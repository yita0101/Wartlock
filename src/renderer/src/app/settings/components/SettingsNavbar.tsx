import {
  NavbarBrand,
  Navbar as NavbarComponent,
  NavbarContent,
  NavbarItem,
  Divider
} from '@heroui/react'
import { CreateWalletModal } from '../../components/CreateWalletModal'
import { RecoverWalletModal } from '../../components/RecoverWalletModal'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { IoMdArrowBack } from 'react-icons/io'

export const SettingsNavbar = () => {
  const { t } = useTranslation()
  
  return (
    <>
      <NavbarComponent 
        maxWidth="full" 
        className="bg-default-50/90 dark:bg-default-900/90 backdrop-blur-sm py-4 border-b border-default-200 dark:border-default-700"
      >
        <div className="container mx-auto px-4 flex items-center">
          <NavbarBrand>
            <Link to="/" className="flex items-center gap-2 text-default-700 dark:text-default-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">
              <IoMdArrowBack size={20} />
              <span className="font-medium">{t('navigation.walletManagement')}</span>
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
      <Divider className="opacity-0" />
    </>
  )
}
