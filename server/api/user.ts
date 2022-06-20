import { createApp, createRouter } from 'h3'
import cors from 'cors';
import { execute } from '../../server/utils/Repository';

const app = createApp()
const router = createRouter()

app.use(cors());
app.use(router)

router.get('/',async()=>{
    const res = await execute('select * from home_info',[])
    return { "data" : res } ;
});

export default app;