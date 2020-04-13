#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import DynamoDbStack from '../lib/dynamodb-stack';
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
 * Create GraphQL API
 */
const api = new ApiStack(app, 'PlacesApiStack', {
  env: { 'region': 'eu-west-1' },
  placeTable: dynamodbStack.table
})