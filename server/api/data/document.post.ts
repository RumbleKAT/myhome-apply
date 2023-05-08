import {defineEventHandler, readBody} from "h3";
import {getDocument} from "~/server/repository/DocumentRepository";
import {uploadDTO} from "~/server/utils/githubStore";

export default defineEventHandler(async(event)=> {
    const { path } = await readBody(event);
    let fetchUrl = "";
    if (path.includes("StdRate")){
        fetchUrl = `${process.env.BASE_URL}/api/rate/getStdRate`;
    }else if(path.includes("Rate")){
        fetchUrl = `${process.env.BASE_URL}/api/rate/getRate`;
    }

    const uploadDto:uploadDTO = {
        owner: "RumbleKAT",
        repo: "HomeApplyServer",
        path: path,
        token: process.env.GITHUB_TOKEN
    };

    return await getDocument(uploadDto,fetchUrl);
});