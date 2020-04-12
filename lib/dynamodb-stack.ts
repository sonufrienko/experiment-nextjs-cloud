import * as cdk from '@aws-cdk/core';
import * as dynamodb from '@aws-cdk/aws-dynamodb';

interface DynamoDbStackProps extends cdk.StackProps {
  tableName: string;
}

export default class DynamoDbStack extends cdk.Stack {
  table: dynamodb.Table;

  constructor(scope: cdk.Construct, id: string, props: DynamoDbStackProps) {
    super(scope, id, props);

    const { tableName } = props;

    this.table = new dynamodb.Table(this, 'PlacesTable', {
      tableName,
      partitionKey: { name: 'placeId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });
  }
};