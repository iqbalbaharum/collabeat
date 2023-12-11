import { Outlet } from 'react-router-dom'
import Header from '../components/Header'
import UserModal from 'components/UserModal'

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="container md:max-w-md mx-auto h-screen text-white pb-[100px] px-2">
      <Header />
      <Outlet />
      <UserModal />
    </div>
  )
}

export default MainLayout
