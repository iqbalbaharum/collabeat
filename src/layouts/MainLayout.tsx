import { Outlet } from 'react-router-dom'
import Header from '../components/Header'
import { Web3Wrapper } from 'App'

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Web3Wrapper>
      <div className="container mx-auto text-white pb-[100px]">
        <Header />
        <Outlet />
      </div>
    </Web3Wrapper>
  )
}

export default MainLayout
