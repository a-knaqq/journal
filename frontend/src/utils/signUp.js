import {
    SignUpCommand,
    CognitoIdentityProviderClient,
  } from "@aws-sdk/client-cognito-identity-provider";
  

  const signUp = ({ clientId, username, password, email }) => {
    const client = new CognitoIdentityProviderClient({});
  
    const command = new SignUpCommand({
      ClientId: process.env.CLIENT_ID,
      Username: username,
      Password: password,
      UserAttributes: [{ Name: "email", Value: email }],
    });
  
    return client.send(command);
  };
//###############################################################













//###############################################################
  export { signUp };

