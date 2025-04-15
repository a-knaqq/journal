const { EventBridgeClient, CreateScheduleCommand } = require('@aws-sdk/client-scheduler');
const { v4: uuidv4 } = require('uuid');

const schedulerClient = new EventBridgeClient();

exports.handler = async (event) => {
  const { phoneNumber, message, scheduledTime } = JSON.parse(event.body); // ISO 8601 format

  if (!phoneNumber || !message || !scheduledTime) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing required fields.' }),
    };
  }

  const scheduleName = `sms-${uuidv4()}`;

  const command = new CreateScheduleCommand({
    Name: scheduleName,
    ScheduleExpression: `at(${scheduledTime})`,
    FlexibleTimeWindow: { Mode: 'OFF' },
    Target: {
      Arn: process.env.SEND_SMS_LAMBDA_ARN,
      RoleArn: process.env.EVENTBRIDGE_ROLE_ARN,
      Input: JSON.stringify({ phoneNumber, message }),
    },
  });

  try {
    await schedulerClient.send(command);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'SMS scheduled successfully!' }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to schedule SMS' }),
    };
  }
};
