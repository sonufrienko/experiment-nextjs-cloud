#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import DynamoDbStack from '../lib/dynamodb-stack';
import CognitoStack from '../lib/cognito-stack';
import ApiStack from '../lib/api-stack';

const app = new cdk.App();

/**
 * Create DynamoDB Table
 */
const dynamodbStack = new DynamoDbStack(app, 'PlacesDynamoDBStack', {
  env: { 'region': 'eu-west-1' },
  tableName: 'Places'
})

/**
 * Create Cognito
 */
const cognitoStack = new CognitoStack(app, 'PlacesCognitoStack', {
  env: { 'region': 'eu-west-1' }
})

/**
 * Create GraphQL API
 */
const api = new ApiStack(app, 'PlacesApiStack', {
  env: { 'region': 'eu-west-1' },
  placeTable: dynamodbStack.table,
  userPool: cognitoStack.userPool
})