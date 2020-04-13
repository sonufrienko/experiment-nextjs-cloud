import * as cdk from '@aws-cdk/core';
import * as cognito from "@aws-cdk/aws-cognito";

export default class CognitoStack extends cdk.Stack {
  userPool: cognito.UserPool;

  constructor(scope: cdk.Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    this.userPool = new cognito.UserPool(this, 'Userpool', {
      userPoolName: 'places',
      selfSignUpEnabled: true,
      signInAliases: {
        //Whether user is allowed to sign up or sign in with a username
        username: false,

        //Whether a user is allowed to sign up or sign in with an email address
        email: true
      }
    });

    new cdk.CfnOutput(this, 'pools-id', { value: this.userPool.userPoolId });

    /**
     * Create a WebClient for web app
     */
    this.createWebClient();
  }

  createWebClient() {
    const webClient = new cognito.UserPoolClient(this, 'UserpoolWebClient', {
      userPool: this.userPool,
      userPoolClientName: 'web-client',
      // @ts-ignore
      enabledAuthFlows: ['ALLOW_REFRESH_TOKEN_AUTH', 'ALLOW_CUSTOM_AUTH', 'ALLOW_USER_SRP_AUTH']
    });

    new cdk.CfnOutput(this, 'client-id', { value: webClient.userPoolClientId });
  }
};