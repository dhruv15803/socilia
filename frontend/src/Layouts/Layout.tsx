import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <Navbar/>
      <div className="flex gap-4 w-full">
        <Sidebar/>
        <Outlet/>
      </div>
    </>
  );
};

export default Layout;
