import {defineEventHandler, getQuery} from "h3";
import {getRates, isExistHome, updateDatas} from "~/server/service/homeService";
import {getRateInfo} from "~/server/utils/HomeInfo";
import {connectMongo} from "~/server/utils/MongoUtil";
(async function (){
  await connectMongo();
})();

export default defineEventHandler(async (event) => {
  const { houseManageNo,houseSeCd } = getQuery(event);

  const result = await isExistHome(Number(houseManageNo));

  let rateList
  if(result){
    rateList = await getRates(Number(houseManageNo));
    if(rateList.length >= 1 && rateList[0]._doc.hasOwnProperty("msg")){ // error 리턴시 저장하지 않는다.
      rateList = await getRateInfo({houseManageNo: houseManageNo, houseSeCd : houseSeCd}, process.env.RATE_HOST);
      console.log(rateList.length);
      await updateDatas(Number(houseManageNo),rateList,'rate');
    }
  }else{
    // @ts-ignore
    rateList = await getRateInfo({houseManageNo: houseManageNo, houseSeCd : houseSeCd}, process.env.RATE_HOST);
  }

  return { "data" : rateList } ;
});