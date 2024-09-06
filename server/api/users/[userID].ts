export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const userID = getRouterParam(event, "userID");
  const query = getQuery(event);

  if (query.appSecret == config.m2mAppSecret) {
    const accessTokenData = await fetch(`${config.logto.endpoint}/oidc/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${config.m2mAppID}:${config.m2mAppSecret}`
        ).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        resource: `${config.logto.endpoint}/api`,
        scope: "all",
      }).toString(),
    }).then((response) => response.json());

    const accessToken = accessTokenData.access_token;

    const data = await fetch(`${config.logto.endpoint}/api/users/${userID}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((response) => response.json());

    return data;
  } else {
    setResponseStatus(event, 401, "Yetkisiz.");
    return { response: "Yetkisiz." };
  }
});
