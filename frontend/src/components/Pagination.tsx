import { SetStateAction } from "react";

type Props = {
    noOfPages:number;
    setPageNum:React.Dispatch<SetStateAction<number>>;
    pageNum:number;
}

const Pagination = ({noOfPages,setPageNum,pageNum}:Props) => {
    let pages = [];
    for(let i=1;i<=noOfPages;i++) {
        pages.push(i);
    }

    return (
        <>
            <div  className=' cursor-pointer flex items-center justify-center gap-2'>
                {pages.map((page) => {
                    return <div onClick={() => setPageNum(page)} key={page} className={`rounded-full p-2 ${pageNum===page && "bg-gray-600 text-white"} border border-gray-600 hover:bg-gray-600 hover:text-white hover:duration-300`}>
                        {page}
                    </div>
                })}
            </div>
        </>
  )
}

export default Pagination;
