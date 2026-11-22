
import { Outlet } from "react-router";

import Header from "../Components/Header";
import Navbar from "../Components/Navbar";
import { useAuth } from "../hooks/useAuth.hook";
import AuthLoading from "../Components/AuthLoading";

const Layout = () => {
  const { isAuthChecked } = useAuth();

  if (!isAuthChecked) {
    return <AuthLoading />;
  }

  return (
  <div className="h-dvh w-screen flex flex-col overflow-hidden">
  {/* Header stays at the top */}
  <Header />

  {/* Main takes all remaining space */}
  <main className="flex-1 min-h-0 overflow-y-auto scrollbar-hide bg-[#8021df]">
    <Outlet />
  </main>

  {/* Navbar stays at the bottom */}
  <Navbar />
</div>
  );
};

export default Layout;
