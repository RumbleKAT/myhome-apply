import { createApp, createRouter,useBody,createError,sendError,useQuery } from 'h3'
import cors from 'cors';
import { createId, selectByEmail,deleteByEmail } from '../service/userService';
import { IHomeInfo } from '../model/IHomeInfo';
import { emailValid } from '../utils/Validation';

const app = createApp()
const router = createRouter()

app.use(cors());
app.use(router)


router.post('/getUserByMail',async(req)=>{
    const body:IHomeInfo = await useBody(req);
    
    if(!emailValid(body.email)) 
        sendError(req, createError({statusCode: 400, statusMessage: 'Email Validation Error'}));
    
    const res = await selectByEmail(body); 
    return { "data" : res } ;
});

router.post('/createUser',async(req)=>{
    const body:IHomeInfo = await useBody(req);
    const { email } = body;
    try{
        const res =  await createId({"email" : email}); 
        return { "data" : res };
    }catch(err){
        console.error(err);
        sendError(req, createError({statusCode: 500, statusMessage: 'User creation Error'}));
    }
});

router.get('/deleteUser',async(req)=>{
    const query = useQuery(req);
    const { email } = query;
    try{
        const res =  await deleteByEmail({"email" : email}); 
        if(res){
            return { "message" : "정상적으로 탈회되었습니다."}
        }else{
            return { "message" : "탈회 실패되었습니다. 담당자에 문의해주세요" };
        }
    }catch(err){
        console.error(err);
        sendError(req, createError({statusCode: 500, statusMessage: 'User delete Error'}));
    }
})

export default app;