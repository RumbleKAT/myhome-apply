import {Home} from "../model/schemas/Home.schema";

export const isExistHome = async (HOUSE_MANAGE_NO: number) =>{
    const result = await Home.find({ HOUSE_MANAGE_NO : HOUSE_MANAGE_NO});
    if(result.length > 0){
        console.log("check", result);
        const hasErrorMsg = await getRates(HOUSE_MANAGE_NO);
        return Array.isArray(hasErrorMsg) ? hasErrorMsg.filter(param => param.hasOwnProperty("msg")).length < 1 : hasErrorMsg.hasOwnProperty("msg")
    }
    return result.length > 0
}

export const getDetails = async (HOUSE_MANAGE_NO: number) =>{
    const result:any = await Home.find({HOUSE_MANAGE_NO : HOUSE_MANAGE_NO}, { HOME_DETAILS: 1, _id: 0 });
    return result[0].HOME_DETAILS;
}

export const getRates = async (HOUSE_MANAGE_NO: number) => {
    const result:any = await Home.find({HOUSE_MANAGE_NO : HOUSE_MANAGE_NO}, { HOME_RATES: 1, _id: 0 });
    return result[0].HOME_RATES;
}

export const updateDatas = async(HOUSE_MANAGE_NO: number, param: any, type : any) => {
    // console.log(param);
    let home = param;
    if(Array.isArray(param)){
        home = await Home.findOne({ HOUSE_MANAGE_NO : HOUSE_MANAGE_NO});
        if(type === 'detail'){
            home["HOME_DETAILS"] = param;
        } else if(type === 'rate'){
            home["HOME_RATES"] = param;
        }
    }
    const result:any = await Home.findOneAndUpdate(
        { HOUSE_MANAGE_NO : HOUSE_MANAGE_NO },
        home,
        { upsert: true, new: true, setDefaultsOnInsert : true }
    )
    return result.length > 0;
}

export const getDateDiff = (d1:any, d2:any) => {
    const date1 = new Date(d1);
    const date2 = new Date(d2);

    const diffDate = date1.getTime() - date2.getTime();

    return Math.floor(Math.abs(diffDate / (1000 * 60 * 60 * 24))); // 밀리세컨 * 초 * 분 * 시 = 일
}

export const isNeedUpdate = async (category: string)=>{
    const result:any = await Home.find({CATEGORY : category},{ CRDAT : 1, _id : 0}).sort({"CRDAT": -1}).limit(1);
    console.log(result);
    if(result.length === 0) return true;
    const today = new Date();
    return getDateDiff(result[0].CRDAT, today) >= 6
}
//7일이상 해당 카테고리로 업데이트가 안된 경우, 업데이트 진행