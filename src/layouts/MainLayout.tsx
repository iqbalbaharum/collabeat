import { Outlet } from 'react-router-dom'
import Header from '../components/Header'

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="container mx-auto text-white pb-[100px] px-2">
      <Header />
      <Outlet />
    </div>
  )
}

export default MainLayout
