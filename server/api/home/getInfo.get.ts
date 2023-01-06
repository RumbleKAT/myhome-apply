import {defineEventHandler, getQuery} from "h3";
import {isNeedUpdate} from "~/server/service/homeService";
import {Home} from "~/server/model/schemas/Home.schema";
import axios from "axios";
import * as events from "events";
import {getAptInfo} from "~/server/utils/HomeInfo";
import moment from "moment";
import {refresh} from "~/server/utils/homeBatch";
// import {connectMongo} from "~/server/utils/MongoUtil";
// (async function (){
//   await connectMongo();
// })();

const eventHandler = new events.EventEmitter();
eventHandler.on('runBatchTask', async(category:any)=>{
  console.log(`runBatch Task! ${category}`);
  //event emitter로 변경한다.
  try{
    await axios.get(`${process.env.BATCH_URL}/refresh?category=${category}`);
  }catch(e){
    console.log("[ERROR] : ", e);
  }
})

export default defineEventHandler(async (event) => {
  let now = moment();

  let start_date:string = now.subtract(1, "M").format('"YYYY-MM-DD"');
  let end_date:string = now.add(2, "M").format('"YYYY-MM-DD"');

  const { category, s_date, e_date } = getQuery(event)
  if(s_date && e_date){
    start_date = s_date as string;
    end_date = e_date as string;
  }

  console.log("category : ", category);
  console.log("start_date : " + start_date);
  console.log("end_date : " + end_date)

  // @ts-ignore
  const result = await isNeedUpdate(category.toString());
  console.log("isNeedUpdate : " + result);

  let aptList;
  if(result){
    aptList = await getAptInfo({
      startmonth : start_date,
      endmonth : end_date
      // @ts-ignore
    },category, process.env.API_HOST);
    await refresh(category,{},aptList);
  }else{
    if(category === 'APT'){
      aptList = await Home.find({
        CATEGORY : category,
        RCEPT_BGNDE: { $gte: new Date(start_date),$lt: new Date(end_date) }
      });
    }else{
      aptList = await Home.find({
        CATEGORY : category,
        SUBSCRPT_RCEPT_BGNDE: { $gte: new Date(start_date),$lt: new Date(end_date) }
      });
    }
  }
  // @ts-ignore
    aptList = aptList.filter(p => p.HOUSE_SECD !== '10') //공공분양 제외 TOBE 로직에 추가 예정

  return { "data" : aptList } ;
});
