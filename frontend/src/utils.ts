const monthMap:{[key:number]:string} = {
    1: "January",
    2: "February",
    3: "March",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "August",
    9: "September",
    10: "October",
    11: "November",
    12: "December"
};


const hasSpecialChar = (str:string) => {
    const specialChars = "@#$%!&";
    for(let i=0;i<specialChars.length;i++) {
        if(str.includes(specialChars.charAt(i))) {
            return true;
        }
    }
    return false;
}

const postCreatedAt = (dateString:string):string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return `${day}/${month}/${year}`
}

const formatDate = (dateString:string):string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const day = date.getDate();
    const monthNumber = date.getMonth()+1;

    return `${day} ${monthMap[monthNumber]} ${year}`;

}


export {
    hasSpecialChar,
    postCreatedAt,
    formatDate,
}