import {defineEventHandler, getQuery} from "h3";
import {refresh} from "~/server/utils/homeBatch";
import moment from "moment";
// import {connectMongo} from "~/server/utils/MongoUtil";
// (async function (){
//     await connectMongo();
// })();

export default defineEventHandler(async (event) => {
    const {category} = getQuery(event);
    let now = moment();

    let start_date = now.format('"YYYY-MM-DD"');
    let end_date = now.add(1, "M").format('"YYYY-MM-DD"');

    console.log("start_date : " + start_date);
    console.log("end_date : " + end_date)

    const res = await refresh(category, { start_date, end_date });
    return { "response" : res };
});