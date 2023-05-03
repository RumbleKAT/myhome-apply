import {defineEventHandler, readBody} from "h3";
import {uploadDTO, uploadJsonToGitHub} from "~/server/utils/githubStore";

export default defineEventHandler(async (event) => {
    // @ts-ignore
    const { path, data } = await readBody(event);
    const uploadDto:uploadDTO = {
        owner: "RumbleKAT",
        repo: "HomeApplyServer",
        path: path,
        data: data,
        token: process.env.GITHUB_TOKEN
    };

    return await uploadJsonToGitHub(uploadDto);
});

