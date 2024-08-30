import { useContext } from "react";
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "@/Context/AppContext";
import { AppContextType } from "@/types";
import { RxAvatar } from "react-icons/rx";
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
import axios from "axios";
import { backendUrl } from "@/App";


const Navbar = () => {
  const { loggedInUser,setLoggedInUser} = useContext(AppContext) as AppContextType;
  const navigate = useNavigate();

  const logoutUser = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/auth/logout`,{withCredentials:true});
      console.log(response);
      setLoggedInUser(null);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div className="flex items-center p-2 justify-between border-b md:px-10 fixed top-0 w-full bg-white">
        <Link to="/">
          {" "}
          <div className="text-2xl font-semibold">Socilia</div>
        </Link>
        {loggedInUser !== null ? (
          <>
            <div className="flex items-center gap-8">
              <Button onClick={() => navigate("/create")} variant="outline">Create post</Button>
              <div onClick={() => navigate("/profile")} className="flex items-center border border-white gap-1 px-4 py-2 cursor-pointer hover:border hover:border-black hover:rounded-lg hover:px-4 hover:py-2 hover:duration-300">
                {loggedInUser.user_image !== null ? (
                  <>
                    <img
                      className="rounded-full w-8"
                      src={loggedInUser.user_image}
                      alt=""
                    />
                  </>
                ) : (
                  <>
                    <button className="text-4xl text-gray-600 hover:text-black hover:duration-300"><RxAvatar/></button>
                  </>
                )}
                <span className="text-xl text-gray-600 font-semibold hover:text-black hover:duration-300">
                  {loggedInUser.username}
                </span>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button>Logout</Button>
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
          </>
        ) : (
          <>
            <div className="flex items-center">
              <Button onClick={() => navigate("/login")}>Login</Button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Navbar;
