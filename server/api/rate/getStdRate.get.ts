import {defineEventHandler} from "h3";
import axios from 'axios';
import cheerio from 'cheerio';

const url = 'https://www.bok.or.kr/portal/singl/baseRate/list.do?dataSeCd=01&menuNo=200643';
export default defineEventHandler(async (event) => {

    try{
        const response = await axios.get(url)
        const $ = cheerio.load(response.data);
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

        return {
            items : data
        };
    }catch (e) {
        console.log(e);
        return {
            "message" : "Not Found"
        }
    }
});