import 'dotenv/config';
import { App } from '@slack/bolt'

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGN
});

export const sendMessage = async function(param:string){
    const result = await app.client.chat.postMessage({
        token: process.env.SLACK_BOT_TOKEN,
        channel: 'test',
        text: param
      });
    console.log(result)
};