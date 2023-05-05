import {getJsonFromGitHub, ResponseDTO, statusCode, uploadDTO} from "~/server/utils/githubStore";

function getDaysApart(dateA: Date, dateB: Date): number {
    const oneDayInMilliseconds = 86400000;
    const timeDiff = Math.abs(dateB.getTime() - dateA.getTime());
    return Math.floor(timeDiff / oneDayInMilliseconds);
}

function isDateOver(dateA: Date, dateB: Date, diffDate: Number): boolean {
    const daysDiff = getDaysApart(dateA, dateB);
    return daysDiff > diffDate;
}

async function fetchLastModifiedDate(username: string, repo: string, path: string): Promise<Date | null> {
    const url = `https://api.github.com/repos/${username}/${repo}/commits?path=${encodeURIComponent(path)}&per_page=1`;

    const response = await fetch(url);

    if (response.ok) {
        const commits = await response.json();
        if (commits.length > 0) {
            const commit = commits[0];
            const lastModified = new Date(commit.commit.author.date);
            return lastModified;
        }
    }

    return null;
}

const saveDocument = async (url:string, uploadParam:uploadDTO) =>{
    const fetchedInfo = await fetch(url);
    if (fetchedInfo.status !== 404) {
        const data = await fetchedInfo.json();
        console.log(data);

        return await fetch(url,{
            method: 'POST',
            body: JSON.stringify({
                data: uploadParam.data,
                path: uploadParam.path
            })
        }).then((res)=>{
            console.log("upload:",res);
            return res.json();
        });
    }
    return {
        type: statusCode.error,
        message: "Not Found"
    }
}
export const getDocument = async (param:uploadDTO, fetchUrl:string) =>{
    const response:ResponseDTO = await getJsonFromGitHub(param)
    if(response.type === statusCode.success){
        // validate 1 week over
        const lastModifed = await fetchLastModifiedDate(
            param.owner,
            param.repo,
            param.path
        );
        if(lastModifed !== null && !isDateOver(lastModifed,new Date(),7))
           return response.data;
    }
    return await saveDocument(fetchUrl, param);
}
