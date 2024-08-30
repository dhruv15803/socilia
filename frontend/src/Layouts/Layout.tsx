import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <Navbar/>
      <div className="flex w-full gap-4">
          <Sidebar/>
          <Outlet/>
      </div>
    </>
  );
};

export default Layout;
