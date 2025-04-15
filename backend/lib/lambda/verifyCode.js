// verifyCode.js
const { DynamoDBClient, GetItemCommand, DeleteItemCommand } = require('@aws-sdk/client-dynamodb');

const dynamodb = new DynamoDBClient();
const VERIFICATION_TABLE = process.env.VERIFICATION_TABLE;

exports.handler = async (event) => {
  try {
    const { phoneNumber, code } = JSON.parse(event.body);

    if (!phoneNumber || !code) {
      return { statusCode: 400, body: JSON.stringify({ message: "Missing phone number or code" }) };
    }

    const result = await dynamodb.send(new GetItemCommand({
      TableName: VERIFICATION_TABLE,
      Key: {
        phoneNumber: { S: phoneNumber }
      }
    }));

    if (!result.Item || result.Item.code.S !== code) {
      return {
        statusCode: 401,
        headers: corsHeaders(),
        body: JSON.stringify({ message: "Invalid verification code" }),
      };
    }

    // Optional: Delete used code
    await dynamodb.send(new DeleteItemCommand({
      TableName: VERIFICATION_TABLE,
      Key: {
        phoneNumber: { S: phoneNumber }
      }
    }));

    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify({ message: "Phone number verified" }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ message: "Verification failed" }),
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
