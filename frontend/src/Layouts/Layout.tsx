import Sidebar from "@/components/Sidebar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
    <div className="flex justify-center">
      <Sidebar />
      <Outlet />
    </div>
    </>
  );
};

export default Layout;
