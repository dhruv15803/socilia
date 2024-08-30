import { useEffect, useState } from "react"


export const useDebounce = (value:string,delay=500) => {
    const [debouncedValue,setDebouncedValue] = useState<string>("");

    useEffect(() => {

        const timeout = setTimeout(() => {
            setDebouncedValue(value);
        },delay)

        return () => clearTimeout(timeout);

    },[value])

    return debouncedValue;

}