import {connect, disconnect, Connection, model } from 'mongoose';
import 'dotenv/config';

let database:Connection;

export const connectMongo = async () =>{
    const uri = encodeURI(process.env.MONGO_URL);
    console.log(uri);

    if(database) return;

    connect(uri,{
        dbName : 'HomeDB'
    },()=>{
        console.log('connected to database...');
    });
}

export const disConnectMongo = async () =>{
    if(!database) return;
    await disconnect();
}
