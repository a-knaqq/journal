const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, QueryCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient();
const ddbDocClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME;
const USER_ID_INDEX = "UserIdIndex";

exports.handler = async (event) => {
  try {
    const userId = event.queryStringParameters?.userId;

    if (!userId) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "https://www.andknapp.com",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "OPTIONS,GET,POST",
        },
        body: JSON.stringify({ error: "Missing userId in query parameters" }),
      };
    }

    const command = new QueryCommand({
      TableName: TABLE_NAME,
      IndexName: USER_ID_INDEX,
      KeyConditionExpression: "userId = :uid",
      ExpressionAttributeValues: {
        ":uid": userId,
      },
    });

    const data = await ddbDocClient.send(command);

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "https://www.andknapp.com",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,GET,POST",
      },
      body: JSON.stringify(data.Items),
    };
  } catch (error) {
    console.error("Error fetching rides:", error);

    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "https://www.andknapp.com",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,GET,POST",
      },
      body: JSON.stringify({ error: "Failed to fetch rides" }),
    };
  }
};
