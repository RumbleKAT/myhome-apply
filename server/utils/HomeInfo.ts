import axios from 'axios';

// const host="https://api.odcloud.kr/api/ApplyhomeInfoDetailSvc/v1";
const service = {
    "APT" : "getAPTLttotPblancDetail",
    "NonApt" : "getUrbtyOfctlLttotPblancDetail",
    "Remain" : "getRemndrLttotPblancDetail"
};

const service_detail = {
    "APT" : "getAPTLttotPblancMdl",
    "NonApt" : "getUrbtyOfctlLttotPblancMdl",
    "Remain" : "getRemndrLttotPblancMdl"
}

// const rate_host = "https://api.odcloud.kr/api/ApplyhomeInfoCmpetRtSvc/v1";
const rate_service = {
    "01" : "getAPTLttotPblancCmpet",
    "02" : "getUrbtyOfctlLttotPblancCmpet",
    "03" : "getPblPvtRentLttotPblancCmpet",
    "06" : "getCancResplLttotPblancCmpet",
    "04" : "getRemndrLttotPblancCmpet",
    "10" : "getPblPvtRentLttotPblancCmpet"
};

let flag = {
    APT : false,
    NonApt : false,
    Remain : false,
    lastDate : new Date().toLocaleDateString()
};

let cacheDetailMap = new Map();
let cacheRateMap = new Map();

function flagInitalize(){
    flag.APT = false;
    flag.NonApt = false;
    flag.Remain = false;
    flag.lastDate = new Date().toLocaleDateString();
}

let cacheList = {
    APT : [],
    NonApt : [],
    Remain : []
};

// @ts-ignore
const serviceKey = process.env.SERVICE_KEY;

//그달에 존재하는 청약정보를 모두 가져온다.

export const getAptInfo = async function(param:any,serviceType:string, host:string){
    //getLttotPblancList APT분양조회
    if(!param || !serviceType) return new Error("Validation Error...");
    if(flag.lastDate === new Date().toLocaleDateString()){
        if(serviceType === 'APT' && flag.APT){
            return cacheList.APT
        }else if(serviceType === 'NonApt' && flag.NonApt){
            return cacheList.NonApt;
        }else if(serviceType === 'Remain' && flag.Remain){
            return cacheList.Remain;
        }
    }else{
        flagInitalize();
    }

    let pageNum = 1;
    let pageSize = 1;
    let serviceNM = null;
    switch (serviceType){
        case 'APT':
            serviceNM = service.APT;
            break;
        case 'NonApt':  
            serviceNM = service.NonApt;
            break;
        case 'Remain':
            serviceNM = service.Remain;
            break;
    }
    // console.log(serviceNM);
    //해당월 시작일부터 다음월 시작일 이전까지 공고를 조회한다.  
    // param.startmonth = `${param.startmonth}-15`;
    // param.endmonth = `${param.endmonth}-01`;
    param.startmonth = param.startmonth.replaceAll('"','');
    param.endmonth = param.endmonth.replaceAll('"','');
    console.log(param);

    let url = `${host}/${serviceNM}?page=${pageNum}&perPage=${pageSize}&cond%5BRCRIT_PBLANC_DE%3A%3AGTE%5D=${param.startmonth}&cond%5BRCRIT_PBLANC_DE%3A%3ALTE%5D=${param.endmonth}&serviceKey=${serviceKey}`;
    console.log(url);

    pageSize = await axios.get(url)
        .then(res => {
            const {matchCount} = res.data;
            console.log(matchCount);
            return matchCount;
        }).catch(err => {
            console.error(err);
            return {"msg": err.toString()};
        });
    url = `${host}/${serviceNM}?page=${pageNum}&perPage=${pageSize}&cond%5BRCRIT_PBLANC_DE%3A%3AGTE%5D=${param.startmonth}&serviceKey=${serviceKey}`;
    // console.log(url);

    const resultArr = await axios.get(url)
    .then(res=>{
        const { data } = res.data;
        return data;
    }).catch(err=>{
        console.error(err);
        return {"msg" : err.toString()};
    });
    
    // console.log(resultArr.length)

    if(serviceType === 'APT'){
        flag.APT = true;
        cacheList.APT = resultArr;
    }else if(serviceType === 'NonApt'){
        flag.NonApt = true;
        cacheList.NonApt = resultArr;
    }else if(serviceType === 'Remain'){
        flag.Remain = true;
        cacheList.Remain = resultArr;
    }

    if(resultArr.hasOwnProperty("msg")){
        return resultArr.msg;
    }

    return resultArr;
};

export const getDetailInfo = async function(param:any, serviceType:string,host:string){
    if(!param.houseManageNo || !param.pblancNo || !serviceType) throw new Error("Validation Error...");

    if(cacheDetailMap.has(param.houseManageNo)){
        return cacheDetailMap.get(param.houseManageNo);
    }

    let serviceNM = null;
    switch (serviceType){
        case 'APT':
            serviceNM = service_detail.APT;
            break;
        case 'NonApt':  
            serviceNM = service_detail.NonApt;
            break;
        case 'Remain':
            serviceNM = service_detail.Remain;
            break;
    }

    if(!serviceNM) throw new Error("Not Found Service...");

    const url = `${host}/${serviceNM}?cond[HOUSE_MANAGE_NO::EQ]=${param.houseManageNo}&cond[PBLANC_NO::EQ]=${param.pblancNo}&serviceKey=${serviceKey}`;
    return await axios.get(url).then(res => {
        const {data} = res.data;
        cacheDetailMap.set(param.houseManageNo, data);
        return data;
    }, (err) => {
        console.error(err);
        return {msg: err.toString()}
    });
}

export const getRateInfo = async function(param:any, rate_host:any){
    if(!param.houseManageNo || !param.houseSeCd) throw new Error("Validation Error...");
    
    // if(cacheRateMap.has(param.houseManageNo)){
    //     return cacheRateMap.get(param.houseManageNo);
    // }

    // @ts-ignore
    let serviceNM = rate_service[param.houseSeCd];
    let url = `${rate_host}/${serviceNM}?cond[HOUSE_MANAGE_NO::EQ]=${param.houseManageNo}&serviceKey=${serviceKey}`;
    const pageNum = 1;

    let pageSize = await axios.get(url)
        .then(res => {
            const {matchCount} = res.data;
            // console.log(matchCount);
            return matchCount;
        }).catch(err => {
            console.error(err);
            return {"msg": err.toString()};
        });
    url = `${rate_host}/${serviceNM}?page=${pageNum}&perPage=${pageSize}&cond[HOUSE_MANAGE_NO::EQ]=${param.houseManageNo}&serviceKey=${serviceKey}`;

    return await axios.get(url).then(res => {
        const {data} = res.data;

        if (data.length > 0) {
            cacheRateMap.set(param.houseManageNo, data);
        }
        return data;
    }, (err) => {
        console.error(err);
        return {msg: err.toString()}
    });
}

export const rowMapper = function(param:any,userId:string){
    let applyList:any = [];
    param.map((p:any)=>{
        const { 
            HOUSE_MANAGE_NO,
            PBLANC_NO,
            HOUSE_DTL_SECD_NM,
            HOUSE_NM,
            CNSTRCT_ENTRPS_NM,
            RCEPT_BGNDE,
            RCEPT_ENDDE,
            PRZWNER_PRESNATN_DE,
            // home_info_id
        } = p[0];
        applyList.push({
            houseManageNo : HOUSE_MANAGE_NO,
            pblancNo : PBLANC_NO,
            houseDetailSecdNm : HOUSE_DTL_SECD_NM,
            houseNm : HOUSE_NM,
            bsnsMbyNm : CNSTRCT_ENTRPS_NM,
            rceptBgnde : RCEPT_BGNDE,
            rceptEndde : RCEPT_ENDDE,
            przwnerPresnatnDe : PRZWNER_PRESNATN_DE,
            home_info_id : userId
        });
    });
    return applyList;
}

export const getCurrentDate = function(){
    const current = new Date();
    const year = current.getFullYear(); 
    const month = current.getMonth() + 1; 
    const date = current.getDate();
    return `${year}-${month >= 10 ? month : '0' + month}-${date >= 10 ? date : '0' + date}`;
}
