import {
  NavbarBrand,
  Navbar
} from '@heroui/react'
import { useTranslation } from 'react-i18next'

export const SettingsNavbar = () => {
  const { t } = useTranslation()
  
  return (
    <Navbar maxWidth="full" className="bg-transparent py-6 px-4">
      <NavbarBrand>
        <h2 className="text-3xl font-bold text-black dark:text-white">{t('settings.title')}</h2>
      </NavbarBrand>

      {/* <NavbarContent justify="end">
        <NavbarItem>
          <RecoverWalletModal />
        </NavbarItem>
        <NavbarItem>
          <CreateWalletModal />
        </NavbarItem>
      </NavbarContent> */}
    </Navbar>
  )
}
