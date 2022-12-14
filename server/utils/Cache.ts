import * as redis from 'redis'
import 'dotenv/config';

const client = redis.createClient({
    url : `redis://${process.env.REDIS_URL}`
});

export const openConnection = async() =>{
    await client.connect();
}

export const closeConnection = async () =>{
    await client.quit();
}

export const getCache = async(key:string) => {
    // console.log(key);
    try{
        return JSON.parse(await client.get(key));
    }catch(err){
        // console.error(err);
        return '';
    }
}

export const setCache = async(key:string, value:string, time:number) => {
    try{
        await client.set(key,value);
        await client.expire(key, time);
    }catch(err){
        console.error(err);
    }
}