import {
  NavbarBrand,
  Navbar as NavbarComponent,
  NavbarContent,
  NavbarItem,
} from '@heroui/react'
import { CreateWalletModal } from '@renderer/app/components/CreateWalletModal'
import { RecoverWalletModal } from '@renderer/app/components/RecoverWalletModal'

export const WalletsNavbar = () => {
  return (
    <NavbarComponent maxWidth="full" className="bg-transparent py-4">
      <NavbarBrand>
        <h2 className="text-2xl">Wallet Management</h2>
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
