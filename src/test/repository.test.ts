import { execute } from '../../server/utils/Repository';

describe('Repository test',()=>{
    test('DB connection test',async ()=>{
        const res = await execute('select * from home_info',[])
        console.log(res);
    });

    test('select home apply',async ()=>{
        const res = await execute('select * from home_apply',[])
        console.log(res);
    });
});