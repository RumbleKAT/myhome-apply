import { IHomeApply } from "../model/IHomeApply";
import { execute } from "../utils/Repository";

export const selectByUserId = async function(param){
    const res = await execute<IHomeApply[]>(`select * from home_info as a 
                                            inner join home_apply as b 
                                            on a.id = b.home_info_id 
                                        where b.home_info_id = ?;`, 
                                        Object.values(param));
    return res;
}

// const testApp = {
//     houseManageNo : '2021950013',
//     pblancNo : '2021950013',
//     houseDetailSecdNm : '오피스텔',
//     houseNm : '의정부 고산지구 라피네트',
//     bsnsMbyNm : '주식회사 한강주택산업',
//     rcritPblancDe : '20210329',
//     rceptBgnde : '2021-04-05',
//     rceptEndde : '2021-04-05',
//     przwnerPresnatnDe : '2021-04-08',
//     home_info_id : 1
// };

export const createApply = async function(param){
    console.log(Object.values(param));
    const res = await execute<{ affectedRows: number }>(`insert into home_apply(
                                        houseManageNo, 
                                        pblancNo, 
                                        houseDetailSecdNm, 
                                        houseNm,
                                        bsnsMbyNm, 
                                        rcritPblancDe, 
                                        rceptBgnde,
                                        rceptEndde,
                                        przwnerPresnatnDe,
                                        home_info_id
                                        )
                                        values (
                                            ?, 
                                            ?, 
                                            ?, 
                                            ?,
                                            ?, 
                                            ?, 
                                            ?,
                                            ?,
                                            ?,
                                            ?
                                        );`,
                                    Object.values(param));
    return res.affectedRows > 0;
}

// const testApp_2 = {
//     id : 1,
//     houseManageNo : '2021950013',
//     pblancNo : '2021950013',
//     houseDetailSecdNm : '오피스텔',
//     houseNm : '의정부 고산지구 라피네트2',
//     bsnsMbyNm : '주식회사 한강주택산업',
//     rcritPblancDe : '20210329',
//     rceptBgnde : '2021-04-05',
//     rceptEndde : '2021-04-05',
//     przwnerPresnatnDe : '2021-04-08',
//     home_info_id : 1
// };    

// export const updateApply = async function(param){
//     const res = await execute<{ affectedRows: number }>(`
//                     update home_apply 
//                         set houseManageNo = $2,
//                             pblancNo = $3,
//                             houseDetailSecdNm = $4, 
//                             houseNm = $5,
//                             bsnsMbyNm = $6,
//                             rcritPblancDe = $7, 
//                             rceptBgnde = $8,
//                             rceptEndde = $9,
//                             przwnerPresnatnDe = $10
//                         where id = $1
//                         and home_info_id = $11
//                         `,Object.values(param));
//     return res.affectedRows > 0;
// }

// const testApp_3 = {
//     id : 1
// };    

export const deleteApply = async function(param){
    const res = await execute<{ affectedRows: number }>(`
                delete from home_apply
                    where id = ?
                    `,Object.values(param))
    
    return res.affectedRows > 0;
}

export const deleteApplyByUserId = async function(param){
    const res = await execute<{ affectedRows: number }>(`
                delete from home_apply
                    where home_info_id = ?
                    `,Object.values(param))
    
    return res.affectedRows > 0;
}

export const getSchedules = async function(param){
    // console.log(param);
    const res = await execute<IHomeApply[]>(`
                        select * from home_info as a 
                            inner join home_apply as b 
                        on a.id = b.home_info_id 
                    where b.rceptbgnde = $1; 
                `,Object.values(param))
    return res;
}