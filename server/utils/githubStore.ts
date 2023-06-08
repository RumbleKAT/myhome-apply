import {convertToString} from "~/server/utils/typeUtil";

export interface uploadDTO {
    owner: string,
    repo: string,
    path: string,
    data?: any,
    token: any
}

export enum statusCode{
    error,
    success
}

export interface ResponseDTO{
    type: statusCode,
    message: string,
    data?: object
}

export const uploadJsonToGitHub = async (params:uploadDTO) => {
    const apiUrl = `https://api.github.com/repos/${params.owner}/${params.repo}/contents/${params.path}`;
    const headers = {
        Authorization: `token ${params.token}`,
        Accept: "application/vnd.github+json",
    };
    let resultMsg:ResponseDTO;

    try {
        console.log(params.data);
        // Convert the JavaScript object to JSON string and encode it in base64
        const jsonString = JSON.stringify(params.data, null, 2);
        const base64Content = Buffer.from(jsonString, "utf-8").toString("base64");

        // Check if the file exists
        const getFileResponse = await fetch(apiUrl, { headers });
        let sha;
        if (getFileResponse.status !== 404) {
            const fileData = await getFileResponse.json();
            sha = fileData.sha;
        }

        // Prepare the payload
        const payload:any = {
            message: "Upload JSON data",
            content: base64Content,
        };
        if (sha) {
            payload.sha = sha;
        }

        // Upload (or update) the JSON data
        const uploadResponse = await fetch(apiUrl, {
            method: "PUT",
            body: JSON.stringify(payload),
            headers,
        });

        if (!uploadResponse.ok) {
            throw new Error(`GitHub API responded with ${uploadResponse.status}`);
        }

        const responseData = await uploadResponse.json();
        console.log("JSON data uploaded successfully:", responseData);
        resultMsg = {
            type: statusCode.success,
            message: "save success"
        };
    } catch (error) {
        console.error("Error uploading JSON data:", error);
        resultMsg = {
            type: statusCode.error,
            message: convertToString(error)
        };
    }
    return resultMsg;
};


export const deleteJsonToGitHub = async (params:uploadDTO) => {
    return await fetch(`https://api.github.com/repos/${params.owner}/${params.repo}/contents/${params.path}`, {
        headers: {
            'Authorization': `token ${params.token}`,
            'Accept': 'application/vnd.github.v3+json'
        }
    })
        .then(response => response.json())
        .then(data => {
            const sha = data.sha;

            return fetch(`https://api.github.com/repos/${params.owner}/${params.repo}/contents/${params.path}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `token ${params.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                },
                body: JSON.stringify({
                    message: 'delete file',
                    sha: sha
                })
            });
        })
        .then(response => response.json())
        .then(data => {
            console.log('File deleted');
        })
        .catch(error => {
            console.error(error);
        });
};

export const getJsonFromGitHub = async (params:uploadDTO) => {
    const apiUrl = `https://api.github.com/repos/${params.owner}/${params.repo}/contents/${params.path}`;
    const headers = {
        Authorization: `token ${params.token}`,
        Accept: "application/vnd.github+json",
    };
    let resultMsg = null;

    try {
        const response = await fetch(apiUrl, { headers });
        console.log(response);
        console.log(params);

        if (!response.ok) {
            throw new Error(`GitHub API responded with ${response.status}`);
        }

        const responseData = await response.json();
        const contentBase64 = responseData.content;
        const content = Buffer.from(contentBase64, "base64").toString("utf-8");

        console.log("Fetched content:", content);
        return {
            type: statusCode.success,
            message: "save success",
            data: JSON.parse(content)
        };
    } catch (error) {
        console.error("Error fetching file:", error);
        return {
            type: statusCode.error,
            message: convertToString(error)
        };
    }
};
