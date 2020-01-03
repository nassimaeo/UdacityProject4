import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

// I added these imports
import { getUserId } from '../utils'
import { deleteTodoItem } from '../../businessLogic/todos'



export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Processing event: ', event)
  const todoId = event.pathParameters.todoId
  console.log("todoId", todoId)

  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
  const userId = getUserId(event)
  
  /*
  var params = {
    TableName:todosTable,
    Key:{
      "userId": userId,      
      "todoId":todoId
    }
  };

  const result = await docClient.delete(params).promise()
  */

  const result = await deleteTodoItem(userId, todoId)
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

