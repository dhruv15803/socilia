import { backendUrl } from "@/App";
import { User } from "@/types"
import axios from "axios";
import { useEffect, useState } from "react"



export const useSearchUsers = (searchText:string) => {

    const [users,setUsers] = useState<User[]>([]);
    const [isLoading,setIsLoading] = useState<boolean>(false);

    const params = new URLSearchParams();
    params.set("searchText",searchText);

    useEffect(() => {
        const fetchUsers = async () => {
            if(searchText.trim()==="") {
                setUsers([]);
                return;
            };
            try {
                setIsLoading(true);
                const response = await axios.get(`${backendUrl}/api/user/search?${params.toString()}`);
                setUsers(response.data.users);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchUsers();
    }, [searchText]);

    return {users,isLoading};

}