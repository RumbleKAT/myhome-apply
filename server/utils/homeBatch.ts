import 'dotenv/config';
import * as homeInfo from './HomeInfo';
import * as homeSchema from "../model/schemas/Home.schema";



export const refresh = async( category:any , date:any ) =>{
    const result = await homeInfo.getAptInfo({
        startmonth : date.start_date,
        endmonth : date.end_date
        // @ts-ignore
    },category, process.env.API_HOST);

    const homeRateDetail = result.map(async (home:any)=>{
        console.log(home);
        const detailInfo = await homeInfo.getDetailInfo({
            houseManageNo : home.HOUSE_MANAGE_NO,
            pblancNo : home.PBLANC_NO
            // @ts-ignore
        },category,process.env.API_HOST);

        console.log(detailInfo);
        home["HOME_DETAILS"] = detailInfo;

        const rateList = await homeInfo.getRateInfo({houseManageNo: home.HOUSE_MANAGE_NO, houseSeCd : home.HOUSE_SECD }, process.env.RATE_HOST);
        console.log(rateList);
        home["HOME_RATES"] = rateList;
        home["CRDAT"] = date.start_date;

        return home;
    });

    const homeSave = await Promise.all(homeRateDetail);

    let resultMsg;
    try{
        await Promise.all(homeSave.map(async(home)=>{
            await homeSchema.Home.findOneAndUpdate(
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
}