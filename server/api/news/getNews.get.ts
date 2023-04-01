import {defineEventHandler} from "h3";
import Parser from 'rss-parser';
const parser = new Parser();

export default defineEventHandler(async (event) => {
    let searchKeyword = "부동산";
    const url = `https://news.google.com/rss/search?q=${encodeURIComponent(searchKeyword)}&hl=ko&gl=KR&ceid=KR%3Ako`;

    try {
        console.log(url);
        // @ts-ignore
        const feed = await parser.parseURL(url);
        // @ts-ignore
        const items  = feed.items.map(item => ({
            title: item.title,
            link: item.link,
            pubDate: item.pubDate,
            creator: item.creator,
            content: item.content,
            contentSnippet: item.contentSnippet,
        }));

        return {
            title: feed.title,
            description: feed.description,
            link: feed.link,
            items
        }
    } catch (error) {
        console.error('Error:', error);
        return {
            "message" : "Not Found"
        }
    }
});