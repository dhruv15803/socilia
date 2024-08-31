import UserProfile from "@/Pages/UserProfile";
import { NavLink, Outlet } from "react-router-dom";

const UserProfileLayout = () => {
  return (
    <>
      <div className="flex my-10 flex-col w-full mx-10 md:mx-[20%] lg:mx-[25%] xl:mx-[30%]">
        <UserProfile />
        <div className="flex items-center gap-4 p-2 my-2">
          <NavLink
            end
            to="."
            className={({ isActive }) =>
              isActive ? "font-semibold underline underline-ofset-4" : ""
            }
          >
            posts
          </NavLink>
          <NavLink
            to="liked_posts"
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
