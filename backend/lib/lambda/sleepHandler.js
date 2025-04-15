const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb');
const { v4: uuidv4 } = require('uuid');

const client = new DynamoDBClient();
const TABLE_NAME = process.env.TABLE_NAME;

exports.handler = async (event) => {
  try {
    const data = JSON.parse(event.body);
    const id = uuidv4();

    await client.send(new PutItemCommand({
      TableName: TABLE_NAME,
      Item: {
        id: { S: id },
        ...Object.entries(data).reduce((acc, [key, value]) => {
          acc[key] = { S: String(value) };
          return acc;
        }, {})
      }
    }));

    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify({ message: "Sleep entry saved." }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ message: "Error saving sleep entry." }),
    };
  }
};

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "https://andknapp.com",
    "Access-Control-Allow-Credentials": true,
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "OPTIONS,POST"
  };
}
