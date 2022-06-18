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
    "04" : "getRemndrLttotPblancCmpet"
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
    this.flag.APT = false;
    this.flag.NonApt = false;
    this.flag.Remain = false;
    this.lastDate = new Date().toLocaleDateString();
}

let cacheList = {
    APT : [],
    NonApt : [],
    Remain : []
};

const serviceKey = process.env.SERVICE_KEY;

//그달에 존재하는 청약정보를 모두 가져온다.

export const getAptInfo = async function(param,serviceType, host){
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
    };
    // console.log(serviceNM);
    //해당월 시작일부터 다음월 시작일 이전까지 공고를 조회한다.  
    param.startmonth = `${param.startmonth}-15`;
    param.endmonth = `${param.endmonth}-01`;

    let url = `${host}/${serviceNM}?page=${pageNum}&perPage=${pageSize}&cond[RCRIT_PBLANC_DE::GTE]=${param.startmonth}&&serviceKey=${serviceKey}`;
    // console.log(url);

    const matchCount = await axios.get(url)
        .then(res=>{
            const {matchCount } = res.data;
            // console.log(matchCount);
            return matchCount;
        }).catch(err=>{
            console.error(err);
            return {"msg" : err.toString()};
        });
    
    pageSize = matchCount;
    url = `${host}/${serviceNM}?page=${pageNum}&perPage=${pageSize}&cond[RCRIT_PBLANC_DE::GTE]=${param.startmonth}&&serviceKey=${serviceKey}`;
    // console.log(url);

    const resultArr = await axios.get(url)
    .then(res=>{
        const { data } = res.data;
        return data;
    }).catch(err=>{
        console.error(err);
        return {"msg" : err.toString()};
    });
    
    // console.log(resultArr)

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

export const getDetailInfo = async function(param, serviceType,host){
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
    };

    if(!serviceNM) throw new Error("Not Found Service...");

    const url = `${host}/${serviceNM}?cond[HOUSE_MANAGE_NO::EQ]=${param.houseManageNo}&cond[PBLANC_NO::EQ]=${param.pblancNo}&serviceKey=${serviceKey}`;
    const detailInfo = await axios.get(url).then(res=>{
        const {data} = res.data;
        cacheDetailMap.set(param.houseManageNo,data);
        return data;
    },(err)=>{
        console.error(err);
        return {msg : err.toString()}
    });

    return detailInfo;
}

export const getRateInfo = async function(param, rate_host){
    if(!param.houseManageNo || !param.houseSeCd) throw new Error("Validation Error...");
    
    // if(cacheRateMap.has(param.houseManageNo)){
    //     return cacheRateMap.get(param.houseManageNo);
    // }

    let serviceNM = rate_service[param.houseSeCd];
    let url = `${rate_host}/${serviceNM}?cond[HOUSE_MANAGE_NO::EQ]=${param.houseManageNo}&serviceKey=${serviceKey}`;
    const pageNum = 1;

    const matchCount = await axios.get(url)
    .then(res=>{
        const { matchCount } = res.data;
        // console.log(matchCount);
        return matchCount;
    }).catch(err=>{
        console.error(err);
        return {"msg" : err.toString()};
    });

    let pageSize = matchCount;
    url = `${rate_host}/${serviceNM}?page=${pageNum}&perPage=${pageSize}&cond[HOUSE_MANAGE_NO::EQ]=${param.houseManageNo}&serviceKey=${serviceKey}`;
    
    const detailInfo = await axios.get(url).then(res=>{
        const {data} = res.data;

        if(data.length > 0){
            cacheRateMap.set(param.houseManageNo,data);
        }
        return data;
    },(err)=>{
        console.error(err);
        return {msg : err.toString()}
    });

    return detailInfo;
}

export const rowMapper = function(param,userId){
    let applyList = [];
    param.map((p)=>{
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

// this.getDetailInfo({houseManageNo: '2022910052', pblancNo: '2022910052'}, 'Remain')
// .then((res)=>console.log(res));

/*
https://api.odcloud.kr/api/ApplyhomeInfoDetailSvc/v1/getAPTLttotPblancDetail?page=1&perPage=10&cond%5BRCRIT_PBLANC_DE%3A%3ALTE%5D=2022-03-31&cond%5BRCRIT_PBLANC_DE%3A%3AGT%5D=2022-03-01&serviceKey=TTIBBEMWax1hMUgx0UkadwKxI2QosEOeeNVRSIjo4dFkM6I977BAgIOT7PylzVFjWtM%2F7pvRRTTgTh3OLdoZPg%3D%3D
https://api.odcloud.kr/api/ApplyhomeInfoDetailSvc/v1/getAPTLttotPblancDetail?page=1&perPage=10&cond[RCRIT_PBLANC_DE::LTE]=2022-03-31&cond[RCRIT_PBLANC_DE::GT]=2022-03-01&serviceKey=TTIBBEMWax1hMUgx0UkadwKxI2QosEOeeNVRSIjo4dFkM6I977BAgIOT7PylzVFjWtM/7pvRRTTgTh3OLdoZPg==
공고일 기준으로 한달 잡아서 조회 -> 청약시작일에 따라 화면에 표시한다. (URL Decoding 방식으로 적용)

*/