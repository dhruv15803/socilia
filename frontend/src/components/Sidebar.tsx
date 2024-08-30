import { SearchIcon } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Input } from "./ui/input";
import SearchUserSheet from "./SearchUserSheet";

const Sidebar = () => {
  return (
    <>
      <aside className="w-fit h-full fixed left-0 top-16 overflow-y-auto bg-white border-r">
        <div className="flex flex-col gap-4 p-8">
            <SearchUserSheet/>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
