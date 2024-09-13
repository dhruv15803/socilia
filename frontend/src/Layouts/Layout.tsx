import Sidebar from "@/components/Sidebar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
    <div className="flex justify-center">
      <Sidebar/>
      <div className="ml-32 md:ml-48 w-full">
        <Outlet/>
      </div>
    </div>
    </>
  );
};

export default Layout;
