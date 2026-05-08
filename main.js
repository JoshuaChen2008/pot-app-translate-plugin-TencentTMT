function sha256(CryptoJS, message) {
    return CryptoJS.SHA256(message).toString(CryptoJS.enc.Hex);
}

function hmac256(CryptoJS, message, secret) {
    return CryptoJS.HmacSHA256(message, secret);
}

function getUtcDate(timestamp) {
    const date = new Date(timestamp * 1000);
    const year = date.getUTCFullYear();
    const month = (`0${date.getUTCMonth() + 1}`).slice(-2);
    const day = (`0${date.getUTCDate()}`).slice(-2);
    return `${year}-${month}-${day}`;
}

function buildAuthorization(CryptoJS, secretId, secretKey, endpoint, service, action, timestamp, payload) {
    const algorithm = "TC3-HMAC-SHA256";
    const date = getUtcDate(timestamp);
    const httpRequestMethod = "POST";
    const canonicalUri = "/";
    const canonicalQueryString = "";
    const canonicalHeaders = `content-type:application/json; charset=utf-8\nhost:${endpoint}\nx-tc-action:${action.toLowerCase()}\n`;
    const signedHeaders = "content-type;host;x-tc-action";
    const hashedRequestPayload = sha256(CryptoJS, payload);
    const canonicalRequest = [
        httpRequestMethod,
        canonicalUri,
        canonicalQueryString,
        canonicalHeaders,
        signedHeaders,
        hashedRequestPayload
    ].join("\n");

    const credentialScope = `${date}/${service}/tc3_request`;
    const stringToSign = [
        algorithm,
        timestamp,
        credentialScope,
        sha256(CryptoJS, canonicalRequest)
    ].join("\n");

    const secretDate = hmac256(CryptoJS, date, `TC3${secretKey}`);
    const secretService = hmac256(CryptoJS, service, secretDate);
    const secretSigning = hmac256(CryptoJS, "tc3_request", secretService);
    const signature = hmac256(CryptoJS, stringToSign, secretSigning).toString(CryptoJS.enc.Hex);

    return `${algorithm} Credential=${secretId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
}

async function translate(text, from, to, options) {
    const { config, utils } = options;
    const { tauriFetch: fetch, CryptoJS } = utils;
    const { secretId, secretKey, region = "ap-guangzhou", projectId = "0" } = config;

    if (!secretId || !secretKey) {
        throw "Missing Tencent Cloud SecretId or SecretKey";
    }

    const endpoint = "tmt.tencentcloudapi.com";
    const service = "tmt";
    const action = "TextTranslate";
    const version = "2018-03-21";
    const timestamp = Math.floor(Date.now() / 1000);
    const payload = JSON.stringify({
        SourceText: text,
        Source: from,
        Target: to,
        ProjectId: Number(projectId || 0)
    });

    const authorization = buildAuthorization(
        CryptoJS,
        secretId,
        secretKey,
        endpoint,
        service,
        action,
        timestamp,
        payload
    );

    const res = await fetch(`https://${endpoint}`, {
        method: "POST",
        url: `https://${endpoint}`,
        headers: {
            "Authorization": authorization,
            "Content-Type": "application/json; charset=utf-8",
            "Host": endpoint,
            "X-TC-Action": action,
            "X-TC-Timestamp": `${timestamp}`,
            "X-TC-Version": version,
            "X-TC-Region": region
        },
        body: {
            type: "Json",
            payload: JSON.parse(payload)
        }
    });

    if (!res.ok) {
        throw `Http Request Error\nHttp Status: ${res.status}\n${JSON.stringify(res.data)}`;
    }

    const response = res.data && res.data.Response;
    if (response && response.Error) {
        throw `${response.Error.Code}: ${response.Error.Message}`;
    }
    if (response && response.TargetText) {
        return response.TargetText;
    }

    throw `Unexpected Tencent Cloud response\n${JSON.stringify(res.data)}`;
}
