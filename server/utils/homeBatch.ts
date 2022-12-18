import 'dotenv/config';
import * as homeInfo from './HomeInfo';
import * as homeSchema from "../model/schemas/Home.schema";



export const refresh = async( category:any , date:any, result:any ) =>{
    if(!result){
        result = await homeInfo.getAptInfo({
            startmonth : date.start_date,
            endmonth : date.end_date
            // @ts-ignore
        },category, process.env.API_HOST);
    }
    /*
    const homeRateDetail = result.map(async (home:any)=>{
        try{
            const detailInfo = await homeInfo.getDetailInfo({
                houseManageNo : home.HOUSE_MANAGE_NO,
                pblancNo : home.PBLANC_NO
                // @ts-ignore
            },category,process.env.API_HOST);

            const rateList = await homeInfo.getRateInfo({houseManageNo: home.HOUSE_MANAGE_NO, houseSeCd : home.HOUSE_SECD }, process.env.RATE_HOST);
            // console.log(rateList);
            home["HOME_RATES"] = rateList;
            home["HOME_DETAILS"] = detailInfo;
        }catch(e){
            console.log("[ERROR] : ", e);
        }
        home["CRDAT"] = date.start_date;
        return home;
    });

    const homeSave = await Promise.all(homeRateDetail);

    let resultMsg;
    try{
        await Promise.all(homeSave.map(async(home)=>{
            await homeSchema.Home.findOneAndUpdate(
                // @ts-ignore
                { HOUSE_MANAGE_NO : home.HOUSE_MANAGE_NO},
                home,
                { upsert: true, new: true, setDefaultsOnInsert : true }
            )
        }));
        console.log("update completed!");
        resultMsg = "completed!"
    }catch(e){
        console.log("[error] ", e);
        resultMsg = "failed!"
    }
    return resultMsg;
     */
    let resultMsg;
    try{
        const res:any = await Promise.all(result.map(async(home:any)=>{
            home["CRDAT"] = new Date();
            home["CATEGORY"] = category;
            //나머지는 업데이트 하는 식으로 LAZY 업데이트 진행
            await homeSchema.Home.findOneAndUpdate(
                // @ts-ignore
                { HOUSE_MANAGE_NO : home.HOUSE_MANAGE_NO},
                home,
                { upsert: true, new: true, setDefaultsOnInsert : true }
            )
        }));
        resultMsg = "completed!"
    }catch(e){
        console.log("[error] ", e);
        resultMsg = "failed!"
    }

    return resultMsg;
}