import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as AWS  from 'aws-sdk'
import { getUserId } from '../utils'

const docClient = new AWS.DynamoDB.DocumentClient()

const todosTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user
  console.log('Processing event: ', event)
  const userId = getUserId(event)
  
  const result = await docClient.scan({
    TableName: todosTable,
    ProjectionExpression: "#todoId, createdAt, #name, dueDate, #done, attachmentUrl",
    FilterExpression: "#userId = :userId",
    ExpressionAttributeNames: {
        "#userId": "userId",
        "#name": "name",
        "#done": "done",
        "#todoId": "todoId"
    },
    ExpressionAttributeValues: {
         ":userId": userId
    }
  }).promise()

  const items = result.Items

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      items
    })
  }  
}
