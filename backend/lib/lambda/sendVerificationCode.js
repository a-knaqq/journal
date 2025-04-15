// sendVerificationCode.js
const { SNSClient, PublishCommand } = require('@aws-sdk/client-sns');
const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb');

const sns = new SNSClient();
const dynamodb = new DynamoDBClient();
const VERIFICATION_TABLE = process.env.VERIFICATION_TABLE;

exports.handler = async (event) => {
  try {
    const { phoneNumber } = JSON.parse(event.body);

    if (!phoneNumber) {
      return { statusCode: 400, body: JSON.stringify({ message: "Phone number is required" }) };
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const ttl = Math.floor(Date.now() / 1000) + 300; // expires in 5 minutes

    // Save to DynamoDB
    await dynamodb.send(new PutItemCommand({
      TableName: VERIFICATION_TABLE,
      Item: {
        phoneNumber: { S: phoneNumber },
        code: { S: code },
        ttl: { N: ttl.toString() }
      }
    }));

    // Send via SNS
    const message = `Your verification code is: ${code}`;
    await sns.send(new PublishCommand({
      PhoneNumber: phoneNumber,
      Message: message,
    }));

    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify({ message: "Verification code sent" }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ message: "Failed to send verification code" }),
    };
  }
};

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "https://andknapp.com",
    "Access-Control-Allow-Credentials": true,
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "OPTIONS,POST"
  };136
}
