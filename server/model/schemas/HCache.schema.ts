import { Schema, model } from 'mongoose';
import {IHomeCache} from "~/server/model/IHomeCache";

const hCacheSchema = new Schema<IHomeCache>({
    HOUSE_MANAGE_NO : { type: Number, required: true, unique: true, index: true },
    CRDAT : { type : Date }
})

export const HCache = model<IHomeCache>('HomeCache',hCacheSchema);