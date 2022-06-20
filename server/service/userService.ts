import { IHomeInfo } from "../model/IHomeInfo";
import { execute } from "../utils/Repository";

export const selectById = async function(param){
    const res = await execute('select * from home_info where id = ?', Object.values(param));
    return res[0];            
}

export const selectByEmail = async function(param){
    const res = await execute<IHomeInfo>('select * from home_info where email = ?', Object.values(param));
    return res[0];            
}
// const testApp = {
//     email : 'ssj318@naver.com'
// }
export const createId = async function(param){
    const res = await execute<{ affectedRows: number }>(`insert into home_info(email) values ( ? );`,Object.values(param));
    console.log(res);
    
    return res.affectedRows > 0;
}

// const testApp2 = {
//     id : 2,
//     email : 'ssj318@naver.com'
// }

// export const updateEmail = async function(param){
//     const res = await execute<{ affectedRows: number }>(`
//      update home_info 
//         set email = $2
//         where id = $1
//     `,Object.values(param));
//     return res.affectedRows > 0;
// }

// const testApp3 = {
//     id : 2
// }

export const deleteByEmail = async function(param){
    // console.log(param);
    const res = await execute<{ affectedRows: number }>(
        `delete from home_info 
        where email = ?`,
        Object.values(param)
    );
    // console.log(res);
    return res.affectedRows > 0;
}