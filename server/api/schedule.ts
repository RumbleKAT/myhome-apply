import { createApp, createRouter,useBody,createError,sendError } from 'h3'
import cors from 'cors';
import { IHomeInfo } from '../model/IHomeInfo';
import { IHomeApply } from '../model/IHomeApply';
import  * as scheService from '../service/scheduleService';

const app = createApp()
const router = createRouter()

app.use(cors());
app.use(router)

router.post('/getUserById',async(req)=>{
    const body:IHomeInfo = await useBody(req);
    
    try{
        const res =  await scheService.selectByUserId({"id" : body.id}); 
        const rowCount = res.length;
        const rows = res;
        return { "data" : { "res" : rows, "rowCount" : rowCount } } ;
    }catch(err){
        sendError(req, createError({statusCode: 400, statusMessage: err}));        
    }
});

router.post('/applyArr', async(req)=>{
    const body = await useBody(req);
    const applyList:IHomeApply[] = body.arr;
    
    try{
        for (const element of applyList){
            const { 
                houseManageNo,
                pblancNo,
                houseDetailSecdNm,
                houseNm,
                bsnsMbyNm,
                rcritPblancDe,
                rceptBgnde,
                rceptEndde,
                przwnerPresnatnDe,
                home_info_id
            } = element;
            // console.log(element);
            const isInserted =  await scheService.createApply(
                {
                    houseManageNo : houseManageNo,
                    pblancNo : pblancNo,
                    houseDetailSecdNm : houseDetailSecdNm,
                    houseNm : houseNm,
                    bsnsMbyNm : bsnsMbyNm,
                    rcritPblancDe : rcritPblancDe,
                    rceptBgnde : rceptBgnde,
                    rceptEndde : rceptEndde,
                    przwnerPresnatnDe : przwnerPresnatnDe,
                    home_info_id : home_info_id
                }
            );
            if(!isInserted){
                sendError(req, createError({statusCode: 400, statusMessage: 'DB Insert Failed'}));        
            }
        }
        return {"type" : "success", "message" : "save success..."};
    }catch(err){
        sendError(req, createError({statusCode: 500, statusMessage: err}));        
    }
});

router.delete('/applyById', async function(req) {
    const body = await useBody(req);
    // console.log(req.body);
    // console.log(id);
    try{
        const isDeleted =  await scheService.deleteApplyByUserId({id:body.id});
        return {"res" : isDeleted };
    }catch(err){
        sendError(req, createError({statusCode: 500, statusMessage: err}));        
    }
});

router.post('/getSchedules',async function(req){
    const body = await useBody(req);
    try{
        const lists =  await scheService.getSchedules({date:body.date});
        return {"data" : lists };
    }catch(err){
        sendError(req, createError({statusCode: 500, statusMessage: err}));        
    }
});



export default app;