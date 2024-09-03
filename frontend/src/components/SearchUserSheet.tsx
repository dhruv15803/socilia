import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SearchIcon } from "lucide-react";
import { Input } from "./ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { useSearchUsers } from "@/hooks/useSearchUsers";
import Loader from "./Loader";
import { RxAvatar } from "react-icons/rx";
import { useNavigate } from "react-router-dom";

const SearchUserSheet = () => {
    const [searchText,setSearchText] = useState<string>("");
    const debouncedSearchText = useDebounce(searchText);
    const {isLoading,users} = useSearchUsers(debouncedSearchText);
    const navigate = useNavigate();    

    return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <div className="flex items-center gap-2 cursor-pointer">
            <SearchIcon />
            <span className="font-semibold">search</span>
          </div>
        </SheetTrigger>
        <SheetContent side={"left"}>
          <SheetHeader>
            <SheetTitle>Search users</SheetTitle>
            <SheetDescription></SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-4">
            <Input value={searchText} onChange={(e) => setSearchText(e.target.value)} type="text" placeholder="search for user"/>
            {isLoading ? <>
                <div className="flex items-center justify-center">
                    <Loader height="40" width="40" color="black"/>
                </div>
            </> : <>
                {users.map((user) => {
                return <div onClick={() => navigate(`/profile/${user.id}`)} key={user.id} className="cursor-pointer flex items-center gap-2 p-2 hover:bg-gray-50 hover:duration-300">
                    {user.user_image!==null ? <><img className="rounded-full w-12" src={user.user_image} alt="" /></> : <><button className="text-3xl"><RxAvatar/></button></>}
                    <span className="font-semibold">{user.username}</span>
                </div>
            })}
            </>}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default SearchUserSheet;
