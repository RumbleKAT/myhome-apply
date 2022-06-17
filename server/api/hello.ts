import { createApp, createRouter,useQuery } from 'h3'
import {getAptInfo} from '../utils/HomeInfo'

const app = createApp()
const router = createRouter()

app.use(router)

router.get('/', async (req, res) => {
  const result = await getAptInfo({startmonth : '2022-03', endmonth:'2022-04'}, 'APT',process.env.HOST);
  console.log(result);
  return 'Hello World'
});

router.get('/getInfo',async(req,res)=>{

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
  console.log(category);

  const aptList = await getAptInfo({
    startmonth : start_month,
    endmonth : end_month
  },category, process.env.HOST);
  
  console.log(aptList);

  return { "data" : aptList } ;
});

router.post('/demo', (req, res) => {
  res.end('my example')
})

export default app