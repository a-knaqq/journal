import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  SignUpCommand,
  ConfirmSignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";

// Create a Cognito client instance
const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION,
});

// Sign-in function
const signIn = async (email, password) => {
  const params = {
    AuthFlow: "USER_PASSWORD_AUTH",
    ClientId: process.env.CLIENT_ID,
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password,
    },
  };
  try {
    const command = new InitiateAuthCommand(params);
    const { AuthenticationResult } = await cognitoClient.send(command);
    return AuthenticationResult;
  } catch (error) {
    console.error("Error signing in: ", error);
    throw error;
  }
};

// Sign-up function
const signUp = async (email, password) => {
  const params = {
    ClientId: process.env.CLIENT_ID,
    Username: email,
    Password: password,
    UserAttributes: [
      {
        Name: "email",
        Value: email,
      },
    ],
  };
  try {
    const command = new SignUpCommand(params);
    const response = await cognitoClient.send(command);
    return response;
  } catch (error) {
    console.error("Error signing up: ", error);
    throw error;
  }
};

// Confirm sign-up function
const confirmSignUp = async (email, code) => {
  const params = {
    ClientId: process.env.CLIENT_ID,
    Username: email,
    ConfirmationCode: code,
  };
  try {
    const command = new ConfirmSignUpCommand(params);
    await cognitoClient.send(command);
    return true;
  } catch (error) {
    console.error("Error confirming sign up: ", error);
    throw error;
  }
};

// Lambda handler
export const handler = async (event) => {
  const { action, username, password, email, code } = JSON.parse(event.body);

  try {
    let response;

    switch (action) {
      case "signIn":
        response = await signIn(username, password);
        break;
      case "signUp":
        response = await signUp(email, password);
        break;
      case "confirmSignUp":
        response = await confirmSignUp(username, code);
        break;
      default:
        throw new Error("Invalid action");
    }

    return {
      statusCode: 200,
      body: JSON.stringify(response),
      headers: {
        'Acces-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, PUT, DELETE',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.message }),
      headers: {
        'Acces-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, PUT, DELETE',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    };
  }
};
