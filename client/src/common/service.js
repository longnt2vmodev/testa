export const DateToShortString = (dateString)=>{
    console.log(dateString);
    const date = new Date(dateString);
    return date.getDate() +'/'+(date.getMonth()+1)+'/'+date.getFullYear();
}

export const DateToShortStringDate = (dateString)=>{
    const date = new Date(dateString);
    return date.getDate() +'/'+(date.getMonth()+1)+'/'+date.getFullYear();
}

export const createNoti = (id_send, id_account, content)=>{
    
}