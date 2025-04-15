const { SNSClient, PublishCommand } = require('@aws-sdk/client-sns');
const sns = new SNSClient();

exports.handler = async (event) => {
  const { phoneNumber, message } = event;

  try {
    await sns.send(new PublishCommand({
      PhoneNumber: phoneNumber,
      Message: message,
    }));
    console.log(`SMS sent to ${phoneNumber}`);
  } catch (err) {
    console.error("Failed to send SMS:", err);
  }
};
