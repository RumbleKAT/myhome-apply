import {defineEventHandler} from "h3";
import axios from 'axios';
import { load } from 'cheerio';
import { getCache, setCache } from "~/server/utils/localCache";

const url = 'https://www.bok.or.kr/portal/singl/baseRate/list.do?dataSeCd=01&menuNo=200643';
export default defineEventHandler(async (event) => {
    const cacheKey = 'rate:std';
    const cached = getCache(cacheKey);
    if (cached) {
        return cached;
    }

    try{
        const res = await axios.get(url)
        const $ = load(res.data);
        const tableRows = $('table.fixed tbody tr');
        const data: { date: string; rate: string; }[] = [];

        tableRows.each((index, row) => {
            const rowData = $(row).find('td');
            const yy = $(rowData[0]).text().trim() + "년";
            const mmdd = $(rowData[1]).text().trim();

            const date = `${yy} ${mmdd}`;
            data.push({
                date: date,
                rate: $(rowData[2]).text().trim(),
            });
        });

        const result = {
            items : data
        };
        setCache(cacheKey, result, 60 * 60 * 1000);
        return result;
    }catch (e) {
        console.log(e);
        return {
            "message" : "Not Found"
        }
    }
});