#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import DynamoDbStack from '../lib/dynamodb-stack';

const app = new cdk.App();

/**
 * Create DynamoDB Table
 */
const dynamodbStack = new DynamoDbStack(app, 'PlacesDynamoDBStack', {
  env: { 'region': 'eu-west-1' },
  tableName: 'Places'
})