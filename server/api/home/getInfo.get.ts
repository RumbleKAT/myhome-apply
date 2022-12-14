import {defineEventHandler, getQuery} from "h3";
import {isNeedUpdate} from "~/server/service/homeService";
import {Home} from "~/server/model/schemas/Home.schema";
import axios from "axios";
import * as events from "events";
import {getAptInfo} from "~/server/utils/HomeInfo";
import moment from "moment";

const eventHandler = new events.EventEmitter();
eventHandler.on('runBatchTask', async(category:any)=>{
  console.log(`!! runBatch Task! ${category}`);
  //event emitter로 변경한다.
  try{
    const healthcheck = await axios.get(`${process.env.BATCH_URL}`);
    if(healthcheck.status === 200){
      console.log("batch server health check success!");
      await axios.get(`${process.env.BATCH_URL}/refresh?category=${category}`);
    }
  }catch(e){
    console.log("[ERROR] : ", e);
  }
})

export default defineEventHandler(async (event) => {
  let now = moment();
  now.format('"YYYY-MM-DD"');

  let start_date = now.subtract(1, "M").format('"YYYY-MM-DD"');
  let end_date = now.add(2, "M").format('"YYYY-MM-DD"');

  console.log("start_date : " + start_date);
  console.log("end_date : " + end_date)

  const { category } = getQuery(event)
  console.log("category : ", category);

  // @ts-ignore
    const result = await isNeedUpdate(category.toString());
  // console.log("result : " , result);
  // const result = true;

  let aptList;
  if(result){
    aptList = await getAptInfo({
      startmonth : start_date,
      endmonth : end_date
    },category, process.env.API_HOST)

    //event emitter로 변경한다.
    // eventHandler.emit('runBatchTask', category);

  }else{
    if(category === 'APT'){
      aptList = await Home.find({
        CATEGORY : category,
        RCEPT_BGNDE: { $gt: new Date(start_date) },
        RCEPT_ENDDE: { $lt: new Date(end_date) }
      });
    }else{
      aptList = await Home.find({
        CATEGORY : category,
        SUBSCRPT_RCEPT_BGNDE: { $gt: new Date(start_date) },
        SUBSCRPT_RCEPT_ENDDE: { $lt: new Date(end_date) }
      });
    }
  }

  // @ts-ignore
    aptList = aptList.filter(p => p.HOUSE_SECD !== '10') //공공분양 제외 TOBE 로직에 추가 예정

  return { "data" : aptList } ;
});
