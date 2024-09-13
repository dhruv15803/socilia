import { Link, useNavigate } from "react-router-dom";
import SearchUserSheet from "./SearchUserSheet";
import axios from "axios";
import { backendUrl } from "@/App";
import { useContext } from "react";
import { AppContext } from "@/Context/AppContext";
import { AppContextType } from "@/types";
import { Button } from "./ui/button";
import { CiLogout } from "react-icons/ci";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { RxAvatar } from "react-icons/rx";
import NotificationsSheet from "./NotificationsSheet";
import MessagesSheet from "./MessagesSheet";
import { CiSquarePlus } from "react-icons/ci";
import { useFollowRequests } from "@/hooks/useFollowRequests";

const Sidebar = () => {
  const { loggedInUser, setLoggedInUser } = useContext(AppContext) as AppContextType;
  const navigate = useNavigate();

  const logoutUser = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/auth/logout`, { withCredentials: true });
      console.log(response);
      setLoggedInUser(null);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <aside className="fixed left-0 justify-start h-screen w-fit overflow-y-auto bg-white border-r shadow-md z-50">
      <div className="flex flex-col h-full p-4">
        <Link to="/" className="mb-6">
          <div className="text-2xl font-semibold">Socilia</div>
        </Link>
        {loggedInUser !== null ? (
          <div className="flex flex-col flex-grow space-y-4">
            <SearchUserSheet />
            <NotificationsSheet/>
            <div onClick={() => navigate("/create")} className="flex items-center cursor-pointer gap-2">
              <button className="text-3xl"><CiSquarePlus /></button>
              <span className="font-semibold hidden md:inline">Create Post</span>
            </div>
            <MessagesSheet />
            <div onClick={() => navigate("/profile")} className="flex items-center w-fit gap-2 py-2 cursor-pointer rounded-lg">
              {loggedInUser.user_image ? (
                <img className="rounded-full w-8 h-8" src={loggedInUser.user_image} alt="" />
              ) : (
                <>
                  <button className="text-4xl"><RxAvatar/></button>
                </>
              )}
              <span className="text-lg text-gray-600 font-semibold hidden md:inline">
                {loggedInUser.username}
              </span>
            </div>
            <div className="mt-auto">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <div className="flex items-center gap-2">
                    <button className="text-3xl md:hidden"><CiLogout/></button>
                    <Button variant="outline" className="w-full hidden md:block">Logout</Button>
                  </div>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
                    <AlertDialogDescription></AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={logoutUser}>Confirm</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ) : (
          <div className="mt-auto">
            <Button onClick={() => navigate("/login")} className="w-full">Login</Button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;