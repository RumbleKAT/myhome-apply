import {defineEventHandler, getQuery} from "h3";
import {getRates, isExistHome, updateDatas} from "~/server/service/homeService";
import {getDetailInfo, getRateInfo} from "~/server/utils/HomeInfo";
// import {connectMongo} from "~/server/utils/MongoUtil";
// (async function (){
//   await connectMongo();
// })();

export default defineEventHandler(async (event) => {
  const { houseManageNo,houseSeCd } = getQuery(event);

  const result = await isExistHome(Number(houseManageNo));

  let flag = false;
  let rateList
  if(result){
    rateList = await getRates(Number(houseManageNo));
    console.log(rateList);
    if(rateList[0]._doc.hasOwnProperty("msg")) flag = true;
    else if(!rateList[0].hasOwnProperty("HOUSE_MANAGE_NO")) flag = true;
  }else{
    // @ts-ignore
    flag = true;
  }

  if(flag){
    console.log("update rateInfo");
    rateList = await getRateInfo({houseManageNo: houseManageNo, houseSeCd : houseSeCd}, process.env.RATE_HOST);
    await updateDatas(Number(houseManageNo), rateList, 'rate');
  }
  return { "data" : rateList } ;
});