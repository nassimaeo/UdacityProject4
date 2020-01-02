import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'

// I added these imports
import * as AWS  from 'aws-sdk'
import * as uuid from 'uuid'
import { getUserId } from '../utils'

const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Processing event: ', event)
  const newTodo: CreateTodoRequest = JSON.parse(event.body)

  // TODO: Implement creating a new TODO item
  const todoId = uuid.v4()
  const userId = getUserId(event)
  
  const newItem = {
      id : todoId,
      todoId : todoId,
      createdAt: new Date().toISOString(),
      userId: userId, // Can be abbreviated to just "userId,"
      done: false,
      //attachmentUrl: "http://example.com/image.png", // TODO fix this
      ...newTodo
  }

  await docClient.put({
      TableName: todosTable,
      Item : newItem
  }).promise()

  return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
          item: newItem
      })
  }  

}
