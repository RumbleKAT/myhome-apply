import { Schema } from 'mongoose';
import {IHomeDetail} from "~/server/model/IHomeDetail";

export const homeDetailSchema = new Schema<IHomeDetail>({
    ETC_HSHLDCO : { type: Number },
    HOUSE_MANAGE_NO : { type: Number },
    HOUSE_TY : { type: String },
    INSTT_RECOMEND_HSHLDCO : { type: Number },
    LFE_FRST_HSHLDCO : { type: Number },
    LTTOT_TOP_AMOUNT : { type: String },
    MNYCH_HSHLDCO : { type: Number },
    MODEL_NO : { type: String },
    NWWDS_HSHLDCO : { type: Number },
    OLD_PARNTS_SUPORT_HSHLDCO : { type: Number },
    PBLANC_NO : { type: Number },
    SPSPLY_HSHLDCO : { type: Number },
    SUPLY_AR : { type: String },
    SUPLY_HSHLDCO : { type: String },
    TRANSR_INSTT_ENFSN_HSHLDCO : { type: Number },
    EXCLUSE_AR : { type: Number },
    GP : { type: String },
    SUBSCRPT_REQST_AMOUNT : { type: Number },
    SUPLY_AMOUNT : { type: String },
    TP : { type: String }
});