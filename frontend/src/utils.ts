

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

export {
    hasSpecialChar,
    postCreatedAt,
}