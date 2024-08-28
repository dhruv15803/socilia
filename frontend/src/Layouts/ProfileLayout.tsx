import Profile from "@/Pages/Profile";
import { Outlet } from "react-router-dom";
import { NavLink } from "react-router-dom";

const ProfileLayout = () => {
  return (
    <>
      <div className="flex my-10 flex-col mx-10 md:mx-[20%] lg:mx-[25%] xl:mx-[30%] ">
        <Profile />
        <div className="text-xl flex items-center gap-4 p-2 my-2 border-b">
          <NavLink
            end
            to="."
            className={({ isActive }) =>
              isActive ? " font-semibold underline underline-offset-4" : ""
            }
          >
            posts
          </NavLink>
          <NavLink
            to="liked_posts"
            className={({ isActive }) =>
              isActive ? " font-semibold underline underline-offset-4" : ""
            }
          >
            Liked
          </NavLink>
        </div>
        <Outlet />
      </div>
    </>
  );
};

export default ProfileLayout;
