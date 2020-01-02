import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

// I added these imports
import * as AWS  from 'aws-sdk'
//import { getUserId } from '../utils'
const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Processing event: ', event)
  const todoId = event.pathParameters.todoId
  console.log("todoId", todoId)

  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
  //const userId = getUserId(event)
  

  var params = {
    TableName:todosTable,
    Key:{
      "id":todoId
    }
  };

  const result = await docClient.delete(params).promise()
  console.log("result delete", result)
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({})
  }        



}

