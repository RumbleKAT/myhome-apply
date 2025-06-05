import {defineEventHandler} from "h3";
import axios from 'axios';
import cheerio from 'cheerio';
import { getCache, setCache } from "~/server/utils/localCache";

const url = 'https://www.hf.go.kr/ko/sub02/sub02_01_07_01.do'
export default defineEventHandler(async (event) => {
    const cacheKey = 'rate:get';
    const cached = getCache(cacheKey);
    if (cached) {
        return cached;
    }

    const { data } = await axios.get(url)
    const $ = cheerio.load(data);
    let period:string = "";

    $('.taR.font16.mgt30').each(function (i, elem) {
        // Extract the text from the element
        period = $(this).text().trim();
    });
    let banks:any[] = [];
    $('.tbl tbody').each(function (i, elem) {
        // Iterate through each tr within the tbody
        $(this).find('tr').each(function (j, trElem) {
            // Extract the data within the tr
            const rowData:any = [];
            $(trElem).find('td').each(function (k, tdElem) {
                rowData.push($(tdElem).text().trim());
            });

            // rowData now contains the three td values for the current tr
            console.log(`Row ${j + 1}:`, rowData);
            banks.push(rowData);
        });
    });

    try{
        const bank = banks.map(p=>{
            return {
                "name" : p[0],
                "rate" : p[1],
                "call" : p[2]
            }
        });
        const response = {
            period,
            bank
        };
        setCache(cacheKey, response, 60 * 60 * 1000);
        return response;
    }catch (e) {
        console.log(e);
        return {
            "message" : "Not Found"
        }
    }
});