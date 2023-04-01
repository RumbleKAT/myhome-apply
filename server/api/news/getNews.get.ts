import {defineEventHandler, getQuery} from "h3";
import axios from 'axios';
import cheerio from 'cheerio';

export default defineEventHandler(async (event) => {
    const { keyword } = getQuery(event);
    let searchKeyword = "";
    if(!keyword) searchKeyword = encodeURIComponent("부동산");
    const url = `https://news.google.com/rss/search?q=${searchKeyword}&hl=ko&gl=KR&ceid=KR%3Ako`;
    try {
        const {data} = await axios.get(`${url}`);
        const $ = cheerio.load(data, {xmlMode: true});

        return {
            title: $('channel > title').text(),
            description: $('channel > description').text(),
            link: $('channel > link').text(),
            items: $('channel > item').map((_, element) => {
                const item = $(element);
                return {
                    title: item.find('title').text(),
                    link: item.find('link').text(),
                    pubDate: item.find('pubDate').text(),
                    creator: item.find('dc\\:creator').text(),
                    content: item.find('content\\:encoded').text(),
                    contentSnippet: item.find('description').text(),
                };
            }).get()
        };
    }catch (e) {
        console.error(e);
        return {
            "message" : "Not Found"
        }
    }
});