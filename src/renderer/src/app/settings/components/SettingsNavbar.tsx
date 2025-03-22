import {
  NavbarBrand,
  Navbar as NavbarComponent,
  NavbarContent,
  NavbarItem,
} from '@heroui/react'
import { CreateWalletModal } from '../../components/CreateWalletModal'
import { RecoverWalletModal } from '../../components/RecoverWalletModal'

export const SettingsNavbar = () => {
  return (
    <NavbarComponent maxWidth="full" className="bg-transparent py-4">
      <NavbarBrand>
        <h2 className="text-2xl">Settings</h2>
      </NavbarBrand>

      <NavbarContent justify="end">
        <NavbarItem>
          <RecoverWalletModal />
        </NavbarItem>
        <NavbarItem>
          <CreateWalletModal />
        </NavbarItem>
      </NavbarContent>
    </NavbarComponent>
  )
}
