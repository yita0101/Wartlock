import type { FC } from 'react'
import { Outlet } from 'react-router'
import { SidebarLayout } from './components/SidebarLayout'

const MainLayout: FC = () => {
  return (
    <SidebarLayout>
      <Outlet />
    </SidebarLayout>
  )
}

export default MainLayout
