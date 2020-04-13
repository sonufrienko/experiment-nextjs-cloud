import * as cdk from '@aws-cdk/core';
import * as appsync from '@aws-cdk/aws-appsync';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import { MappingTemplate, PrimaryKey, Values } from '@aws-cdk/aws-appsync';

const SCHEMA_FILE = './schema.graphql';

interface ApiStackProps extends cdk.StackProps {
  placeTable: dynamodb.Table;
}

export default class ApiStack extends cdk.Stack {
  api: appsync.GraphQLApi;

  constructor(scope: cdk.Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    const { placeTable } = props;

    this.api = new appsync.GraphQLApi(this, 'Api', {
      name: `places`,
      logConfig: {
        fieldLogLevel: appsync.FieldLogLevel.ERROR
      },
      schemaDefinitionFile: SCHEMA_FILE,
    });

    new appsync.CfnApiKey(this, 'ItemsApiKey', {
      apiId: this.api.apiId
    });

    const placeDS = this.api.addDynamoDbDataSource('Place', 'The Place data source', placeTable);

    placeDS.createResolver({
      typeName: 'Query',
      fieldName: 'allPlaces',
      requestMappingTemplate: MappingTemplate.fromString(`
        {
          "version": "2017-02-28",
          "operation": "Scan",
          "limit": $util.defaultIfNull($ctx.args.limit, 10),
          "nextToken": $util.toJson($util.defaultIfNullOrEmpty($ctx.args.nextToken, null))
        }
      `),
      responseMappingTemplate: MappingTemplate.fromString(`
        #**
          Scan and Query operations return a list of items and a nextToken. Pass them
          to the client for use in pagination.
        *#
        {
          "items": $util.toJson($ctx.result.items),
          "nextToken": $util.toJson($util.defaultIfNullOrBlank($context.result.nextToken, null))
        }
      `),
    });

    placeDS.createResolver({
      typeName: 'Query',
      fieldName: 'place',
      requestMappingTemplate: MappingTemplate.dynamoDbGetItem('placeId', 'placeId'),
      responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
    });

    placeDS.createResolver({
      typeName: 'Mutation',
      fieldName: 'createPlace',
      requestMappingTemplate: MappingTemplate.dynamoDbPutItem(
        PrimaryKey.partition('placeId').auto(),
        Values.projecting('input')),
      responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
    });

    placeDS.createResolver({
      typeName: 'Mutation',
      fieldName: 'updatePlace',
      requestMappingTemplate: MappingTemplate.dynamoDbPutItem(
        PrimaryKey.partition('placeId').is('placeId'),
        Values.projecting('input')),
      responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
    });

    placeDS.createResolver({
      typeName: 'Mutation',
      fieldName: 'deletePlace',
      requestMappingTemplate: MappingTemplate.dynamoDbDeleteItem('placeId', 'placeId'),
      responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
    });

    new cdk.CfnOutput(this, 'api-url', { value: this.api.graphQlUrl });
  }
};