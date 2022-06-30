import { createApply, selectByUserId,deleteApply, deleteApplyByUserId } from "../../server/service/scheduleService";

describe('HomeApply test',()=>{
    const testApp = {
        houseManageNo : '2021950013',
        pblancNo : '2021950013',
        houseDetailSecdNm : '오피스텔',
        houseNm : '의정부 고산지구 라피네트',
        bsnsMbyNm : '주식회사 한강주택산업',
        rcritPblancDe : '20210329',
        rceptBgnde : '2021-04-05',
        rceptEndde : '2021-04-05',
        przwnerPresnatnDe : '2021-04-08',
        home_info_id : 30
    };

    test('create home apply',async ()=>{
        const res = await createApply(testApp);
        expect(res).toEqual(true);        
    });

    test('select homeInfo array ',async () => {
        const res = await selectByUserId({"id" : testApp.home_info_id});
        // console.log(res);
        expect(res.length > 0).toEqual(true);
    });

    test('delete homeApply', async ()=>{
        const res = await deleteApplyByUserId({"id" : testApp.home_info_id});
        // console.log(res);
        expect(res).toEqual(true);
    });
});