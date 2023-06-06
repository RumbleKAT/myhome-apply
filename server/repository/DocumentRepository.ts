import {getJsonFromGitHub, ResponseDTO, statusCode, uploadDTO} from "~/server/utils/githubStore";

function getDaysApart(dateA: Date, dateB: Date): number {
    const oneDayInMilliseconds = 86400000;
    const timeDiff = Math.abs(dateB.getTime() - dateA.getTime());
    return Math.floor(timeDiff / oneDayInMilliseconds);
}

function isDateOver(dateA: Date, dateB: Date, diffDate: number): boolean {
    const daysDiff = getDaysApart(dateA, dateB);
    return daysDiff > diffDate;
}

async function fetchFileHistory(
    owner: string,
    repo: string,
    path: string,
    authToken: string
): Promise<Date | null> {
    const url = `https://api.github.com/repos/${owner}/${repo}/commits?path=${encodeURIComponent(path)}`;

    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${authToken}`,
            'Accept': 'application/vnd.github.v3+json'
        }
    });

    if (response.ok) {
        const commits = await response.json();
        if (commits.length > 0) {
            const lastModifiedTimestamp = commits[0].commit.committer.date;
            const lastModified = new Date(lastModifiedTimestamp);
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
        return await fetch(`${process.env.BASE_URL}/api/data/storage`,{
            method: 'POST',
            body: JSON.stringify({
                data: data,
                path: uploadParam.path
            })
        }).then((res)=>{
            console.log("upload:",res);
            return data;
        });
    }
    return {
        type: statusCode.error,
        message: "Not Found"
    }
}
export const getDocument = async (param:uploadDTO, fetchUrl:string) =>{
    // @ts-ignore
    const response:ResponseDTO = await getJsonFromGitHub(param)
    if(response.type === statusCode.success){
        // validate 1 week over
        const lastModifed = await fetchFileHistory(
            param.owner,
            param.repo,
            param.path,
            param.token
        );
        console.log(lastModifed);
        if(lastModifed !== null && !isDateOver(lastModifed,new Date(),7)){
            console.log("not refresh!");
            if(response.data){
                // @ts-ignore
                return JSON.parse(response.data);
            }
        }
    }
    console.log("refresh!");
    return await saveDocument(fetchUrl, param);
}
