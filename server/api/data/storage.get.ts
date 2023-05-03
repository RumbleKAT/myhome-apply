import {defineEventHandler, getQuery } from "h3";
import {uploadDTO, getJsonFromGitHub } from "~/server/utils/githubStore";

export default defineEventHandler(async(event)=>{
    const {filename} = getQuery(event)
    const getFileDTO:uploadDTO = {
        owner: "RumbleKAT",
        repo: "HomeApplyServer",
        path: filename as string,
        token: process.env.GITHUB_TOKEN
    };
    
    return await getJsonFromGitHub(getFileDTO);
});