import { createApp, createRouter,useBody,createError,sendError } from 'h3'
import cors from 'cors';
import { selectByEmail } from '../service/userService';
import { IHomeInfo } from '../model/IHomeInfo';
import { emailValid } from '../utils/Validation';

const app = createApp()
const router = createRouter()

app.use(cors());
app.use(router)


router.post('/getUserByMail',async(req,next)=>{
    const body:IHomeInfo = await useBody(req);
    
    if(!emailValid(body.email)) 
        sendError(req, createError({statusCode: 400, statusMessage: 'Email Validation Error'}));
    
    const res = await selectByEmail(body); 
    return { "data" : res } ;
});

export default app;