const { SSMClient, GetParameterCommand, PutParameterCommand } = require("@aws-sdk/client-ssm");
const axios = require("axios");

const ssmClient = new SSMClient({ region: "us-east-1" });

async function getParameter(name, decrypt = false) {
  const command = new GetParameterCommand({ Name: name, WithDecryption: decrypt });
  const response = await ssmClient.send(command);
  return response.Parameter?.Value;
}

async function updateAccessToken(name, value) {
  const command = new PutParameterCommand({
    Name: name,
    Value: value,
    Type: "SecureString",
    Overwrite: true,
  });
  await ssmClient.send(command);
}

exports.handler = async () => {
  const corsHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*", // You can replace * with "http://localhost:5173" for tighter security
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  };

  try {
    // Load secrets from Parameter Store
    const clientId = await getParameter("/journal/strava/client-id");
    const clientSecret = await getParameter("/journal/strava/client-secret", true);
    let accessToken = await getParameter("/journal/strava/access-token", true);
    let refreshToken = await getParameter("/journal/strava/refresh-token", true);

    // Test if access token is still valid
    try {
      await axios.get("https://www.strava.com/api/v3/athlete", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
    } catch (err) {
      if (err.response?.status === 401) {
        console.log("Access token expired. Refreshing...");

        const res = await axios.post("https://www.strava.com/api/v3/oauth/token", null, {
          params: {
            client_id: clientId,
            client_secret: clientSecret,
            refresh_token: refreshToken,
            grant_type: "refresh_token",
          },
        });

        accessToken = res.data.access_token;
        const newRefreshToken = res.data.refresh_token;

        await updateAccessToken("/journal/strava/access-token", accessToken);

        if (newRefreshToken !== refreshToken) {
          await updateAccessToken("/journal/strava/refresh-token", newRefreshToken);
        }
      } else {
        throw new Error("Failed to authenticate with Strava.");
      }
    }

    // Get recent activities
    const activityRes = await axios.get("https://www.strava.com/api/v3/athlete/activities", {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: { per_page: 10 },
    });

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(activityRes.data),
    };
  } catch (error) {
    console.error("Error fetching Strava data:", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Failed to fetch Strava activities" }),
    };
  }
};
