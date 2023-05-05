import {defineEventHandler, readBody} from "h3";
import {getDocument} from "~/server/repository/DocumentRepository";
import {uploadDTO} from "~/server/utils/githubStore";

export default defineEventHandler(async(event)=> {
    const { path, contentID } = await readBody(event);
    let fetchUrl = "";
    if(contentID === "Rate"){
        fetchUrl = "./api/rate/getRate";
    }else if (contentID === "StdRate"){
        fetchUrl = "./api/rate/getStdRate";
    }

    const uploadDto:uploadDTO = {
        owner: "RumbleKAT",
        repo: "HomeApplyServer",
        path: path,
        token: process.env.GITHUB_TOKEN
    };

    return await getDocument(uploadDto,fetchUrl);
});