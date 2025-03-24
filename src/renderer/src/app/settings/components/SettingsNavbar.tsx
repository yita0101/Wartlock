import {
  NavbarBrand,
  Navbar as NavbarComponent,
  NavbarContent,
  NavbarItem,
} from '@heroui/react'
import { useTranslation } from 'react-i18next'
import { CreateWalletModal } from '../../components/CreateWalletModal'
import { RecoverWalletModal } from '../../components/RecoverWalletModal'

export const SettingsNavbar = () => {
  const { t } = useTranslation()
  
  return (
    <NavbarComponent maxWidth="full" className="bg-transparent py-6">
      <NavbarBrand>
        <h2 className="text-2xl font-bold text-text-primary">{t('settings.title')}</h2>
      </NavbarBrand>

      {/* <NavbarContent justify="end">
        <NavbarItem>
          <RecoverWalletModal />
        </NavbarItem>
        <NavbarItem>
          <CreateWalletModal />
        </NavbarItem>
      </NavbarContent> */}
    </NavbarComponent>
  )
}
