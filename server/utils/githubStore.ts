export interface uploadDTO {
    owner: string,
    repo: string,
    path: string,
    data?: object,
    token: any
}
export const uploadJsonToGitHub = async (params:uploadDTO) => {
    const apiUrl = `https://api.github.com/repos/${params.owner}/${params.repo}/contents/${params.path}`;
    const headers = {
        Authorization: `token ${params.token}`,
        Accept: "application/vnd.github+json",
    };
    let resultMsg = null;

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
            "msg": "success"
        };
    } catch (error) {
        console.error("Error uploading JSON data:", error);
        resultMsg = {
            "msg": error
        };
    }
    return resultMsg;
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

        if (!response.ok) {
            throw new Error(`GitHub API responded with ${response.status}`);
        }

        const responseData = await response.json();
        const contentBase64 = responseData.content;
        const content = Buffer.from(contentBase64, "base64").toString("utf-8");

        console.log("Fetched content:", content);
        return content;
    } catch (error) {
        console.error("Error fetching file:", error);
        return {
            "message" : error
        };
    }
};
