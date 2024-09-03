import { Link, useNavigate } from "react-router-dom";  
import SearchUserSheet from "./SearchUserSheet";  
import axios from "axios";  
import { backendUrl } from "@/App";  
import { useContext } from "react";  
import { AppContext } from "@/Context/AppContext";  
import { AppContextType } from "@/types";  
import { Button } from "./ui/button";  
import { CiSquarePlus } from "react-icons/ci";  
import { IoIosNotificationsOutline } from "react-icons/io";
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
  
const Sidebar = () => {  
  
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
    <aside className="w-fit h-full fixed left-0 overflow-y-auto bg-white border-r md:p-8 p-4">  
      <div className="flex flex-col gap-4">  
        <Link to="/">  
          {" "}  
          <div className="text-2xl font-semibold md:block hidden">Socilia</div>  
        </Link>  
        {loggedInUser !== null ? (  
       <>  
        <div className="flex flex-col gap-4">  
          <SearchUserSheet/>  
          <NotificationsSheet/>
          <div onClick={() => navigate("/create")} className="flex items-center cursor-pointer gap-2">  
           <button className="text-3xl"><CiSquarePlus/></button>           
           <span className="font-semibold md:block hidden">Create Post</span>  
          </div>  
          <div onClick={() => navigate("/profile")} className="flex items-center border border-white gap-1 py-2 cursor-pointer hover:border hover:border-black hover:rounded-lg hover:px-4 hover:py-2 hover:duration-300">  
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
           <span className="text-xl text-gray-600 font-semibold hover:text-black hover:duration-300 md:block hidden">  
            {loggedInUser.username}  
           </span>  
          </div>  
          <AlertDialog>  
           <AlertDialogTrigger asChild>  
            <Button variant={"outline"}>Logout</Button>  
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
    </aside>  
   </>  
  );  
};  
  
export default Sidebar;