import { createApp, createRouter,useQuery } from 'h3'
import {getAptInfo, getDetailInfo,getRateInfo} from '../utils/HomeInfo'

const app = createApp()
const router = createRouter()

app.use(router)

router.get('/getInfo',async(req)=>{

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

  const aptList = await getAptInfo({
    startmonth : start_month,
    endmonth : end_month
  },category, process.env.HOST);

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