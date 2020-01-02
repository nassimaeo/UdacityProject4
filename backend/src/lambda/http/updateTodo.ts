import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'

// I added these imports
import * as AWS  from 'aws-sdk'
//import { getUserId } from '../utils'

const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Processing event: ', event)
  const todoId = event.pathParameters.todoId
  console.log("todoId", todoId)
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
  //const userId = getUserId(event)
  

  var params = {
    TableName:todosTable,
    Key:{
      "id":todoId
    },
    UpdateExpression: "SET #name = :newName, dueDate = :newDueDate, done = :newDone",
    ExpressionAttributeNames: {
      "#name": "name"
    }, 
    ExpressionAttributeValues:{
        ":newName": updatedTodo.name,
        ":newDueDate": updatedTodo.dueDate,
        ":newDone": updatedTodo.done
    },
    ReturnValues:"UPDATED_NEW"
  };

  const result = await docClient.update(params).promise()
  console.log("result update", result)
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({ })
  }        


}
