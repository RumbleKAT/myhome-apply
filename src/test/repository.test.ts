import { IHomeInfo } from '~~/server/model/IHomeInfo';
import { createId, deleteByEmail, selectByEmail } from '../../server/service/userService';

describe('HomeInfo test',()=>{

    const mail = { "email" : "ssj382@naver.com" };

    test('create id by mail',async ()=>{
        const res = await createId(mail);
        expect(res).toEqual(true);        
    });

    test('select home apply by mail',async ()=>{
        const res:IHomeInfo = await selectByEmail(mail);
        expect(res.email).toEqual(mail.email);        
    });
    
    test('delete id by mail', async ()=>{
        const res = await deleteByEmail(mail);
        expect(res).toEqual(true);        
    });


});
