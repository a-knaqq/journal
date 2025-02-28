// Environment variables for Strava credentials
const STRAVA_CLIENT_ID = process.env.STRAVA_CLIENT_ID;
const STRAVA_CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET;
const STRAVA_REFRESH_TOKEN = process.env.STRAVA_REFRESH_TOKEN;
//####################################################################################
let cachedData = null; // Cache fetched data
let lastFetchTime = 0;
const CACHE_DURATION = 3600 * 1000; // 1 hour in milliseconds
//####################################################################################
const refreshAccessToken = async () => {
  const response = await fetch("https://www.strava.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: STRAVA_CLIENT_ID,
      client_secret: STRAVA_CLIENT_SECRET,
      grant_type: "refresh_token",
      refresh_token: STRAVA_REFRESH_TOKEN,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to refresh access token: ${response.statusText}`);
  }

  const data = await response.json();
  return data.access_token;
};
//####################################################################################
const fetchStravaData = async (accessToken) => {
  const response = await fetch("https://www.strava.com/api/v3/athlete/activities", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Strava data: ${response.statusText}`);
  }

  return await response.json();
};
//####################################################################################
exports.handler = async (event) => {
  const now = Date.now();

  if (cachedData && now - lastFetchTime < CACHE_DURATION) {
    return {
      statusCode: 200,
      body: JSON.stringify(cachedData),
    };
  }

  try {
    const accessToken = await refreshAccessToken();
    const data = await fetchStravaData(accessToken);

    cachedData = data; // Cache the data
    lastFetchTime = now;

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch Strava data" }),
    };
  }
};
//####################################################################################


https://www.strava.com/oauth/authorize?client_id=143403&redirect_uri=http://localhost:3000&response_type=code&scope=read,activity:read_all&approval_prompt=auto

http://localhost:3000/?state=&code=e4591972e9ee9eeb8e042f36d996a54a00e55d53&scope=read,activity:read_all