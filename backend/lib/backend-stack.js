const cdk = require("aws-cdk-lib");
const lambda = require("aws-cdk-lib/aws-lambda");
const apigateway = require("aws-cdk-lib/aws-apigateway");
const route53 = require("aws-cdk-lib/aws-route53");
const route53Targets = require("aws-cdk-lib/aws-route53-targets");
const certificatemanager = require("aws-cdk-lib/aws-certificatemanager");
const s3 = require("aws-cdk-lib/aws-s3");
const s3deploy = require("aws-cdk-lib/aws-s3-deployment");
const cloudfront = require("aws-cdk-lib/aws-cloudfront");
const origins = require("aws-cdk-lib/aws-cloudfront-origins");
const dynamodb = require("aws-cdk-lib/aws-dynamodb");
const iam = require("aws-cdk-lib/aws-iam");
const targets = require("aws-cdk-lib/aws-events-targets");
const { Rule, Schedule } = require("aws-cdk-lib/aws-events");
const { NodejsFunction } = require('aws-cdk-lib/aws-lambda-nodejs');
const { Construct } = require("constructs");

class BackendStack extends cdk.Stack {
  /**
   * @param {Construct} scope
   * @param {string} id
   * @param {cdk.StackProps} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    const domainName = "andknapp.com";
    const apiSubdomain = `api.${domainName}`;
    const frontendSubdomain = `www.${domainName}`;

    // DynamoDB Table
    const ridesTable = new dynamodb.Table(this, "RidesTable", {
      partitionKey: { name: "rideId", type: dynamodb.AttributeType.STRING },
      tableName: "RideTrackingData",
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    ridesTable.addGlobalSecondaryIndex({
      indexName: 'UserIdIndex',
      partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    const verificationTable = new dynamodb.Table(this, "PhoneVerificationCodes", {
      partitionKey: { name: "phoneNumber", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      timeToLiveAttribute: "ttl",
    });

    const eventBridgeRole = new iam.Role(this, 'EventBridgeInvokeLambdaRole', {
      assumedBy: new iam.ServicePrincipal('scheduler.amazonaws.com'),
    });

    //------------------------ Lambda Functions ------------------------------------------------

    // Lambda to send SMS
const sendSmsLambda = new NodejsFunction(this, 'SendSmsLambda', {
  entry: '../backend/lib/lambda/sendSms.js',
  handler: 'handler',
  runtime: lambda.Runtime.NODEJS_18_X,
});

sendSmsLambda.addToRolePolicy(new iam.PolicyStatement({
  actions: ['sns:Publish'],
  resources: ['*'], // For production, restrict to specific SNS topic or phone numbers if possible
}));

// Lambda to schedule SMS
const scheduleSmsLambda = new NodejsFunction(this, 'ScheduleSmsLambda', {
  entry: '../backend/lib/lambda/scheduleSms.js',
  handler: 'handler',
  runtime: lambda.Runtime.NODEJS_18_X,
  environment: {
    EVENTBRIDGE_ROLE_ARN: eventBridgeRole.roleArn,
    SEND_SMS_LAMBDA_ARN: sendSmsLambda.functionArn, // Now sendSmsLambda is available here
    AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
  },
});

scheduleSmsLambda.addToRolePolicy(new iam.PolicyStatement({
  actions: ['scheduler:CreateSchedule'],
  resources: ['*'], // In production, scope down to a specific scheduler group if needed
}));


// Submit Ride Lambda
const submitRideLambda = new NodejsFunction(this, 'SubmitRideLambda', {
  entry: '../backend/lib/lambda/submitRide.js',
  handler: 'handler',
  runtime: lambda.Runtime.NODEJS_18_X,
  environment: {
    TABLE_NAME: ridesTable.tableName,
  },
});

// Get Rides Lambda
const getRidesLambda = new lambda.Function(this, "GetRidesLambda", {
  runtime: lambda.Runtime.NODEJS_18_X,
  code: lambda.Code.fromAsset("../backend/lib/lambda"),
  handler: "getRides.handler",
  environment: {
    TABLE_NAME: ridesTable.tableName,
  },
});


ridesTable.grantReadWriteData(submitRideLambda);
ridesTable.grantReadData(getRidesLambda);

//---------------- APi Gateway Infra/Routing --------------------------------------------

// API Gateway
const api = new apigateway.RestApi(this, "JournalApi", {
  restApiName: "Journal API",
  description: "API Gateway for Journal Lambda Functions",
  deployOptions: {
    stageName: "prod",
  },
});

// Define /rides route
const journalResource = api.root.addResource("journal");
const ridesResource = journalResource.addResource("rides");

api.root.resourceForPath('schedule-sms').addMethod('POST', new apigateway.LambdaIntegration(scheduleSmsLambda));
// CORS Preflight (OPTIONS)
ridesResource.addMethod("OPTIONS", new apigateway.MockIntegration({
  integrationResponses: [{
    statusCode: "200",
    responseParameters: {
      "method.response.header.Access-Control-Allow-Headers": "'Content-Type'",
      "method.response.header.Access-Control-Allow-Origin": "'*'",
      "method.response.header.Access-Control-Allow-Methods": "'OPTIONS,GET,POST'",
    },
    responseTemplates: {
      "application/json": "",
    },
  }],
  passthroughBehavior: apigateway.PassthroughBehavior.NEVER,
  requestTemplates: {
    "application/json": '{"statusCode": 200}',
  },
}), {
  methodResponses: [{
    statusCode: "200",
    responseParameters: {
      "method.response.header.Access-Control-Allow-Headers": true,
      "method.response.header.Access-Control-Allow-Origin": true,
      "method.response.header.Access-Control-Allow-Methods": true,
    },
  }],
});

// POST /rides
ridesResource.addMethod("POST", new apigateway.LambdaIntegration(submitRideLambda, {
  integrationResponses: [
    {
      statusCode: "200",
      responseParameters: {
        "method.response.header.Access-Control-Allow-Origin": "'*'",
        "method.response.header.Access-Control-Allow-Headers": "'Content-Type'",
        "method.response.header.Access-Control-Allow-Methods": "'OPTIONS,GET,POST'",
      },
    },
  ],
}), {
  methodResponses: [
    {
      statusCode: "200",
      responseParameters: {
        "method.response.header.Access-Control-Allow-Origin": true,
        "method.response.header.Access-Control-Allow-Headers": true,
        "method.response.header.Access-Control-Allow-Methods": true,
      },
    },
  ],
});

// GET /rides
ridesResource.addMethod("GET", new apigateway.LambdaIntegration(getRidesLambda, {
  integrationResponses: [
    {
      statusCode: "200",
      responseParameters: {
        "method.response.header.Access-Control-Allow-Origin": "'*'",
        "method.response.header.Access-Control-Allow-Headers": "'Content-Type'",
        "method.response.header.Access-Control-Allow-Methods": "'OPTIONS,GET,POST'",
      },
    },
  ],
}), {
  methodResponses: [
    {
      statusCode: "200",
      responseParameters: {
        "method.response.header.Access-Control-Allow-Origin": true,
        "method.response.header.Access-Control-Allow-Headers": true,
        "method.response.header.Access-Control-Allow-Methods": true,
      },
    },
  ],
});

//-------------------------- Domain Infra ------------------------------------------------------

const hostedZone = route53.HostedZone.fromLookup(this, "HostedZone", {
  domainName: domainName,
});

const certificate = new certificatemanager.Certificate(this, "Certificate", {
  domainName: frontendSubdomain,
  subjectAlternativeNames: [domainName, apiSubdomain],
  validation: certificatemanager.CertificateValidation.fromDns(hostedZone),
    });

    const apiDomain = new apigateway.DomainName(this, "ApiDomain", {
      domainName: apiSubdomain,
      certificate: certificate,
    });

    new route53.ARecord(this, "ApiAliasRecord", {
      zone: hostedZone,
      recordName: apiSubdomain, // "api.andknapp.com"
      target: route53.RecordTarget.fromAlias(new route53Targets.ApiGatewayDomain(apiDomain)),
    });

    // Map root path of domain to the API
    new apigateway.BasePathMapping(this, "ApiBasePathMapping", {
      domainName: apiDomain,
      restApi: api,
      basePath: "journal", // maps to root e.g., /rides
    });

    // ---------------------- Frontend infra ------------------------

    const siteBucket = new s3.Bucket(this, "SiteBucket", {
      bucketName: frontendSubdomain,
      websiteIndexDocument: "index.html",
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ACLS,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    siteBucket.addToResourcePolicy(new iam.PolicyStatement({
      actions: ["s3:GetObject"],
      resources: [`${siteBucket.bucketArn}/*`],
      effect: iam.Effect.ALLOW,
      principals: [new iam.ArnPrincipal("*")],
    }));

    const oai = new cloudfront.OriginAccessIdentity(this, "OAI");
    siteBucket.grantRead(oai);

    const distribution = new cloudfront.Distribution(this, "SiteDistribution", {
      defaultRootObject: "index.html",
      domainNames: [frontendSubdomain, domainName],
      certificate,
      defaultBehavior: {
        origin: new origins.S3BucketOrigin(siteBucket, { originAccessIdentity: oai }),
        compress: true,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: "/index.html",
          ttl: cdk.Duration.minutes(1),
        },
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: "/index.html",
          ttl: cdk.Duration.minutes(1),
        },
      ],
    });

    new s3deploy.BucketDeployment(this, "DeployWebsite", {
      sources: [s3deploy.Source.asset("../frontend/frontend-client/dist")],
      destinationBucket: siteBucket,
      distribution,
      distributionPaths: ["/*"],
    });

    new route53.ARecord(this, "CloudFrontAliasRecord", {
      zone: hostedZone,
      recordName: frontendSubdomain,
      target: route53.RecordTarget.fromAlias(new route53Targets.CloudFrontTarget(distribution)),
    });

// Redirect bucket for andknapp.com → www.andknapp.com
const redirectBucket = new s3.Bucket(this, 'RedirectBucket', {
  bucketName: 'andknapp.com',
  websiteRedirect: {
    hostName: 'www.andknapp.com',
    protocol: s3.RedirectProtocol.HTTPS,
  },
  publicReadAccess: true,
  blockPublicAccess: s3.BlockPublicAccess.BLOCK_ACLS, // <-- this is the key line
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
});

// Allow public access (CloudFront will access this)
redirectBucket.addToResourcePolicy(new iam.PolicyStatement({
  actions: ["s3:GetObject"],
  resources: [`${redirectBucket.bucketArn}/*`],
  effect: iam.Effect.ALLOW,
  principals: [new iam.ArnPrincipal("*")],
}));

// CloudFront distribution for redirecting root domain
const redirectDistribution = new cloudfront.Distribution(this, "RedirectDistribution", {
  defaultRootObject: "index.html",
  domainNames: [domainName],
  certificate,
  defaultBehavior: {
    origin: new origins.S3BucketOrigin(redirectBucket),
    viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
  },
});

// Route53 record for root domain -> redirect CloudFront
new route53.ARecord(this, "RootRedirectAliasRecord", {
  zone: hostedZone,
  recordName: domainName,
  target: route53.RecordTarget.fromAlias(new route53Targets.CloudFrontTarget(redirectDistribution)),
});
  }
}

module.exports = { BackendStack };
