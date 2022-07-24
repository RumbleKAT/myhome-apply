import { createApp, createRouter,useQuery } from 'h3'
import {getAptInfo, getDetailInfo,getRateInfo} from '../utils/HomeInfo'
import cors from 'cors';
import { openConnection, getCache, setCache } from '../utils/Cache';

const app = createApp()
const router = createRouter()

app.use(cors());
app.use(router);

(async()=>{
  await openConnection();
})();

const ONE_DAY_SECOND = 86400;

router.get('/getInfo',async(req)=>{
  //check cache data..
  
  const currentDate = new Date();
  let nextMonth:string = `${(new Date().getMonth()+1)%12 + 1}`;
  if(nextMonth.length < 2){
      nextMonth = `0${nextMonth}`
  }
  let lastMonth:string = `${(new Date().getMonth()+1)%12 - 1}`;
  if(lastMonth.length < 2){
      lastMonth = `0${lastMonth}`
  }

  let currentYear = currentDate.getFullYear();
  if(lastMonth == '12'){
      currentYear -= 1;
  }

  const start_month = `${currentYear}-${lastMonth}`; //1월 부터 조회
  const end_month = `${currentYear}-${nextMonth}}`;
  // const nextMonth = 
  const { category } = useQuery(req)
  // console.log(category);

  const cacheList = await getCache(category.toString());
  console.log(cacheList);
  let aptList = null;
  if(Array.isArray(cacheList) && cacheList.length > 0){
    aptList = cacheList;
    // console.log('use cache..');
  }else{
    aptList = await getAptInfo({
      startmonth : start_month,
      endmonth : end_month
    },category, process.env.HOST);  
    await setCache(category.toString(), JSON.stringify(aptList), ONE_DAY_SECOND);
  }
  
  return { "data" : aptList } ;
});

router.get('/getInfoDetail',async(req)=>{
  const { category,houseManageNo,pblancNo } = useQuery(req);

  const aptList = await getDetailInfo({
      houseManageNo : houseManageNo,
      pblancNo : pblancNo
  },category,process.env.HOST);

  return { "data" : aptList } ;
});

router.get('/getRateInfo',async(req)=>{
  const { houseManageNo,houseSeCd } = useQuery(req);

  const rateList = await getRateInfo({houseManageNo: houseManageNo, houseSeCd : houseSeCd}, process.env.RATE_HOST);
  return { "data" : rateList } ;
});

export default app