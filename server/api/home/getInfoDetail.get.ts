import {defineEventHandler, getQuery} from "h3";
import {getDetails, isExistHome, updateDatas} from "~/server/service/homeService";
import {getDetailInfo} from "~/server/utils/HomeInfo";
// import {connectMongo} from "~/server/utils/MongoUtil";
// (async function (){
//   await connectMongo();
// })();
export default defineEventHandler(async (event) => {
  const { category,houseManageNo,pblancNo } = getQuery(event);

  const result = await isExistHome(Number(houseManageNo));
  // console.log("check2",result);

  let flag = false;
  let aptList
  if(result){
    try{
      aptList = await getDetails(Number(houseManageNo));
      if(aptList.length == 0){
        flag = true;
      }
    }catch(e) {
      console.log(e);
      flag = true;
    }
  }else{
    flag = true;
  }

  if(flag){
    console.log("update details");
    aptList = await getDetailInfo({
      houseManageNo : houseManageNo,
      pblancNo : pblancNo
      // @ts-ignore
    },category, process.env.API_HOST);
    await updateDatas(Number(houseManageNo), aptList,'detail')
  }

  return { "data" : aptList } ;
});