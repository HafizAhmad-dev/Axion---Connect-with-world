import  { Outlet } from 'react-router'
import Header from '../Components/Header'
import Navbar from '../Components/Navbar'
const Layout = () => {
  return (
 <div className="h-screen w-screen flex flex-col">
  {/* Header with fixed height */}
  <Header />

  {/* Main grows but can shrink and scroll */}
  <main className="flex-1 overflow-hidden scrollbar-hide bg-[#8021df]">
    <Outlet />
  </main>

  {/* Navbar with fixed height */}
  <Navbar />
</div>


  )
}

export default Layout
