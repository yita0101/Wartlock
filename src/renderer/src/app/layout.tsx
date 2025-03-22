import { Outlet } from 'react-router'
import { SidebarLayout } from './components/SidebarLayout'

const MainLayout = () => {
  return (
    <SidebarLayout>
      <Outlet />
    </SidebarLayout>
  )
}

export default MainLayout
