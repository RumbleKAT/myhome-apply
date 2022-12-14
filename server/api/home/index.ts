import {defineEventHandler} from "h3";
import {connectMongo} from "~/server/utils/MongoUtil";
(async function (){
    await connectMongo();
})();
export default defineEventHandler(() => 'Hello home!')
