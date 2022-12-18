import {defineEventHandler, getQuery} from "h3";
import {refresh} from "~/server/utils/homeBatch";
import moment from "moment";
// import {connectMongo} from "~/server/utils/MongoUtil";
// (async function (){
//     await connectMongo();
// })();

export default defineEventHandler(async (event) => {
    const {category, start, end} = getQuery(event);
    let now = moment();
    let start_date:any = now.subtract(2,"M").format('"YYYY-MM-DD"');
    let end_date:any = now.add(3, "M").format('"YYYY-MM-DD"');

    if(start && end){
        console.log("worked!");
        start_date = start;
        end_date = end;
    }

    console.log("start_date : " + start_date);
    console.log("end_date : " + end_date)

    const res = await refresh(category, { start_date, end_date },null);
    console.log("batch : ", res);
    return { "response" : res };
});