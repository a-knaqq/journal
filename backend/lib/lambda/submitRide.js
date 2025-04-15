const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb');
const { v4: uuidv4 } = require('uuid');

const dynamoDBClient = new DynamoDBClient();
const TABLE_NAME = process.env.TABLE_NAME;

// Helper to extract userId from the request
const getUserIdFromEvent = (event) => {
  return event.requestContext?.authorizer?.jwt?.claims?.sub;
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': 'https://www.andknapp.com',
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': 'POST,OPTIONS',
      },
      body: '',
    };
  }

  try {
    const userId = getUserIdFromEvent(event);

    if (!userId) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Unauthorized: Missing user ID' }),
      };
    }

    const body = JSON.parse(event.body);
    const {
      frontTirePressure,
      rearTirePressure,
      frontSuspensionPressure,
      rearSuspensionPressure,
      avgTemperature,
      timeRode,
      numberOfDescents,
      distance,
      date,
    } = body;

    const rideId = uuidv4();
    const timestamp = new Date().toISOString();

    const item = {
      userId: { S: userId },
      rideId: { S: rideId },
      timestamp: { S: timestamp },
      date: { S: date || timestamp }, // use current timestamp if date is not provided
      frontTirePressure: { N: String(frontTirePressure) },
      rearTirePressure: { N: String(rearTirePressure) },
      frontSuspensionPressure: { N: String(frontSuspensionPressure) },
      rearSuspensionPressure: { N: String(rearSuspensionPressure) },
      avgTemperature: { N: String(avgTemperature) },
      timeRode: { N: String(timeRode) },
      numberOfDescents: { N: String(numberOfDescents) },
      distance: { N: String(distance) },
    };

    await dynamoDBClient.send(
      new PutItemCommand({
        TableName: TABLE_NAME,
        Item: item,
      })
    );

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': 'https://www.andknapp.com',
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': 'POST,OPTIONS',
      },
      body: JSON.stringify({ message: 'Ride submitted successfully!', rideId }),
    };
  } catch (error) {
    console.error("Error submitting ride:", error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': 'https://www.andknapp.com',
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': 'POST,OPTIONS',
      },
      body: JSON.stringify({ message: 'Failed to submit ride', error: error.message }),
    };
  }
};
