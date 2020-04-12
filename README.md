![](cover.jpg)

# Infrastructure as Code with AWS CDK

This is the infrastructure for [this project](https://github.com/sonufrienko/experiment-nextjs).

## Features

- Serverless Architecture
- DynamoDB

## How to deploy

```bash
npm run build
cdk synth
cdk deploy

# Deploy only HostingStack using "sg-profile" AWS profile
cdk deploy HostingStack --profile=sg-profile
```

## Useful commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `npm run test` perform the jest unit tests
- `cdk deploy` deploy this stack to your default AWS account/region
- `cdk diff` compare deployed stack with current state
- `cdk synth` emits the synthesized CloudFormation template
