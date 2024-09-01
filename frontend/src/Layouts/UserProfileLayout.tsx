import { AppContext } from "@/Context/AppContext";
import UserProfile from "@/Pages/UserProfile";
import { AppContextType } from "@/types";
import { useContext } from "react";
import { Navigate, NavLink, Outlet, useParams } from "react-router-dom";

const UserProfileLayout = () => {

  const {loggedInUser} = useContext(AppContext) as AppContextType;

  const {userId} = useParams();
  if(userId===loggedInUser?.id) return <Navigate to="/profile"/>


  return (
    <>
      <div className="flex my-10 flex-col w-full mx-10 md:mx-[20%] lg:mx-[25%] xl:mx-[30%]">
        <UserProfile />
        <div className="flex items-center gap-4 p-2 my-2">
          <NavLink
            end
            to={`/profile/${userId}`}
            className={({ isActive }) =>
              isActive ? "font-semibold underline underline-ofset-4" : ""
            }
          >
            posts
          </NavLink>
          <NavLink
            to={`liked_posts/${userId}`}
            className={({ isActive }) =>
              isActive ? "font-semibold underline underline-ofset-4" : ""
            }
          >
            Liked
          </NavLink>
        </div>
        <Outlet/>
      </div>
    </>
  );
};

export default UserProfileLayout;
