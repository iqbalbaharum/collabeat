import { Outlet } from 'react-router-dom'

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="container mx-auto text-white pb-[100px]">
      <Outlet />
    </div>
  )
}

export default PublicLayout
