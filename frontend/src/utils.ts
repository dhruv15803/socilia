

const hasSpecialChar = (str:string) => {
    const specialChars = "@#$%!&";
    for(let i=0;i<specialChars.length;i++) {
        if(str.includes(specialChars.charAt(i))) {
            return true;
        }
    }
    return false;
}

export {
    hasSpecialChar,
}