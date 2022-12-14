import {Schema} from "mongoose";
import {IHomeRate} from "~/server/model/IHomeRate";

export const HomeRateSchema =  new Schema<IHomeRate>({
    AVRG_SCORE : { type: Number },
    CMPET_RATE : { type: String },
    HOUSE_MANAGE_NO : { type: Number },
    HOUSE_TY : { type: String },
    LWET_SCORE : { type: Number },
    MODEL_NO : { type: String },
    PBLANC_NO : { type: Number },
    REQ_CNT : { type: String },
    RESIDE_SECD : { type: String },
    RESIDE_SENM : { type: String },
    SUBSCRPT_RANK_CODE : { type: Number },
    SUPLY_HSHLDCO : { type: Number },
    TOP_SCORE : { type: Number },
    RESIDNT_PRIOR_AT : { type: String },
    RESIDNT_PRIOR_SENM : { type: String },
    REMNDR_HSHLD_PBLANC_TYCD : { type: String },
});