import {defineEventHandler, getQuery} from "h3";
import {getDetails, isExistHome, updateDatas} from "~/server/service/homeService";
import {getDetailInfo} from "~/server/utils/HomeInfo";
import {connectMongo} from "~/server/utils/MongoUtil";
(async function (){
  await connectMongo();
})();
export default defineEventHandler(async (event) => {
  const { category,houseManageNo,pblancNo } = getQuery(event);

  const result = await isExistHome(Number(houseManageNo));

  let aptList
  if(result){
    aptList = await getDetails(Number(houseManageNo));
    //save the data
    if(aptList.length >= 1 && aptList[0]._doc.hasOwnProperty("msg")){ // error 리턴시 저장하지 않는다.
      console.log("save it");
      aptList = await getDetailInfo({
        houseManageNo : houseManageNo,
        pblancNo : pblancNo
      },category, process.env.API_HOST);
      await updateDatas(Number(houseManageNo),aptList, 'detail');
    }
  }else{

    aptList = await getDetailInfo({
      houseManageNo : houseManageNo,
      pblancNo : pblancNo
    },category, process.env.API_HOST);
  }

  return { "data" : aptList } ;
});